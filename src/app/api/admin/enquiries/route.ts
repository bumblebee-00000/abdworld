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
      return NextResponse.json({ wholesale: [], contact: [] });
    }

    const { searchParams } = new URL(request.url);
    const limitStr = searchParams.get('limit');
    const limit = limitStr ? parseInt(limitStr, 10) : 100;

    const supabase = getSupabaseAdmin();

    const [wholesaleRes, contactRes] = await Promise.all([
      supabase
        .from('wholesale_enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(Math.min(Math.max(limit, 1), 100)),
      supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(Math.min(Math.max(limit, 1), 100)),
    ]);

    if (wholesaleRes.error || contactRes.error) {
      return NextResponse.json(
        { error: 'Failed to fetch enquiries.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      wholesale: wholesaleRes.data,
      contact: contactRes.data,
    });
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
    const { id, type, status } = body;

    if (!id || !type || !status) {
      return NextResponse.json(
        { error: 'Enquiry ID, type, and status are required.' },
        { status: 400 }
      );
    }

    if (type !== 'wholesale' && type !== 'contact') {
      return NextResponse.json(
        { error: 'Invalid enquiry type.' },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid enquiry status.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const table =
      type === 'wholesale' ? 'wholesale_enquiries' : 'contact_messages';

    const { data, error } = await supabase
      .from(table)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update enquiry.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Enquiry not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ enquiry: data });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}