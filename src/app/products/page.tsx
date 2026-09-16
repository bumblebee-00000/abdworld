import type { Metadata } from 'next';
import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import ProductGrid from '@/components/products/ProductGrid';
import ProductSearchWrapper from '@/components/products/ProductSearchWrapper';
import { FALLBACK_PRODUCTS } from '@/lib/products/catalog';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Rice Collection',
  description:
    'Browse our premium rice collection. Basmati, Non-Basmati, and specialty rice varieties available for wholesale. ABD World Rice - trusted quality.',
  openGraph: {
    title: 'Rice Collection | ABD World Rice',
    description: 'Browse our premium rice collection at wholesale prices.',
  },
};

const PAGE_SIZE = 12;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10) || 1) : 1;
  const query = typeof params.q === 'string' ? params.q : '';
  const rawCategory = typeof params.category === 'string' ? params.category : '';
  const filterCategories = rawCategory.split(',').map((c) => c.trim()).filter(Boolean);

  let allProducts: Product[] = [];
  let totalPages = 1;
  let allCategories: string[] = [];

  try {
    const supabase = getSupabaseAdmin();

    let queryBuilder = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,short_description.ilike.%${query}%,category.ilike.%${query}%,rice_type.ilike.%${query}%`
      );
    }

    if (filterCategories.length > 0) {
      queryBuilder = queryBuilder.in('category', filterCategories);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: products, count } = await queryBuilder
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
    allProducts = (products as Product[]) ?? [];

    const { data: categoryData } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true);

    allCategories = [...new Set((categoryData ?? []).map((c: { category: string }) => c.category))].sort();
  } catch {
    // Database unavailable — fall back to an empty catalogue view.
  }

  if (allProducts.length === 0 && !query && filterCategories.length === 0) {
    allProducts = FALLBACK_PRODUCTS;
    totalPages = 1;
    allCategories = [...new Set(FALLBACK_PRODUCTS.map((product) => product.category))].sort();
  }

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="premium-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(250,204,21,0.3) 0%, transparent 60%)' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-16 sm:px-10 lg:px-16">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-emerald-300/80">
            <Link href="/" className="transition-colors hover:text-gold-300">Home</Link>
            <span className="text-emerald-500/50">/</span>
            <span className="text-gold-300">Rice Collection</span>
          </nav>

          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Rice <span className="text-gradient">Collection</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-emerald-100/80">
            Explore our curated selection of premium rice varieties sourced from the finest farms across India.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          {/* Search */}
          <div className="mb-10">
            <ProductSearchWrapper categories={allCategories} />
          </div>

          {/* Grid */}
          <ProductGrid products={allProducts} />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/products?page=${p}${query ? `&q=${query}` : ''}${rawCategory ? `&category=${rawCategory}` : ''}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                    p === page
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-white text-emerald-700 border border-cream-300 hover:border-emerald-400 hover:bg-emerald-50'
                  }`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
