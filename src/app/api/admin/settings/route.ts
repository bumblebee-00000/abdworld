import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        settings: {
          id: '1',
          business_name: 'ABD WORLD',
          logo_url: '/company-logo.png',
          phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+919999999999',
          whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999',
          email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'abdworldinfo@gmail.com',
          address: 'Aminpur Bazar, Boalghata Road, Paltadanga, West Bengal 743423',
          city: 'Barasat',
          state: 'West Bengal',
          about_content: '',
          business_hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
          facebook_url: null,
          instagram_url: null,
          youtube_url: null,
          updated_at: new Date().toISOString(),
        },
      });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', '1')
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch settings.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Settings not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ settings: data });
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

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Connect Supabase before saving settings.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const allowedFields = [
      'business_name',
      'logo_url',
      'phone',
      'whatsapp_number',
      'email',
      'address',
      'city',
      'state',
      'about_content',
      'business_hours',
      'facebook_url',
      'instagram_url',
      'youtube_url',
    ];

    const updateData: Record<string, string | null> = {
      updated_at: new Date().toISOString(),
    };

    for (const field of allowedFields) {
      if (field in body) {
        const value = body[field];
        if (typeof value === 'string') {
          updateData[field] = value.trim() || null;
        } else if (value === null) {
          updateData[field] = null;
        }
      }
    }

    if (!updateData.business_name) {
      return NextResponse.json(
        { error: 'Business name cannot be empty.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('site_settings')
      .update(updateData)
      .eq('id', '1')
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update settings.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ settings: data });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}