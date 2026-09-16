import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        settings: {
          business_name: 'ABD WORLD',
          logo_url: '/company-logo.png',
          phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+919999999999',
          whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999',
          email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'contact@abdworld.in',
          address: 'Aminpur Bazar, Boalghata Road, Paltadanga, West Bengal 743423',
          city: 'Barasat',
          state: 'West Bengal',
          about_content: '',
          business_hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
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
        { error: 'Failed to fetch site settings.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Site settings not found.' },
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