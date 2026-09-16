import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_SECRET = new TextEncoder().encode(
  process.env.ADMIN_INITIAL_PASSWORD + 'rice_session_secret_key_2024'
);

const COOKIE_NAME = 'admin_session';

export interface SessionPayload {
  adminId: string;
  email: string;
  expiresAt: number;
}

export async function createSession(adminId: string, email: string): Promise<string> {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const token = await new SignJWT({ adminId, email, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SESSION_SECRET);

  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    const p = payload as unknown as SessionPayload;
    if (p.expiresAt < Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60,
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (email !== adminEmail) return false;

  if (password === adminPassword) {
    try {
      const supabase = getSupabaseAdmin();
      const hash = await bcrypt.hash(password, 12);
      await supabase.from('admins').upsert({
        id: '1',
        email: adminEmail,
        password_hash: hash,
      });
    } catch {
      // The environment password remains valid when the database is unavailable.
    }
    return true;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('admins')
      .select('password_hash')
      .eq('email', email)
      .single();

    if (data) {
      return bcrypt.compare(password, data.password_hash);
    }

    if (error) return false;
  } catch {
    // Use the local environment credentials when Supabase is unavailable.
  }

  return password === adminPassword;
}

// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record || now > record.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }

  if (record.count >= 5) return false;

  record.count++;
  return true;
}

export function resetLoginAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}
