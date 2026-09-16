import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';
import { FALLBACK_PRODUCTS } from '@/lib/products/catalog';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required.' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      const product = FALLBACK_PRODUCTS.find((item) => item.id === id);
      return product
        ? NextResponse.json({ product })
        : NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch product.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ product: data });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required.' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Connect Supabase before deactivating products.' },
        { status: 503 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .update({
        is_active: false,
        stock_status: 'out_of_stock',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to deactivate product.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ product: data });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}