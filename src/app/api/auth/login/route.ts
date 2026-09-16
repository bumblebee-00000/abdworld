import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  createSession,
  setSessionCookie,
  checkLoginRateLimit,
  resetLoginAttempts,
} from '@/lib/auth/session';
import { loginSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email or password format.' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkLoginRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            'Too many login attempts. Please wait 15 minutes and try again.',
        },
        { status: 429 }
      );
    }

    const isValid = await verifyAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    resetLoginAttempts(ip);

    const token = await createSession('1', email);
    await setSessionCookie(token);

    return NextResponse.json({ success: true, email });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}