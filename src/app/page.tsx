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
  title: 'ABD WORLD - Premium Rice Wholesaler & Supplier',
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
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500" />
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  What businesses need
                </span>
                <span className="h-px w-8 bg-gold-500" />
              </span>
              <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">
                Rice supply built for real business demand
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                {
                  title: 'Retailers',
                  text: 'Consistent quality and dependable pack sizes that keep shelves full and customers coming back.',
                },
                {
                  title: 'Restaurants',
                  text: 'Reliable grain quality for daily kitchen performance, taste consistency, and smooth service flow.',
                },
                {
                  title: 'Caterers & Hotels',
                  text: 'Bulk supply support, dependable lead times, and product quality built for volume service.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-50 to-white p-7 shadow-[0_18px_40px_rgba(2,44,34,0.05)]">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-800 to-emerald-600 text-lg font-bold text-white">
                    {item.title.slice(0, 1)}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-emerald-950">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-emerald-900/75">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section-padding bg-emerald-950">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
                    Client confidence
                  </span>
                  <span className="h-px w-8 bg-gold-500" />
                </span>
                <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                  Trusted by businesses that value quality and consistency.
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  'Premium grain quality',
                  'Bulk order support',
                  'Fast response time',
                  'Reliable supply flow',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-emerald-50/90">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Stats />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}