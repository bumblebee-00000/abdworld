import type { MetadataRoute } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { FALLBACK_PRODUCTS } from '@/lib/products/catalog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abdworld.in';
  let productSlugs = FALLBACK_PRODUCTS.map((product) => product.slug);

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from('products')
      .select('slug')
      .eq('is_active', true);

    if (data?.length) productSlugs = data.map((product) => product.slug);
  } catch {
    // Keep fallback product pages discoverable when the database is unavailable.
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [
    ...staticPages,
    ...productSlugs.map((slug) => ({
      url: `${baseUrl}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
