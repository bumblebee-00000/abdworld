'use client';

import { motion } from 'framer-motion';
import { Package, ShoppingBag, Briefcase, MapPin } from 'lucide-react';

const stats = [
  {
    label: 'Products',
    value: 'Curated',
    icon: Package,
  },
  {
    label: 'Supply Model',
    value: 'Wholesale',
    icon: ShoppingBag,
  },
  {
    label: 'Quality Control',
    value: 'Every Batch',
    icon: Briefcase,
  },
  {
    label: 'Delivery',
    value: 'To Business',
    icon: MapPin,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-emerald-800 bg-emerald-950 py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 20% 0%, rgba(250, 204, 21, 0.08) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 90% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 gap-10 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              className="group flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-emerald-900/60 transition-all duration-500 group-hover:border-gold-400 group-hover:bg-emerald-900 group-hover:shadow-[0_0_0_6px_rgba(250,204,21,0.1)]">
                <stat.icon className="h-7 w-7 text-gold-400" />
              </div>
              <div className="font-heading mt-5 text-2xl font-bold text-gold-400 sm:text-3xl">
                {stat.value}
              </div>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-100/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}