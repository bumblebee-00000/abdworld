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
  title: 'ABD WORLD | Premium Rice Wholesaler & Supplier',
  description:
    'ABD WORLD supplies Basmati, Non-Basmati and specialty rice to retailers, restaurants, hotels and bulk buyers. Enquire for wholesale rice supply and business requirements.',
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

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500" />
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Who we serve
                </span>
                <span className="h-px w-8 bg-gold-500" />
              </span>
              <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">
                Built for business
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: 'Retailers',
                  text: 'For grocery stores and retail businesses.',
                },
                {
                  title: 'Restaurants',
                  text: 'For regular commercial rice requirements.',
                },
                {
                  title: 'Hotels & Caterers',
                  text: 'For larger-volume requirements.',
                },
                {
                  title: 'Wholesale Buyers',
                  text: 'For bulk purchasing and recurring supply.',
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

        <section className="section-padding bg-emerald-50">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500" />
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  What we supply
                </span>
                <span className="h-px w-8 bg-gold-500" />
              </span>
              <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">
                Rice varieties for different business needs
              </h2>
            </div>

            <div className="mt-12 grid gap-7 lg:grid-cols-3">
              {[
                {
                  title: 'Basmati Rice',
                  text: 'Premium aromatic rice varieties for retail and commercial requirements.',
                  icon: '🌾',
                },
                {
                  title: 'Non-Basmati Rice',
                  text: 'Reliable everyday rice options for different business requirements.',
                  icon: '🥬',
                },
                {
                  title: 'Specialty Rice',
                  text: 'Selected rice varieties based on customer requirements.',
                  icon: '✨',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[2rem] border border-emerald-900/10 bg-white p-7 shadow-[0_18px_40px_rgba(2,44,34,0.05)]">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-100 to-gold-300 text-2xl shadow-[0_10px_25px_rgba(250,204,21,0.25)]">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-emerald-950">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-emerald-900/75">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FeaturedProducts products={featuredProducts} />

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500" />
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Why ABD WORLD
                </span>
                <span className="h-px w-8 bg-gold-500" />
              </span>
              <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">
                Business-focused supply built on trust
              </h2>
            </div>

            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Consistent Quality', 'Quality-focused sourcing for dependable supply.'],
                ['Competitive Pricing', 'Wholesale-oriented pricing for business buyers.'],
                ['Multiple Varieties', 'Basmati, Non-Basmati and specialty rice options.'],
                ['Bulk Supply', 'Solutions for retailers and commercial buyers.'],
                ['Reliable Support', 'Quick assistance for enquiries and orders.'],
                ['Business-Focused Service', 'Focused on long-term wholesale relationships.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[1.8rem] border border-emerald-900/10 bg-emerald-50 p-7 shadow-[0_18px_40px_rgba(2,44,34,0.04)]">
                  <h3 className="font-heading text-2xl font-bold text-emerald-950">{title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-emerald-900/75">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-emerald-950">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center text-white">
              <span className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500" />
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
                  How it works
                </span>
                <span className="h-px w-8 bg-gold-500" />
              </span>
              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Simple, professional wholesale process</h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {[
                ['01', 'Tell Us Your Requirement', 'Select the rice variety and quantity you need.'],
                ['02', 'Get Your Quote', 'We provide availability and wholesale pricing.'],
                ['03', 'Confirm Your Order', 'Finalize quantity and order details.'],
                ['04', 'Receive Your Supply', 'Delivery/dispatched according to the agreed arrangement.'],
              ].map(([step, title, text]) => (
                <div key={step} className="rounded-[2rem] border border-white/10 bg-white/5 p-7 text-white shadow-[0_20px_45px_rgba(0,0,0,0.18)]">
                  <div className="text-sm font-bold uppercase tracking-[0.28em] text-gold-400">{step}</div>
                  <h3 className="mt-4 font-heading text-2xl font-bold">{title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-emerald-50/80">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="bulk-quote" className="section-padding bg-white">
          <div className="mx-auto max-w-6xl rounded-[2.25rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-50 to-white p-7 shadow-[0_25px_60px_rgba(2,44,34,0.06)] lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <span className="inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    Bulk quote
                  </span>
                  <span className="h-px w-8 bg-gold-500" />
                </span>
                <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">Request a Bulk Quote</h2>
                <p className="mt-4 text-base leading-relaxed text-emerald-900/75">
                  Tell us what you need and our team can guide you with available options, packaging, and wholesale requirements.
                </p>
              </div>

              <form className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-emerald-900">Name</span>
                  <input type="text" className="w-full rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-950 outline-none ring-0 transition focus:border-emerald-700" placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-emerald-900">Business Name</span>
                  <input type="text" className="w-full rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-950 outline-none ring-0 transition focus:border-emerald-700" placeholder="Business name" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-emerald-900">Phone / WhatsApp</span>
                  <input type="tel" className="w-full rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-950 outline-none ring-0 transition focus:border-emerald-700" placeholder="98753 51399" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-emerald-900">Location</span>
                  <input type="text" className="w-full rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-950 outline-none ring-0 transition focus:border-emerald-700" placeholder="City / location" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-emerald-900">Rice Type</span>
                  <select className="w-full rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-700">
                    <option>Basmati</option>
                    <option>Non-Basmati</option>
                    <option>Specialty</option>
                    <option>Not sure</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-emerald-900">Approximate Quantity</span>
                  <input type="text" className="w-full rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-950 outline-none ring-0 transition focus:border-emerald-700" placeholder="e.g. 500 kg / 1 tonne" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-emerald-900">Message</span>
                  <textarea rows={4} className="w-full rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-950 outline-none ring-0 transition focus:border-emerald-700" placeholder="Tell us about your requirement, quantity and delivery location." />
                </label>
                <div className="sm:col-span-2">
                  <button type="submit" className="gold-gradient inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-bold text-emerald-950 shadow-[0_12px_25px_rgba(250,204,21,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(250,204,21,0.45)]">
                    Submit Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="section-padding bg-emerald-50">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-900/10 bg-white p-8 text-center shadow-[0_18px_40px_rgba(2,44,34,0.04)]">
            <span className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-gold-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Business requirements
              </span>
              <span className="h-px w-8 bg-gold-500" />
            </span>
            <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">Looking for a specific rice variety?</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-emerald-900/75">
              Tell us what you're looking for, your required quantity and your location. Our team can help you with available options and wholesale requirements.
            </p>
            <a href="#bulk-quote" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-emerald-900 px-8 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800">Tell Us What You Need →</a>
          </div>
        </section>

        <section id="about" className="section-padding bg-white">
          <div className="mx-auto max-w-5xl rounded-[2.25rem] border border-emerald-900/10 bg-gradient-to-br from-white to-emerald-50 p-8 shadow-[0_25px_60px_rgba(2,44,34,0.05)] lg:p-12">
            <span className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-gold-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                About ABD WORLD
              </span>
              <span className="h-px w-8 bg-gold-500" />
            </span>
            <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">A rice wholesaler built for business supply</h2>
            <p className="mt-6 text-lg leading-relaxed text-emerald-900/80">
              ABD WORLD is a rice wholesaler and supplier focused on serving retailers, restaurants, hotels, caterers and bulk buyers. We aim to provide dependable rice sourcing, consistent quality and business-focused service across our supply network.
            </p>
            <a href="/about" className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-emerald-700/20 bg-white px-8 text-sm font-bold text-emerald-900 transition hover:-translate-y-0.5 hover:border-emerald-700 hover:bg-emerald-50">Learn More →</a>
          </div>
        </section>

        <section className="border-y border-emerald-900/10 bg-emerald-950 py-6 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 text-sm font-medium uppercase tracking-[0.18em] text-emerald-50/80 sm:text-base">
            <span>Basmati Rice</span>
            <span className="text-gold-400">•</span>
            <span>Non-Basmati Rice</span>
            <span className="text-gold-400">•</span>
            <span>Bulk Supply</span>
            <span className="text-gold-400">•</span>
            <span>Business Enquiries</span>
          </div>
        </section>

        <section id="contact" className="section-padding bg-white">
          <div className="mx-auto max-w-6xl rounded-[2.25rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-950 to-emerald-900 p-8 text-white shadow-[0_25px_60px_rgba(2,44,34,0.2)] lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div>
                <span className="inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
                    Contact
                  </span>
                  <span className="h-px w-8 bg-gold-500" />
                </span>
                <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Let&apos;s Work Together</h2>
                <p className="mt-4 text-lg leading-relaxed text-emerald-50/80">
                  Looking for a reliable rice supplier for your business?
                </p>
              </div>
              <div className="grid gap-3 text-sm text-emerald-50/85">
                <a href="tel:+919246251399" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10">Call Us</a>
                <a href="https://wa.me/919246251399?text=Hello%20ABD%20WORLD%2C%20I%20need%20a%20rice%20quotation." target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10">WhatsApp Us</a>
                <a href="#bulk-quote" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10">Request a Quote</a>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Business</p>
                <h3 className="mt-3 font-heading text-2xl font-bold">ABD WORLD</h3>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Address</p>
                <p className="mt-3 text-sm leading-relaxed text-emerald-50/80">Paltadanga, Golabari Boalghata Road<br />North 24 Parganas, West Bengal – 743423</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Contact</p>
                <div className="mt-3 space-y-2 text-sm text-emerald-50/80">
                  <p><a href="tel:+919246251399">9875351399</a></p>
                  <p><a href="mailto:contact@abdworld.in">contact@abdworld.in</a></p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Hours</p>
                <p className="mt-3 text-sm leading-relaxed text-emerald-50/80">Monday–Saturday<br />10 AM–8 PM</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-emerald-50">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-emerald-900/10 bg-white p-8 shadow-[0_18px_40px_rgba(2,44,34,0.04)]">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    Your business. our supply.
                  </span>
                  <span className="h-px w-8 bg-gold-500" />
                </span>
                <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">Your business. Our supply.</h2>
                <p className="mt-4 text-lg leading-relaxed text-emerald-900/75">
                  Whether you&apos;re a retailer, restaurant, hotel, caterer or wholesale buyer, ABD WORLD is built to support your rice procurement requirements.
                </p>
              </div>
              <div className="text-center lg:text-right">
                <a href="#bulk-quote" className="inline-flex h-12 items-center justify-center rounded-full bg-gold-400 px-8 text-sm font-bold text-emerald-950 shadow-[0_12px_25px_rgba(250,204,21,0.3)] transition hover:-translate-y-0.5 hover:bg-gold-300">Start a Business Enquiry →</a>
              </div>
            </div>
          </div>
        </section>

        <QualityProcess />
        <AboutPreview />
        <Stats />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}