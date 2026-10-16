import { createHmac, timingSafeEqual } from 'node:crypto';

interface PaymentLinkInput {
  orderId: string;
  amountPaise: number;
  description: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  expireBy: number;
}

interface RazorpayPaymentLink {
  id: string;
  short_url: string;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayPaymentLink(input: PaymentLinkInput) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Razorpay is not configured.');

  const response = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: 'INR',
      accept_partial: false,
      expire_by: input.expireBy,
      reference_id: input.orderId,
      description: input.description,
      customer: {
        name: input.customerName,
        contact: input.customerPhone,
        ...(input.customerEmail ? { email: input.customerEmail } : {}),
      },
      notify: { sms: true, email: Boolean(input.customerEmail) },
      reminder_enable: false,
      notes: { order_id: input.orderId },
    }),
    signal: AbortSignal.timeout(10000),
  });

  const result = await response.json() as RazorpayPaymentLink & { error?: { description?: string } };
  if (!response.ok || !result.id || !result.short_url) {
    throw new Error(result.error?.description || 'Razorpay could not create a payment link.');
  }

  return { id: result.id, url: result.short_url };
}

export function verifyRazorpayWebhookSignature(rawBody: string, signature: string | null): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature || !/^[a-f0-9]{64}$/i.test(signature)) return false;

  const expected = createHmac('sha256', webhookSecret).update(rawBody).digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}