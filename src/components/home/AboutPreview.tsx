'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Award, ShieldCheck, Leaf } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const textVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const visualVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const badges = [
  {
    label: 'Sourcing',
    value: 'Factory Direct',
    icon: Award,
  },
  {
    label: 'Quality checks',
    value: 'Every Batch',
    icon: ShieldCheck,
  },
  {
    label: 'Supply',
    value: 'Wholesale',
    icon: Leaf,
  },
];

export default function AboutPreview() {
  return (
    <section className="section-padding bg-cream-100">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20"
        >
          <div className="order-2 lg:order-1">
            <motion.div
              variants={textVariants}
              className="inline-flex items-center gap-3"
            >
              <span className="h-px w-8 bg-gold-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                About Us
              </span>
            </motion.div>

            <motion.h2
              variants={textVariants}
              className="mt-4 text-4xl font-bold leading-snug text-emerald-950 sm:text-5xl"
            >
              About ABD World Rice
            </motion.h2>

            <motion.p
              variants={textVariants}
              className="mt-6 text-lg leading-relaxed text-emerald-900/80"
            >
              ABD World Rice is a trusted rice wholesaler dedicated to bringing
              the finest grains to businesses across India and beyond. We partner
              directly with carefully selected farms to ensure every grain we
              supply is consistent, aromatic, and delivered at wholesale value.
            </motion.p>

            <motion.p
              variants={textVariants}
              className="mt-4 text-lg leading-relaxed text-emerald-900/80"
            >
              From premium basmati to everyday staples, our storage, quality
              checks, and hygienic packaging reflect a single promise — premium
              quality in every single order, at every single delivery.
            </motion.p>

            <motion.div
              variants={textVariants}
              className="mt-8 grid gap-4 sm:grid-cols-3"
            >
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className="rounded-2xl border border-cream-300/60 bg-white p-5 text-center transition-colors duration-300 hover:border-gold-500/40"
                >
                  <badge.icon className="mx-auto h-6 w-6 text-gold-600" />
                  <p className="font-heading mt-3 text-base font-bold text-emerald-950">
                    {badge.value}
                  </p>
                  <p className="mt-1 text-xs text-emerald-900/70">{badge.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={textVariants} className="mt-9">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-800 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-emerald-700 hover:shadow-[0_10px_30px_rgba(6,78,59,0.4)]"
              >
                Learn More About Us
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          <motion.div variants={visualVariants} className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-square max-w-md lg:max-w-none">
              <div className="premium-gradient absolute inset-0 rounded-[3rem] shadow-[0_30px_70px_rgba(2,44,34,0.35)]" />

              <div
                className="absolute inset-0 rounded-[3rem]"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(250, 204, 21, 0.22) 0%, transparent 60%)',
                }}
                aria-hidden="true"
              />

              <div
                className="absolute inset-6 rounded-[2.25rem] border border-gold-400/30"
                aria-hidden="true"
              />

              <div className="relative flex h-full flex-col items-center justify-center p-10 text-center">
                <span className="animate-float text-7xl" aria-hidden="true">
                  🌾
                </span>
                <h3 className="font-heading mt-6 text-2xl font-bold text-white">
                  Honest Grains.
                </h3>
                <h3 className="text-gradient font-heading text-2xl font-bold">
                  Honest Supply.
                </h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-emerald-100/75">
                  Wholesale rice that arrives consistent, aromatic, and ready for
                  your market — order after order.
                </p>

                <div className="glass-card mt-8 flex items-center gap-3 rounded-full px-5 py-2.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-emerald-950">
                    Serving retail, restaurants &amp; wholesale buyers
                  </span>
                </div>
              </div>

              <div
                className="gold-gradient absolute -right-3 -top-3 h-20 w-20 rotate-12 rounded-2xl shadow-[0_10px_30px_rgba(234,179,8,0.4)]"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-5 -left-5 h-16 w-16 rounded-full border-2 border-dashed border-gold-500/50"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}