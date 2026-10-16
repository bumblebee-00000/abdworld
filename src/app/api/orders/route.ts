import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { escapeHtml, sanitizeInput, parsePackWeightKg } from '@/lib/utils';
import { checkSubmissionRateLimit } from '@/lib/rate-limit';
import { getEffectivePrices } from '@/lib/products/pricing';
import { createRazorpayPaymentLink, isRazorpayConfigured } from '@/lib/payments/razorpay';

const gmailUser = process.env.GMAIL_USER || 'abdworldinfo@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: gmailUser, pass: process.env.GMAIL_APP_PASSWORD || '' },
});

function validateOrderData(data: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
  sanitized: Record<string, unknown>;
} {
  const errors: string[] = [];
  const sanitized: Record<string, unknown> = {};

  const requiredFields = ['customer_name', 'phone', 'product_id', 'pack_size', 'quantity'];

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && (data[field] as string).trim() === '')) {
      errors.push(`${field} is required`);
    }
  }

  if (data.phone && (typeof data.phone !== 'string' || (data.phone as string).replace(/\D/g, '').length < 10)) {
    errors.push('Valid phone number is required');
  }

  if (data.email && data.email !== '' && typeof data.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email address');
    }
  }

  if (data.quantity && (typeof data.quantity !== 'number' || (data.quantity as number) < 1)) {
    errors.push('Quantity must be at least 1');
  }

  if (typeof data.quantity === 'number' && (!Number.isInteger(data.quantity) || data.quantity > 10000)) {
    errors.push('Quantity must be a whole number no greater than 10000');
  }

  if (data.product_id && typeof data.product_id === 'string') {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.product_id)) {
      errors.push('Invalid product ID');
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value.trim());
    } else {
      sanitized[key] = value;
    }
  }

  return { valid: errors.length === 0, errors, sanitized };
}

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

    if (!checkSubmissionRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid order details.' }, { status: 400 });
    }

    const validation = validateOrderData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const productId = String(validation.sanitized.product_id);
    const selectedPackSize = String(validation.sanitized.pack_size);
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('name, price, scheduled_price, price_effective_at, pack_sizes, min_order_quantity')
      .eq('id', productId)
      .eq('is_active', true)
      .maybeSingle();

    if (productError) {
      return NextResponse.json({ error: 'Could not verify this product. Please try again.' }, { status: 500 });
    }

    if (!product || !product.pack_sizes.includes(selectedPackSize)) {
      return NextResponse.json({ error: 'This product or pack size is no longer available.' }, { status: 400 });
    }

    const packWeightKg = parsePackWeightKg(selectedPackSize);
    if (!packWeightKg) {
      return NextResponse.json({ error: 'Please contact us to confirm the minimum for this pack size.' }, { status: 400 });
    }

    const minimumOrderKg = Math.max(1, Number(product.min_order_quantity) || 1);
    const minimumPackCount = Math.ceil(minimumOrderKg / packWeightKg);
    if (Number(validation.sanitized.quantity) < minimumPackCount) {
      return NextResponse.json({
        error: `Minimum order is ${minimumOrderKg} kg (${minimumPackCount} packs of ${selectedPackSize}).`,
      }, { status: 400 });
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json({ error: 'Online payment is not available right now. Please contact us.' }, { status: 503 });
    }

    const price = getEffectivePrices({
      price: product.price,
      wholesale_price: null,
      scheduled_price: product.scheduled_price,
      scheduled_wholesale_price: null,
      price_effective_at: product.price_effective_at,
    }).price;
    if (price == null || price <= 0) {
      return NextResponse.json({ error: 'This product does not have an online retail price. Please contact us.' }, { status: 400 });
    }

    const unitPrice = Number(price.toFixed(2));
    const quantity = Number(validation.sanitized.quantity);
    const totalKg = packWeightKg * quantity;
    const amountPaise = Math.round(unitPrice * totalKg * 100);
    if (amountPaise < 100) {
      return NextResponse.json({ error: 'The order total must be at least ₹1.00 for online payment.' }, { status: 400 });
    }

    const now = Date.now();
    const effectiveAt = product.scheduled_price != null && product.price_effective_at
      ? Date.parse(product.price_effective_at)
      : NaN;
    const priceChangeIsUpcoming = Number.isFinite(effectiveAt) && effectiveAt > now;
    const minimumLinkLifetimeSeconds = 15 * 60;
    const sixMonthsFromNow = new Date(now);
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    const expireBy = Math.floor(Math.min(
      priceChangeIsUpcoming ? effectiveAt : now + 30 * 60 * 1000,
      sixMonthsFromNow.getTime(),
    ) / 1000);

    if (expireBy < Math.floor(now / 1000) + minimumLinkLifetimeSeconds) {
      return NextResponse.json({
        error: 'The current price is too close to its change time for online payment. Please contact us for the current price.',
      }, { status: 409 });
    }

    const { data: order, error } = await supabase.from('orders').insert({
      customer_name: validation.sanitized.customer_name,
      phone: validation.sanitized.phone,
      email: validation.sanitized.email || null,
      address: validation.sanitized.address || '',
      city: validation.sanitized.city || '',
      state: validation.sanitized.state || '',
      pin_code: validation.sanitized.pin_code || '',
      product_id: validation.sanitized.product_id,
      product_name: product.name,
      pack_size: selectedPackSize,
      quantity,
      message: validation.sanitized.message || null,
      status: 'new',
      unit_price: unitPrice,
      total_amount: Number((amountPaise / 100).toFixed(2)),
      currency: 'INR',
      payment_status: 'pending',
      payment_expires_at: new Date(expireBy * 1000).toISOString(),
    }).select('id').single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to submit order. Please try again.' },
        { status: 500 }
      );
    }

    const reference = order.id.slice(0, 8).toUpperCase();
    const orderSummary = `${product.name} / ${selectedPackSize} / ${quantity} packs`;
    let paymentLink: { id: string; url: string };

    try {
      paymentLink = await createRazorpayPaymentLink({
        orderId: order.id,
        amountPaise,
        description: `Full advance for ${orderSummary}`,
        customerName: String(validation.sanitized.customer_name),
        customerPhone: String(validation.sanitized.phone),
        customerEmail: validation.sanitized.email ? String(validation.sanitized.email) : null,
        expireBy,
      });
    } catch (paymentError) {
      console.error('Razorpay payment link creation failed:', paymentError);
      await supabase.from('orders').update({
        payment_status: 'failed',
        updated_at: new Date().toISOString(),
      }).eq('id', order.id);
      return NextResponse.json({ error: 'Could not start online payment. Please try again.' }, { status: 502 });
    }

    const { error: paymentLinkSaveError } = await supabase.from('orders').update({
      razorpay_payment_link_id: paymentLink.id,
      payment_link_url: paymentLink.url,
      updated_at: new Date().toISOString(),
    }).eq('id', order.id);

    if (paymentLinkSaveError) {
      console.error('Could not save Razorpay payment link for order:', order.id, paymentLinkSaveError);
    }

    try {
      await transporter.sendMail({
        from: gmailUser,
        to: gmailUser,
        replyTo: String(validation.sanitized.email || validation.sanitized.phone),
        subject: `Payment pending ${reference}: ${product.name}`,
        html: `<p>New checkout ${reference} is waiting for payment.</p><p>${escapeHtml(orderSummary)}</p><p>Total: ₹${(amountPaise / 100).toFixed(2)} INR</p><p>Customer: ${escapeHtml(String(validation.sanitized.customer_name))}</p><p>Phone: ${escapeHtml(String(validation.sanitized.phone))}</p><p><a href="${escapeHtml(paymentLink.url)}">Open payment link</a></p>`,
      });
    } catch (emailError) {
      console.error('Pending payment notification email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      reference,
      paymentUrl: paymentLink.url,
      amount: Number((amountPaise / 100).toFixed(2)),
      expiresAt: new Date(expireBy * 1000).toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
