import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { Wheat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy of ABD World Rice. Learn how we collect, use, and protect your information.',
};

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content:
        'We collect information you provide directly when you use our website, including your name, phone number, email address, delivery address, and order details. We may also collect basic analytics information about how you use our website.',
    },
    {
      title: '2. How We Use Your Information',
      content:
        'We use your information to respond to your enquiries, process your orders, provide details about our products and pricing, arrange for delivery, and improve our services. We do not sell your personal information to third parties.',
    },
    {
      title: '3. Information Sharing',
      content:
        'We may share your information only with service providers who help us operate our business, such as delivery partners. We do not share your personal information for marketing purposes without your consent.',
    },
    {
      title: '4. Data Security',
      content:
        'We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.',
    },
    {
      title: '5. Your Rights',
      content:
        'You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us using the details on our Contact page.',
    },
    {
      title: '6. Cookies',
      content:
        'Our website may use cookies to enhance your browsing experience. You can control or disable cookies through your browser settings.',
    },
    {
      title: '7. Contact Us',
      content:
        'If you have any questions about this Privacy Policy, please contact us through the Contact page on our website.',
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
              <span className="text-gold-300">Privacy Policy</span>
            </nav>
            <h1 className="font-heading text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="mt-3 max-w-2xl text-emerald-100/70">Last updated: 2024</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="mx-auto max-w-3xl">
            <p className="mb-10 text-emerald-700/80">
              ABD World Rice is committed to protecting your privacy. This policy explains how we
              handle information we collect from our website visitors and customers.
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