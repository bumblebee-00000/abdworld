import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { Wheat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Terms and Conditions for using the ABD WORLD website and placing orders.',
};

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content:
        'By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.',
    },
    {
      title: '2. Orders and Enquiries',
      content:
        'Orders placed through this website are considered order enquiries. Final confirmation, pricing, and delivery details are agreed upon between the customer and ABD WORLD directly, typically via phone or WhatsApp.',
    },
    {
      title: '3. Pricing and Availability',
      content:
        'Prices displayed on this website are indicative and may vary based on market conditions, quantity, location, and delivery requirements. Wholesale prices are confirmed after order discussion. Product availability may change without notice.',
    },
    {
      title: '4. Product Information',
      content:
        'We strive to accurately describe our products. Product images and descriptions are provided for general information. Specific product characteristics may vary slightly between batches and seasons.',
    },
    {
      title: '5. Payment',
      content:
        'Payment terms are agreed upon between the customer and ABD WORLD for each order. We do not process online payments at this time unless otherwise agreed.',
    },
    {
      title: '6. Delivery and Shipping',
      content:
        'Delivery timelines and shipping costs are discussed and agreed upon before order confirmation. Delivery availability depends on location and order quantity.',
    },
    {
      title: '7. Limitation of Liability',
      content:
        'To the maximum extent permitted by law, ABD WORLD shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or its products.',
    },
    {
      title: '8. Contact',
      content:
        'For any questions regarding these Terms and Conditions, please contact us through the Contact page on our website.',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-cream-50">
        <section className="premium-gradient relative overflow-hidden">
          <Wheat className="absolute -top-16 -right-16 w-80 h-80 text-gold-500/10 pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 lg:px-8">
            <nav className="mb-6 flex items-center gap-2 text-sm text-emerald-300/80">
              <Link href="/" className="transition-colors hover:text-gold-300">Home</Link>
              <span className="text-emerald-500/50">/</span>
              <span className="text-gold-300">Terms &amp; Conditions</span>
            </nav>
            <h1 className="font-heading text-4xl font-bold text-white">Terms &amp; Conditions</h1>
            <p className="mt-3 max-w-2xl text-emerald-100/70">Last updated: 2024</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="mx-auto max-w-3xl">
            <p className="mb-10 text-emerald-700/80">
              Please read these Terms and Conditions carefully before using our website or placing
              an order.
            </p>
            <div className="space-y-8">
              {sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <h2 className="font-heading text-xl font-bold text-emerald-950">{section.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-emerald-700/80">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}