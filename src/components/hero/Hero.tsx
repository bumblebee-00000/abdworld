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

const decorativeDivider = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, delay: 1.5 } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-emerald-950 grain-grid">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(165deg, #022c22 0%, #064e3b 45%, #065f46 100%)',
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 75% 25%, rgba(250, 204, 21, 0.14) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="animate-drift absolute -right-40 top-24 h-[32rem] w-[32rem] rounded-full border border-gold-300/20 bg-gold-400/10 blur-[1px]" aria-hidden="true" />
      <div className="absolute right-[14%] top-[22%] h-40 w-40 rounded-full border border-white/10" aria-hidden="true" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(2, 44, 34, 0.9) 0%, transparent 35%)',
        }}
        aria-hidden="true"
      />

      <RiceGrainParticles intensity="high" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center px-6 pt-20 pb-28 sm:px-10 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div
            variants={wordVariants}
            className="mb-5 inline-flex items-center gap-3 rounded-full border border-gold-400/30 bg-emerald-900/20 px-4 py-2 backdrop-blur-sm"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-highlight-400 shadow-[0_0_18px_rgba(251,146,60,0.8)]" />
            <span className="text-sm font-bold uppercase tracking-[0.28em] text-highlight-300">
              ABD WORLD
            </span>
          </motion.div>

          <h1 className="text-balance font-heading text-5xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)] sm:text-6xl lg:text-8xl">
            <span className="block overflow-hidden py-1">
              {headingWords.slice(0, 2).map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="mr-4 inline-block"
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
                  className="mr-4 inline-block text-gradient"
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
          className="mt-6 max-w-xl text-base leading-relaxed text-emerald-50/90 sm:text-lg"
        >
          Premium rice supply for retailers, restaurants, hotels, and wholesale buyers who want consistent quality and reliable delivery.
        </motion.p>

        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Link
            href="/products"
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gold-400 px-9 text-base font-bold text-emerald-950 shadow-[0_8px_30px_rgba(250,204,21,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-gold-300 hover:shadow-[0_8px_40px_rgba(250,204,21,0.5)]"
          >
            Explore Rice Collection
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-14 items-center justify-center rounded-full border-2 border-white/70 bg-white/5 px-9 text-base font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:border-highlight-400 hover:bg-white/10 hover:text-highlight-300"
          >
            Wholesale Enquiry
          </Link>
        </motion.div>
      </div>

      <motion.div
        variants={decorativeDivider}
        initial="hidden"
        animate="visible"
        className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block xl:right-24"
        aria-hidden="true"
      >
        <div className="animate-float-slow relative">
          <svg
            width="220"
            height="280"
            viewBox="0 0 220 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          >
            <defs>
              <linearGradient id="grainGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <filter id="grainGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#grainGlow)" opacity="0.9">
              <ellipse cx="110" cy="60" rx="38" ry="13" fill="url(#grainGrad)" />
              <ellipse cx="55" cy="130" rx="34" ry="12" fill="url(#grainGrad)" transform="rotate(-18 55 130)" />
              <ellipse cx="160" cy="150" rx="36" ry="12" fill="url(#grainGrad)" transform="rotate(14 160 150)" />
              <ellipse cx="100" cy="205" rx="32" ry="11" fill="url(#grainGrad)" transform="rotate(-8 100 205)" />
              <ellipse cx="150" cy="245" rx="30" ry="10" fill="url(#grainGrad)" transform="rotate(20 150 245)" />
            </g>
          </svg>
          <div className="absolute -left-24 top-24 h-3 w-3 animate-pulse-soft rounded-full bg-gold-400/70" />
          <div className="absolute -right-6 top-40 h-2 w-2 animate-float rounded-full bg-emerald-300/60" />
        </div>
      </motion.div>

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