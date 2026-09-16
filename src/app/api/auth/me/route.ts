import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ adminId: session.adminId, email: session.email });
  } catch {
    return NextResponse.json(
      { error: 'Failed to verify session.' },
      { status: 500 }
    );
  }
}