import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

import ProductDetailClient from '@/components/products/ProductDetailClient';
import { getFallbackProduct } from '@/lib/products/catalog';
import type { Product } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fallbackProduct = getFallbackProduct(slug);

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).single();

    if (!data && !fallbackProduct) return { title: 'Product Not Found' };

    const product = (data as Product | null) ?? fallbackProduct;

    if (!product) return { title: 'Product Not Found' };

    return {
      title: product.seo_title || product.name,
      description: product.seo_description || product.short_description,
      openGraph: {
        title: product.seo_title || product.name,
        description: product.seo_description || product.short_description,
        images: product.main_image ? [{ url: product.main_image, width: 1200, height: 630, alt: product.name }] : [],
        type: 'website',
      },
    };
  } catch {
    if (fallbackProduct) {
      return {
        title: fallbackProduct.seo_title || fallbackProduct.name,
        description: fallbackProduct.seo_description || fallbackProduct.short_description,
        openGraph: {
          title: fallbackProduct.name,
          description: fallbackProduct.short_description,
          images: [{ url: fallbackProduct.main_image, width: 1200, height: 630, alt: fallbackProduct.name }],
          type: 'website',
        },
      };
    }
    return { title: 'Product Not Found' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    product = data && !error ? (data as Product) : getFallbackProduct(slug);

    if (!product) notFound();

    if (data) {
      const { data: relatedData } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4);

      relatedProducts = (relatedData as Product[]) ?? [];
    }
  } catch {
    product = getFallbackProduct(slug);
  }

  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description,
    image: product.main_image,
    brand: { '@type': 'Brand', name: 'ABD World Rice' },
    category: product.category,
    offers: product.price
      ? {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.price,
          availability: product.stock_status === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        }
      : undefined,
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="premium-gradient relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-10 sm:px-10 lg:px-16">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-emerald-300/80">
            <Link href="/" className="transition-colors hover:text-gold-300">Home</Link>
            <span className="text-emerald-500/50">/</span>
            <Link href="/products" className="transition-colors hover:text-gold-300">Products</Link>
            <span className="text-emerald-500/50">/</span>
            <span className="text-gold-300">{product.name}</span>
          </nav>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-emerald-300/70">{product.category}</p>
        </div>
      </section>

      {/* Product Detail */}
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
