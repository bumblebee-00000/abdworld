'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Search, Wheat } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import RiceGrainParticles from '@/components/ui/RiceGrainParticles';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fffdf8]">
      <Navbar />
      <main className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-emerald-950 px-6 py-20 text-white grain-grid">
        <RiceGrainParticles intensity="medium" />
        <div className="absolute -right-36 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-gold-300/20 bg-gold-400/[0.08]" aria-hidden="true" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full border border-emerald-300/10" aria-hidden="true" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-kicker !text-gold-400">Route unavailable</p>
            <h1 className="mt-6 font-heading text-6xl font-black leading-[0.86] tracking-tight sm:text-8xl">
              Lost in the
              <span className="block text-gradient">supply chain.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-emerald-50/75 sm:text-lg">
              This page is no longer in our collection, but there is plenty of good rice still waiting to be discovered.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-bold text-emerald-950 shadow-lg shadow-gold-500/20 transition-all hover:-translate-y-1 hover:bg-gold-300"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Browse rice collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-gold-400 hover:text-gold-300"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Return home
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.88, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center"
            aria-hidden="true"
          >
            <div className="absolute inset-7 rounded-full border border-gold-400/30" />
            <div className="absolute inset-16 rounded-full border border-emerald-200/15" />
            <span className="font-heading text-[10rem] font-black leading-none text-white/[0.08] sm:text-[13rem]">404</span>
            <div className="absolute flex h-24 w-24 items-center justify-center rounded-3xl border border-gold-300/40 bg-gold-400/15 text-gold-300 shadow-2xl shadow-gold-500/10 backdrop-blur-sm rotate-12">
              <Wheat className="h-11 w-11 -rotate-12" strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
