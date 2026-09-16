import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';
import { FALLBACK_PRODUCTS } from '@/lib/products/catalog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        total_products: FALLBACK_PRODUCTS.length,
        active_products: FALLBACK_PRODUCTS.filter((product) => product.is_active).length,
        new_orders: 0,
        new_enquiries: 0,
      });
    }

    const supabase = getSupabaseAdmin();

    const [productsRes, activeProductsRes, ordersRes, wholesaleRes, contactRes] =
      await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new'),
        supabase
          .from('wholesale_enquiries')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new'),
        supabase
          .from('contact_messages')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new'),
      ]);

    if (
      productsRes.error ||
      activeProductsRes.error ||
      ordersRes.error ||
      wholesaleRes.error ||
      contactRes.error
    ) {
      return NextResponse.json(
        { error: 'Failed to fetch stats.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      total_products: productsRes.count || 0,
      active_products: activeProductsRes.count || 0,
      new_orders: ordersRes.count || 0,
      new_enquiries: (wholesaleRes.count || 0) + (contactRes.count || 0),
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}