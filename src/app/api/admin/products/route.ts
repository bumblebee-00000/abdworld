import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';
import { productSchema } from '@/lib/validation';
import { FALLBACK_PRODUCTS } from '@/lib/products/catalog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ products: FALLBACK_PRODUCTS });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: data });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Connect Supabase before adding products.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid product data. Please check the form fields.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: parsed.data.name,
        slug: parsed.data.slug,
        category: parsed.data.category,
        short_description: parsed.data.short_description,
        full_description: parsed.data.full_description,
        main_image: parsed.data.main_image,
        images: parsed.data.images || [],
        video_url: parsed.data.video_url || null,
        price: parsed.data.price,
        wholesale_price: parsed.data.wholesale_price,
        pack_sizes: parsed.data.pack_sizes,
        rice_type: parsed.data.rice_type,
        origin: parsed.data.origin,
        grain_length: parsed.data.grain_length || '',
        aroma: parsed.data.aroma || '',
        texture: parsed.data.texture || '',
        cooking_info: parsed.data.cooking_info || '',
        best_used_for: parsed.data.best_used_for || '',
        min_order_quantity: parsed.data.min_order_quantity,
        stock_status: parsed.data.stock_status,
        is_featured: parsed.data.is_featured,
        is_active: parsed.data.is_active,
        seo_title: parsed.data.seo_title || '',
        seo_description: parsed.data.seo_description || '',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A product with this slug already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create product.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: data }, { status: 201 });
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
        { error: 'Connect Supabase before editing products.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, ...productData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required.' },
        { status: 400 }
      );
    }

    const parsed = productSchema.safeParse(productData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid product data. Please check the form fields.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .update({
        name: parsed.data.name,
        slug: parsed.data.slug,
        category: parsed.data.category,
        short_description: parsed.data.short_description,
        full_description: parsed.data.full_description,
        main_image: parsed.data.main_image,
        images: parsed.data.images || [],
        video_url: parsed.data.video_url || null,
        price: parsed.data.price,
        wholesale_price: parsed.data.wholesale_price,
        pack_sizes: parsed.data.pack_sizes,
        rice_type: parsed.data.rice_type,
        origin: parsed.data.origin,
        grain_length: parsed.data.grain_length || '',
        aroma: parsed.data.aroma || '',
        texture: parsed.data.texture || '',
        cooking_info: parsed.data.cooking_info || '',
        best_used_for: parsed.data.best_used_for || '',
        min_order_quantity: parsed.data.min_order_quantity,
        stock_status: parsed.data.stock_status,
        is_featured: parsed.data.is_featured,
        is_active: parsed.data.is_active,
        seo_title: parsed.data.seo_title || '',
        seo_description: parsed.data.seo_description || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A product with this slug already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to update product.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: data });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}