import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import ContactForm from '@/components/forms/ContactForm';
import {
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Building2,
  Wheat,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with ABD WORLD. Call, WhatsApp, email, or visit us for wholesale rice pricing and supply details.',
};

const contactCards = [
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+91 99999 99999'],
    href: 'tel:+919999999999',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    lines: ['+91 99999 99999'],
    href: 'https://wa.me/919999999999',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['contact@abdworld.in'],
    href: 'mailto:contact@abdworld.in',
  },
  {
    icon: MapPin,
    title: 'Address',
    lines: ['Aminpur Bazar, Boalghata Road, Paltadanga, West Bengal 743423'],
    href: 'https://maps.app.goo.gl/EzTtBPpWs4yJ4PBF6',
  },
];

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactCards.map((card) => (
                <div
                  key={card.title}
                  className="group bg-white rounded-2xl border border-cream-200 p-6 text-center hover:border-gold-400 hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                    <card.icon className="w-7 h-7 text-emerald-950" />
                  </div>
                  <h3 className="font-bold text-emerald-950 font-[var(--font-heading)] text-lg mb-2">
                    {card.title}
                  </h3>
                  {card.lines.map((line) =>
                    card.href ? (
                      <a
                        key={line}
                        href={card.href}
                        target={card.href.startsWith('http') ? '_blank' : undefined}
                        rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="block text-sm text-emerald-900/60 hover:text-emerald-700 transition-colors"
                      >
                        {line}
                      </a>
                    ) : (
                      <p key={line} className="text-sm text-emerald-900/60">
                        {line}
                      </p>
                    )
                  )}
                </div>
              ))}
            </div>

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
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-cream-200 p-8 shadow-lg shadow-emerald-900/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-950" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-950 font-[var(--font-heading)]">
                      Business Hours
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { day: 'Monday - Friday', hours: '9:00 AM - 6:30 PM' },
                      { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
                      { day: 'Sunday', hours: 'Closed' },
                      { day: 'Public Holidays', hours: 'Closed' },
                    ].map((row) => (
                      <li
                        key={row.day}
                        className="flex items-center justify-between pb-3 border-b border-cream-100 last:border-0 last:pb-0"
                      >
                        <span className="text-sm text-emerald-900/70">{row.day}</span>
                        <span className="text-sm font-semibold text-emerald-800">
                          {row.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-cream-200 p-8 shadow-lg shadow-emerald-900/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-emerald-950" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-950 font-[var(--font-heading)]">
                      Our Location
                    </h3>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/EzTtBPpWs4yJ4PBF6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative rounded-xl overflow-hidden border border-cream-200 aspect-[4/3] bg-cream-100 transition-transform hover:scale-[1.01]"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <MapPin className="w-10 h-10 text-emerald-600 mb-3" />
                      <p className="font-semibold text-emerald-900">
                        Aminpur Bazar, Boalghata Road, Paltadanga,
                      </p>
                      <p className="text-sm text-emerald-900/70">
                        West Bengal 743423
                      </p>
                      <p className="mt-4 text-xs text-emerald-900/40 uppercase tracking-widest">
                        Open in Google Maps
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}