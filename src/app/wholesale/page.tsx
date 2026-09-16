import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import WholesaleForm from '@/components/forms/WholesaleForm';
import CTASection from '@/components/home/CTASection';
import {
  ChevronRight,
  Store,
  UtensilsCrossed,
  Hotel,
  ChefHat,
  ShoppingCart,
  Truck,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Percent,
  Handshake,
  Boxes,
  ShieldCheck,
  Wheat,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wholesale Rice Supply',
  description:
    'Wholesale rice supply for retailers, restaurants, hotels, caterers, grocery stores, and distributors. Premium quality, bulk pricing, pan-India delivery.',
};

const audiences = [
  {
    icon: Store,
    title: 'Retailers',
    description:
      'Grocery stores, kirana shops, and supermarkets stocking quality rice at margins they can grow with.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurants',
    description:
      'Consistent aroma, texture, and cooking performance for every dish you serve, every single day.',
  },
  {
    icon: Hotel,
    title: 'Hotels',
    description:
      'Bulk supply with scheduled delivery so your kitchen never runs short of premium grains.',
  },
  {
    icon: ChefHat,
    title: 'Caterers',
    description:
      'Reliable volume supply for weddings, events, and large-scale catering operations.',
  },
  {
    icon: ShoppingCart,
    title: 'Grocery Stores',
    description:
      'Fast-moving brands and varieties your customers look for, with best wholesale rates.',
  },
  {
    icon: Truck,
    title: 'Distributors',
    description:
      'Long-term supply partnerships with priority dispatch and exclusive regional opportunities.',
  },
];

const benefits = [
  {
    icon: Percent,
    title: 'Best Bulk Pricing',
    description: 'Tiered wholesale rates with bigger savings on larger volumes.',
  },
  {
    icon: Handshake,
    title: 'Flexible Partnership',
    description: 'Credit terms, scheduled delivery, and dedicated account support.',
  },
  {
    icon: Boxes,
    title: 'Grain Consistency',
    description: 'Same variety, same quality, same cooking behavior - batch after batch.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assurance',
    description: 'Lab-tested, FSSAI-compliant, and certified pure rice in every order.',
  },
];

const steps = [
  {
    step: '1',
    title: 'Send Your Enquiry',
    description:
      'Tell us about your business, rice requirements, and approximate monthly quantity.',
  },
  {
    step: '2',
    title: 'Get a Custom Quote',
    description:
      'Our team responds within 24 hours with pricing, pack sizes, and delivery options.',
  },
  {
    step: '3',
    title: 'Confirm Your Order',
    description:
      'Lock in your order with sample approval (available on request) and scheduling.',
  },
  {
    step: '4',
    title: 'Fast, Reliable Delivery',
    description:
      'Your order arrives on time, at your door, ready for your business or kitchen.',
  },
];

