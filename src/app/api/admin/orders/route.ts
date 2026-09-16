import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const validStatuses = [
  'new',
  'contacted',
  'confirmed',
  'processing',
  'completed',
  'cancelled',
];

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ orders: [] });
    }

    const { searchParams } = new URL(request.url);
    const limitStr = searchParams.get('limit');
    const limit = limitStr ? parseInt(limitStr, 10) : 100;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 100));

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch orders.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: data });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required.' },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid order status.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update order.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ order: data });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}