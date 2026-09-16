import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import ScrollReveal from '@/components/animations/ScrollReveal';
import QualityProcess from '@/components/home/QualityProcess';
import Stats from '@/components/home/Stats';
import CTASection from '@/components/home/CTASection';
import {
  ChevronRight,
  Target,
  Eye,
  Gem,
  Award,
  Heart,
  Wheat,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about ABD WORLD, our sourcing process, quality checks, wholesale supply, and customer delivery service.',
};

const values = [
  {
    icon: Gem,
    title: 'Quality First',
    description:
      'We never compromise on grain quality. Every batch is tested, verified, and approved before it reaches you.',
  },
  {
    icon: Heart,
    title: 'Honest Dealings',
    description:
      'Transparent pricing, clear communication, and promises we always keep. Trust is our strongest currency.',
  },
  {
    icon: Award,
    title: 'Customer Focus',
    description:
      'Your business grows when you succeed. We treat every partnership as a long-term commitment.',
  },
];

const owner = {
  name: 'ABDUR JOHIR ALOM',
  role: 'Owner',
  description:
    'The visionary behind ABD WORLD, leading the brand with hands-on direction and a commitment to honest, reliable service.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section
          className="relative overflow-hidden pb-28 pt-40 premium-gradient grain-grid"
          style={{
            background:
              'linear-gradient(135deg, #071f1b 0%, #0b4538 48%, #106b55 100%)',
          }}
        >
          <Wheat className="animate-drift pointer-events-none absolute -right-10 -top-10 h-64 w-64 text-gold-500/10" />
          <div className="absolute bottom-0 left-1/2 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="flex items-center justify-center gap-2 text-emerald-50/75 text-sm mb-4">
              <Link href="/" className="hover:text-gold-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gold-400">About Us</span>
            </div>
            <h1 className="text-balance font-[var(--font-heading)] text-4xl font-bold leading-tight text-emerald-50 md:text-7xl">
              Our Story, Our <span className="text-gradient">Promise</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-emerald-50/80">
              More than a rice supplier - we are partners in your growth,
              delivering quality that speaks for itself.
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="section-padding grain-grid bg-cream-50">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 gold-gradient rounded-full" />
              <div className="pl-8 md:pl-10">
                <p className="section-kicker mb-3">
                  Our Journey
                </p>
                <h2 className="text-balance mb-6 font-[var(--font-heading)] text-3xl font-bold text-emerald-950 md:text-5xl">
                  From a Single Grain to a Growing Legacy
                </h2>

                <div className="space-y-6 text-lg leading-relaxed text-emerald-900/70">
                  <p>
                    ABD WORLD began with a simple belief - that the rice
                    businesses serve their customers with should be nothing less
                    than exceptional. What started as a small trading operation
                    has blossomed into one of the region&apos;s most trusted premium
                    rice wholesale houses.
                  </p>
                  <p>
                    We build direct relationships with trusted rice-growing
                    partners, collect selected rice from approved factories, and
                    follow a clear quality checking process before wholesale supply.
                  </p>
                  <p>
                    We work with retailers, restaurants, hotels, caterers, and
                    distributors who need dependable quality, clear communication,
                    and delivery arranged around their business requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission / Vision / Values */}
        <section className="section-padding premium-gradient relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-14 text-center">
              <p className="section-kicker mb-3 !text-gold-400">
                What Drives Us
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-emerald-50 font-[var(--font-heading)]">
                Mission, Vision & Values
              </h2>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <ScrollReveal delay={0.05} className="h-full">
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-8 transition-colors hover:border-gold-500/40">
                <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-emerald-950" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-50 font-[var(--font-heading)] mb-4">
                  Our Mission
                </h3>
                <p className="text-emerald-50/75 leading-relaxed">
                  To deliver premium quality rice at honest wholesale prices,
                  powered by a supply chain that is transparent, sustainable,
                  and dependable for every business we serve.
                </p>
              </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15} className="h-full">
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-8 transition-colors hover:border-gold-500/40">
                <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-emerald-950" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-50 font-[var(--font-heading)] mb-4">
                  Our Vision
                </h3>
                <p className="text-emerald-50/75 leading-relaxed">
                  To become India&apos;s most trusted rice brand among wholesale
                  buyers - known for consistency, authenticity, and a
                  partnership approach that helps our clients grow.
                </p>
              </div>
              </ScrollReveal>

              <ScrollReveal delay={0.25} className="h-full">
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-8 transition-colors hover:border-gold-500/40">
                <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-emerald-950" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-50 font-[var(--font-heading)] mb-4">
                  Our Values
                </h3>
                <ul className="space-y-3 text-emerald-50/75">
                  {values.map((v) => (
                    <li key={v.title} className="flex items-start gap-3">
                      <v.icon className="w-5 h-5 text-gold-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-emerald-50 block">{v.title}</strong>
                        <span className="text-xs text-emerald-50/65">{v.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Owner */}
        <section id="values" className="section-padding bg-cream-100">
          <div className="max-w-5xl mx-auto">
            <div className="mb-14 text-center">
              <p className="section-kicker mb-3">
                Brand Owner
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 font-[var(--font-heading)] mb-4">
                Guided by the Vision of ABDUR JOHIR ALOM
              </h2>
            </div>

            <div className="rounded-[2rem] border border-cream-200 bg-white p-6 shadow-lg shadow-emerald-900/5 sm:p-8 lg:p-10">
              <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-gold-300 bg-emerald-50 shadow-lg shadow-emerald-900/10 sm:h-48 sm:w-48">
                  <img
                    src="/ownerimg.jpeg"
                    alt="ABDUR JOHIR ALOM"
                    className="h-full w-full object-cover object-center"
                    style={{ objectPosition: 'center 18%' }}
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-700">
                    {owner.role}
                  </p>
                  <h3 className="mt-3 text-3xl font-bold text-emerald-950 font-[var(--font-heading)] md:text-4xl">
                    {owner.name}
                  </h3>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-900/70">
                    {owner.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <QualityProcess />
        <Stats />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}