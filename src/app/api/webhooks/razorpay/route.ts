import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { escapeHtml } from '@/lib/utils';
import { verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay';

export const runtime = 'nodejs';

interface PaymentLinkWebhookEvent {
  event?: string;
  payload?: {
    payment_link?: { entity?: {
      reference_id?: string;
      amount?: number;
      amount_paid?: number;
      expire_by?: number;
      status?: string;
    } };
    payment?: { entity?: {
      id?: string;
      amount?: number;
      currency?: string;
      status?: string;
      captured?: boolean;
      created_at?: number;
    } };
  };
}

const gmailUser = process.env.GMAIL_USER || 'abdworldinfo@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: gmailUser, pass: process.env.GMAIL_APP_PASSWORD || '' },
});

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!verifyRazorpayWebhookSignature(rawBody, request.headers.get('x-razorpay-signature'))) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
  }

  let event: PaymentLinkWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PaymentLinkWebhookEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload.' }, { status: 400 });
  }

  const paymentLink = event.payload?.payment_link?.entity;
  const orderId = paymentLink?.reference_id;
  if (!orderId) return NextResponse.json({ received: true });

  const supabase = getSupabaseAdmin();
  if (event.event === 'payment_link.expired') {
    await supabase.from('orders').update({
      payment_status: 'expired',
      updated_at: new Date().toISOString(),
    }).eq('id', orderId).eq('payment_status', 'pending');
    return NextResponse.json({ received: true });
  }

  if (event.event !== 'payment_link.paid') {
    return NextResponse.json({ received: true });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment?.id || payment.status !== 'captured' || payment.captured !== true) {
    return NextResponse.json({ received: true });
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, customer_name, email, product_name, pack_size, quantity, total_amount, payment_status, status, payment_expires_at')
    .eq('id', orderId)
    .maybeSingle();

  if (orderError) return NextResponse.json({ error: 'Could not verify order.' }, { status: 500 });
  if (!order || ['paid', 'paid_late', 'review'].includes(order.payment_status)) {
    return NextResponse.json({ received: true });
  }

  const expectedAmountPaise = Math.round(Number(order.total_amount) * 100);
  const receivedAmountPaise = Number(paymentLink.amount_paid ?? payment.amount);
  if (
    payment.currency !== 'INR' ||
    paymentLink.status !== 'paid' ||
    paymentLink.amount !== expectedAmountPaise ||
    receivedAmountPaise !== expectedAmountPaise ||
    payment.amount !== expectedAmountPaise
  ) {
    console.error('Razorpay paid event does not match order amount:', order.id);
    await supabase.from('orders').update({
      payment_status: 'review',
      razorpay_payment_id: payment.id,
      updated_at: new Date().toISOString(),
    }).eq('id', order.id).in('payment_status', ['pending', 'expired']);
    return NextResponse.json({ received: true });
  }

  const deadlineSeconds = order.payment_expires_at
    ? Math.floor(Date.parse(order.payment_expires_at) / 1000)
    : null;
  const paymentWasLate = deadlineSeconds !== null && Number(payment.created_at) > deadlineSeconds;
  if (paymentWasLate || order.status === 'cancelled' || order.payment_status !== 'pending') {
    await supabase.from('orders').update({
      payment_status: 'paid_late',
      razorpay_payment_id: payment.id,
      updated_at: new Date().toISOString(),
    }).eq('id', order.id).in('payment_status', ['pending', 'expired']);
    return NextResponse.json({ received: true });
  }

  const { data: updatedOrder, error: updateError } = await supabase.from('orders').update({
    payment_status: 'paid',
    razorpay_payment_id: payment.id,
    status: 'confirmed',
    updated_at: new Date().toISOString(),
  }).eq('id', order.id).eq('payment_status', 'pending').select('id').maybeSingle();

  if (updateError) return NextResponse.json({ error: 'Could not confirm payment.' }, { status: 500 });
  if (!updatedOrder) return NextResponse.json({ received: true });

  const orderSummary = `${order.product_name} / ${order.pack_size} / ${order.quantity} packs`;
  try {
    await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      subject: `Payment received for order ${order.id.slice(0, 8).toUpperCase()}`,
      html: `<p>Payment received and order confirmed.</p><p>${escapeHtml(orderSummary)}</p><p>Total: ₹${expectedAmountPaise / 100} INR</p><p>Customer: ${escapeHtml(order.customer_name)}</p>`,
    });
  } catch (emailError) {
    console.error('Paid order notification email failed:', emailError);
  }

  if (order.email) {
    try {
      await transporter.sendMail({
        from: gmailUser,
        to: order.email,
        subject: `Payment received - ABD WORLD order ${order.id.slice(0, 8).toUpperCase()}`,
        html: `<p>Hello ${escapeHtml(order.customer_name)},</p><p>Your payment has been received and your order is confirmed.</p><p>${escapeHtml(orderSummary)}</p><p>Total paid: ₹${(expectedAmountPaise / 100).toFixed(2)} INR</p><p>We will contact you to confirm delivery arrangements.</p>`,
      });
    } catch (emailError) {
      console.error('Customer payment receipt email failed:', emailError);
    }
  }

  return NextResponse.json({ received: true });
}