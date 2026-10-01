import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import ContactForm from '@/components/forms/ContactForm';
import SiteContactDetails from '@/components/contact/SiteContactDetails';
import {
  ChevronRight,
  Wheat,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with ABD WORLD. Call, WhatsApp, email, or visit us for wholesale rice pricing and supply details.',
};

export default function ContactPage() {
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
              <span className="text-gold-400">Contact</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white font-[var(--font-heading)] leading-tight">
              Let&apos;s Talk <span className="text-gradient">Rice</span>
            </h1>
            <p className="mt-5 text-lg text-cream-100/60 max-w-2xl mx-auto">
              Have a question about wholesale pricing, varieties, or delivery?
              We&apos;re one message away.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="section-padding bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <SiteContactDetails variant="cards" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Form */}
              <div>
                <div className="mb-6">
                  <p className="text-gold-600 font-semibold text-sm tracking-[0.2em] uppercase mb-3">
                    Send a Message
                  </p>
                  <h2 className="text-3xl font-bold text-emerald-950 font-[var(--font-heading)]">
                    We Usually Reply Within 24 Hours
                  </h2>
                </div>
                <ContactForm />
              </div>

              {/* Business hours + Map */}
              <SiteContactDetails variant="hours" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}