export default function WholesalePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="relative pt-40 pb-24 premium-gradient overflow-hidden">
          <Wheat className="absolute -top-16 -right-16 w-80 h-80 text-gold-500/10 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="flex items-center justify-center gap-2 text-cream-100/60 text-sm mb-4">
              <Link href="/" className="hover:text-gold-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gold-400">Wholesale</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white font-[var(--font-heading)] leading-tight">
              Wholesale Rice Supply, <span className="text-gradient">Built for Business</span>
            </h1>
            <p className="mt-5 text-lg text-cream-100/60 max-w-2xl mx-auto">
              Premium grains, honest pricing, and a supply chain you can rely on
              - for retailers, restaurants, hotels, caterers, and distributors.
            </p>
          </div>
        </section>

        {/* Audiences */}
        <section className="section-padding bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-gold-600 font-semibold text-sm tracking-[0.2em] uppercase mb-3">
                Who We Serve
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 font-[var(--font-heading)] mb-4">
                Wholesale Solutions for Every Business
              </h2>
              <p className="text-emerald-900/60 max-w-xl mx-auto">
                Wherever rice is served or sold, ABD World Rice is there to power it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {audiences.map((audience) => (
                <div
                  key={audience.title}
                  className="group p-6 rounded-2xl bg-white border border-cream-200 hover:border-gold-400 hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <audience.icon className="w-6 h-6 text-emerald-950" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)] mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-sm text-emerald-900/60 leading-relaxed">
                    {audience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding premium-gradient relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <p className="text-gold-400 font-semibold text-sm tracking-[0.2em] uppercase mb-3">
                Why Go Wholesale
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-white font-[var(--font-heading)] mb-4">
                Benefits of a Wholesale Partnership
              </h2>
              <p className="text-cream-100/60 max-w-xl mx-auto">
                More than just discounts - a partnership that grows your business.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold-500/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-emerald-950" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-[var(--font-heading)] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-cream-100/60 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section-padding bg-cream-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-gold-600 font-semibold text-sm tracking-[0.2em] uppercase mb-3">
                Simple Process
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 font-[var(--font-heading)] mb-4">
                How It Works
              </h2>
              <p className="text-emerald-900/60 max-w-xl mx-auto">
                Four simple steps from enquiry to delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div
                  key={step.step}
                  className="relative group"
                >
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-gold-500 shadow-lg shadow-gold-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl font-bold text-emerald-800 font-[var(--font-heading)]">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-emerald-950 font-[var(--font-heading)] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-emerald-900/60 leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enquiry Form + Contact Sidebar */}
        <section className="section-padding bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-gold-600 font-semibold text-sm tracking-[0.2em] uppercase mb-3">
                Get Started
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 font-[var(--font-heading)] mb-4">
                Request a Wholesale Quote
              </h2>
              <p className="text-emerald-900/60 max-w-xl mx-auto">
                Share your requirements and our team will get back to you within 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <WholesaleForm />
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-lg shadow-emerald-900/5">
                  <h3 className="font-bold text-emerald-950 font-[var(--font-heading)] text-lg mb-4">
                    Prefer to Talk Directly?
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="tel:+919999999999"
                        className="flex items-start gap-3 text-sm text-emerald-900/70 hover:text-emerald-700 transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <Phone className="w-4 h-4 text-emerald-600" />
                        </span>
                        <span>
                          <strong className="block text-emerald-950">Call Us</strong>
                          +91 99999 99999
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://wa.me/919999999999"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 text-sm text-emerald-900/70 hover:text-emerald-700 transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                        </span>
                        <span>
                          <strong className="block text-emerald-950">WhatsApp</strong>
                          +91 99999 99999
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="mailto:abdworldinfo@gmail.com"
                        className="flex items-start gap-3 text-sm text-emerald-900/70 hover:text-emerald-700 transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <Mail className="w-4 h-4 text-emerald-600" />
                        </span>
                        <span>
                          <strong className="block text-emerald-950">Email Us</strong>
                          abdworldinfo@gmail.com
                        </span>
                      </a>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-emerald-900/70">
                      <span className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </span>
                      <a
                        href="https://maps.app.goo.gl/EzTtBPpWs4yJ4PBF6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-700 transition-colors"
                      >
                        <strong className="block text-emerald-950">Visit Us</strong>
                        Aminpur Bazar, Boalghata Road, Paltadanga, West Bengal 743423
                      </a>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-emerald-900/70">
                      <span className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-emerald-600" />
                      </span>
                      <span>
                        <strong className="block text-emerald-950">Business Hours</strong>
                        Mon - Sat: 9:00 AM - 6:00 PM
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl p-6 gold-gradient shadow-lg shadow-gold-500/20">
                  <h3 className="font-bold text-emerald-950 font-[var(--font-heading)] text-lg mb-2">
                    Bulk Order Specialists
                  </h3>
                  <p className="text-sm text-emerald-900/70 leading-relaxed">
                    Need 500 kg or 50 tonnes? We handle orders of every scale
                    with priority service and transparent pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}