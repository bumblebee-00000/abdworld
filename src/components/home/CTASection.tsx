'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function CTASection() {
  return (
    <section className="section-padding bg-cream-50">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="premium-gradient relative overflow-hidden rounded-[3rem] px-8 py-20 text-center shadow-[0_40px_90px_rgba(2,44,34,0.35)] sm:px-14 lg:px-24"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 65% at 50% 0%, rgba(250, 204, 21, 0.18) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute inset-6 rounded-[2.5rem] border border-gold-400/20"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -left-10 top-1/2 hidden h-24 w-24 -translate-y-1/2 rounded-full bg-gold-400/10 blur-2xl lg:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-10 bottom-1/3 hidden h-24 w-24 rounded-full bg-gold-400/10 blur-2xl lg:block"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute left-6 top-6 hidden animate-float text-4xl opacity-40 sm:block"
            aria-hidden="true"
          >
            🌾
          </div>
          <div
            className="pointer-events-none absolute bottom-8 right-8 hidden animate-float-delayed text-4xl opacity-40 sm:block"
            aria-hidden="true"
          >
            🌾
          </div>

          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold-400" />
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-400">
              Wholesale Inquiries Welcome
            </span>
            <span className="h-px w-10 bg-gold-400" />
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl"
          >
            Ready to Order Premium Rice?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-emerald-100/80"
          >
            Get the best wholesale rates on premium basmati and non-basmati rice.
            Speak directly with our supply team and lock in your order today.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/products"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gold-400 px-9 text-base font-semibold text-emerald-950 shadow-[0_8px_30px_rgba(250,204,21,0.35)] transition-all duration-300 hover:bg-gold-300 hover:shadow-[0_8px_40px_rgba(250,204,21,0.5)]"
            >
              Browse Collection
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-white/50 px-9 text-base font-semibold text-white transition-all duration-300 hover:border-gold-400 hover:bg-white/5 hover:text-gold-300"
            >
              <PhoneCall className="h-5 w-5" />
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}