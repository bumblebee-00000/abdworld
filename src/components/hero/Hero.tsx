'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import RiceGrainParticles from '@/components/ui/RiceGrainParticles';

const headingWords = ['Premium', 'Rice', 'For', 'Business'];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const subVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-emerald-950 grain-grid">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(165deg, #022c22 0%, #064e3b 42%, #0e6a54 100%)',
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 75% 25%, rgba(250, 204, 21, 0.18) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 20% 20%, rgba(52, 211, 153, 0.28) 0%, transparent 40%)',
        }}
        aria-hidden="true"
      />

      <div className="animate-drift absolute -right-20 top-20 h-[30rem] w-[30rem] rounded-full border border-gold-300/20 bg-gold-400/10 blur-[1px]" aria-hidden="true" />
      <div className="animate-float-slow absolute right-[13%] top-[16%] h-40 w-40 rounded-full border border-white/10" aria-hidden="true" />
      <div className="absolute left-[8%] top-[18%] h-20 w-20 rounded-full border border-gold-300/20 bg-white/5 blur-xl" aria-hidden="true" />
      <div className="absolute bottom-[14%] right-[10%] h-32 w-32 rounded-full border border-emerald-200/20 bg-gold-400/10 blur-xl" aria-hidden="true" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(2, 44, 34, 0.9) 0%, transparent 35%)',
        }}
        aria-hidden="true"
      />

      <RiceGrainParticles intensity="high" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-1rem)] max-w-7xl flex-col items-start justify-center px-4 pt-28 pb-24 sm:min-h-screen sm:px-10 sm:pt-20 sm:pb-28 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div
            variants={wordVariants}
            className="brand-glow mb-5 inline-flex items-center gap-3 rounded-full border border-gold-400/30 bg-emerald-900/20 px-4 py-2 backdrop-blur-sm"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-highlight-400 shadow-[0_0_18px_rgba(251,146,60,0.8)]" />
            <span className="text-sm font-bold uppercase tracking-[0.28em] text-highlight-300">
              ABD WORLD
            </span>
          </motion.div>

          <h1 className="text-balance font-heading text-4xl font-black leading-[0.98] tracking-tight text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-8xl">
            <span className="block overflow-hidden py-1">
              {headingWords.slice(0, 2).map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="mr-2 inline-block sm:mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden py-1">
              {headingWords.slice(2).map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="mr-2 inline-block text-gradient sm:mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={subVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-2xl text-base leading-relaxed text-emerald-50/90 sm:text-lg"
        >
          Quality rice supply for retailers, restaurants, hotels and bulk buyers — with reliable sourcing, consistent quality and competitive wholesale pricing.
        </motion.p>

        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Link
            href="#bulk-quote"
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gold-400 px-9 text-base font-bold text-emerald-950 shadow-[0_12px_35px_rgba(250,204,21,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-gold-300 hover:shadow-[0_18px_45px_rgba(250,204,21,0.56)]"
          >
            Request Bulk Quote
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/products"
            className="inline-flex h-14 items-center justify-center rounded-full border-2 border-white/70 bg-white/5 px-9 text-base font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:border-highlight-400 hover:bg-white/10 hover:text-highlight-300"
          >
            Explore Rice
          </Link>
        </motion.div>

        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-50/85 backdrop-blur-sm"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.8)]" />
          Trusted rice supply for growing businesses
        </motion.div>
      </div>

      <svg
        className="absolute bottom-0 left-0 z-10 w-full"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 120C360 50 720 30 1080 45C1260 53 1380 40 1440 20V120H0Z"
          fill="#fefdfb"
        />
      </svg>
    </section>
  );
}