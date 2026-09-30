'use client';

import { motion } from 'framer-motion';
import {
  Star,
  BadgeIndianRupee,
  Truck,
  ShieldCheck,
  Layers,
  Headphones,
} from 'lucide-react';

const features = [
  {
    title: 'Premium Quality',
    description:
      'Every batch is sourced from trusted farms and rigorously checked for grain quality, aroma, and taste.',
    icon: Star,
  },
  {
    title: 'Wholesale Pricing',
    description:
      'Competitive bulk rates with a flexible pricing structure designed to maximise margins for your business.',
    icon: BadgeIndianRupee,
  },
  {
    title: 'Reliable Supply',
    description:
      'A dependable supply chain that keeps your shelves stocked year-round, even in peak demand seasons.',
    icon: Truck,
  },
  {
    title: 'Hygienic Packaging',
    description:
      'Food-grade, hygienic packing in multiple sizes that lock in freshness and protect every single grain.',
    icon: ShieldCheck,
  },
  {
    title: 'Wide Selection',
    description:
      'From aromatic basmati to everyday staples, we offer a broad portfolio to serve every market and cuisine.',
    icon: Layers,
  },
  {
    title: 'Customer Support',
    description:
      'A dedicated team that understands wholesale timelines and responds to every order and query quickly.',
    icon: Headphones,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="section-padding bg-white scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gold-500" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Why Choose Us
            </span>
            <span className="h-px w-8 bg-gold-500" />
          </span>
          <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">
            Built for business growth
          </h2>
          <p className="mt-4 text-lg text-emerald-900/75">
            Trusted sourcing, consistent quality, and a supply process designed for businesses that need dependable rice without the risk.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group rounded-[1.8rem] border border-cream-300/50 bg-cream-50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:bg-white hover:shadow-[0_22px_52px_rgba(2,44,34,0.12)]"
            >
              <div className="gold-gradient flex h-16 w-16 items-center justify-center rounded-full shadow-[0_10px_25px_rgba(234,179,8,0.35)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <feature.icon className="h-7 w-7 text-emerald-950" />
              </div>
              <h3 className="font-heading mt-6 text-xl font-bold text-emerald-950">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-emerald-900/80">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-8 shadow-[0_25px_60px_rgba(2,44,34,0.08)] lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-emerald-700/15 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-800">
                Trusted by business buyers
              </span>
              <h3 className="mt-4 font-heading text-3xl font-bold text-emerald-950 sm:text-4xl">
                A reliable rice partner for retailers, restaurants, and bulk buyers.
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-emerald-900/75">
                We help businesses source consistent quality rice with clear communication, dependable supply, and pricing built for wholesale growth. From daily restaurant needs to repeat retail demand, ABD WORLD focuses on smooth ordering and faster decisions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Retailers',
                'Restaurants',
                'Hotels & Caterers',
                'Wholesale Buyers',
              ].map((buyerType) => (
                <div
                  key={buyerType}
                  className="rounded-2xl border border-emerald-900/10 bg-white/80 px-4 py-3 text-center text-sm font-semibold text-emerald-900 shadow-sm"
                >
                  {buyerType}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-gold-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                How it works
              </span>
              <span className="h-px w-8 bg-gold-500" />
            </span>
            <h3 className="mt-4 font-heading text-3xl font-bold text-emerald-950 sm:text-4xl">
              Simple wholesale buying process
            </h3>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Choose your rice',
                description: 'Browse the collection and shortlist the grain that fits your business and demand.',
              },
              {
                number: '02',
                title: 'Request a quote',
                description: 'Share your quantity, location, and business needs for a current pricing and supply answer.',
              },
              {
                number: '03',
                title: 'Confirm the order',
                description: 'We confirm availability, delivery details, and packaging options before you proceed.',
              },
            ].map((step) => (
              <div key={step.number} className="rounded-[1.75rem] border border-emerald-900/10 bg-white p-6 shadow-[0_18px_40px_rgba(2,44,34,0.06)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-800 to-emerald-700 text-lg font-bold text-white shadow-md">
                  {step.number}
                </div>
                <h4 className="mt-5 font-heading text-2xl font-bold text-emerald-950">
                  {step.title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-emerald-900/75">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}