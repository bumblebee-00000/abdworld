import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import Hero from '@/components/hero/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import QualityProcess from '@/components/home/QualityProcess';
import AboutPreview from '@/components/home/AboutPreview';
import Stats from '@/components/home/Stats';
import CTASection from '@/components/home/CTASection';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { FALLBACK_PRODUCTS } from '@/lib/products/catalog';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: 'ABD World Rice - Premium Rice Wholesaler & Supplier',
  description:
    'Premium quality rice wholesaler and supplier. We offer Basmati, Non-Basmati, and specialty rice varieties at wholesale prices. Trusted quality for retailers, restaurants, and businesses.',
};

export default async function Home() {
  let featuredProducts: Product[] = FALLBACK_PRODUCTS;

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3);

    if (data && data.length > 0) featuredProducts = data as Product[];
  } catch {
    // Keep the local catalogue visible when the database is unavailable.
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts products={featuredProducts} />
        <WhyChooseUs />
        <QualityProcess />
        <AboutPreview />
        <Stats />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}