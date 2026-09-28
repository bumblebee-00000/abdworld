import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { escapeHtml, sanitizeInput } from '@/lib/utils';
import { checkSubmissionRateLimit } from '@/lib/rate-limit';

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

  const requiredFields = ['customer_name', 'phone', 'address', 'city', 'state', 'pin_code', 'product_id', 'product_name', 'pack_size', 'quantity'];

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

    const validation = validateOrderData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: order, error } = await supabase.from('orders').insert({
      customer_name: validation.sanitized.customer_name,
      phone: validation.sanitized.phone,
      email: validation.sanitized.email || null,
      address: validation.sanitized.address,
      city: validation.sanitized.city,
      state: validation.sanitized.state,
      pin_code: validation.sanitized.pin_code,
      product_id: validation.sanitized.product_id,
      product_name: validation.sanitized.product_name,
      pack_size: validation.sanitized.pack_size,
      quantity: validation.sanitized.quantity,
      message: validation.sanitized.message || null,
      status: 'new',
    }).select('id').single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to submit order. Please try again.' },
        { status: 500 }
      );
    }

    const reference = order.id.slice(0, 8).toUpperCase();
    const orderSummary = `${validation.sanitized.product_name} / ${validation.sanitized.pack_size} / ${validation.sanitized.quantity}`;

    try {
      await transporter.sendMail({
        from: gmailUser,
        to: gmailUser,
        replyTo: String(validation.sanitized.email || validation.sanitized.phone),
        subject: `Order enquiry ${reference}: ${validation.sanitized.product_name}`,
        html: `<p>New order enquiry ${reference}</p><p>${escapeHtml(String(orderSummary))}</p><p>Customer: ${escapeHtml(String(validation.sanitized.customer_name))}</p><p>Phone: ${escapeHtml(String(validation.sanitized.phone))}</p>`,
      });
    } catch (emailError) {
      console.error('Order enquiry notification email failed:', emailError);
    }

    if (validation.sanitized.email) {
      try {
        await transporter.sendMail({
          from: gmailUser,
          to: String(validation.sanitized.email),
          subject: `We received your ABD WORLD request (${reference})`,
          html: `<p>Hello ${escapeHtml(String(validation.sanitized.customer_name))},</p><p>We received your request for ${escapeHtml(String(orderSummary))}.</p><p>Reference: <strong>${reference}</strong></p><p>This is a request only, not a confirmed order. We will contact you to confirm availability, pricing, and delivery.</p>`,
        });
      } catch (emailError) {
        console.error('Order enquiry receipt email failed:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      reference,
      message: 'Request submitted successfully.',
    });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
