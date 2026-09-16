import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { sanitizeInput } from '@/lib/utils';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }

  if (entry.count >= 10) return false;

  entry.count++;
  return true;
}

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

    if (!checkRateLimit(ip)) {
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

    const { error } = await supabase.from('orders').insert({
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
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to submit order. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Order submitted successfully' });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
