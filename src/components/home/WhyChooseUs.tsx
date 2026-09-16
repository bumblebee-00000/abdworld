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
            Why Choose Us
          </h2>
          <p className="mt-4 text-lg text-emerald-900/75">
            Built on trust, consistency, and a genuine passion for rice — here
            is why distributors rely on ABD World Rice.
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
              className="group rounded-3xl border border-cream-300/50 bg-cream-50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:bg-white hover:shadow-[0_20px_45px_rgba(2,44,34,0.12)]"
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
      </div>
    </section>
  );
}