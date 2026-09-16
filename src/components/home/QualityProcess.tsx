'use client';

import { motion } from 'framer-motion';
import {
  Wheat,
  SearchCheck,
  PackageCheck,
  Warehouse,
  Home,
} from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Rice Selection',
    description: 'We select premium rice from trusted farms',
    icon: Wheat,
  },
  {
    number: 2,
    title: 'Quality Checking',
    description: 'Every batch is checked for purity, grade, and consistency',
    icon: SearchCheck,
  },
  {
    number: 3,
    title: 'Factory Collection',
    description: 'Collected directly from the approved rice factory',
    icon: Warehouse,
  },
  {
    number: 4,
    title: 'Wholesale Supply',
    description: 'Prepared and dispatched in bulk on schedule',
    icon: PackageCheck,
  },
  {
    number: 5,
    title: 'Customer Delivery',
    description: 'Delivered safely to your warehouse or business',
    icon: Home,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
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

export default function QualityProcess() {
  return (
    <section className="premium-gradient section-padding relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(250, 204, 21, 0.1) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
              From Farm to Door
            </span>
            <span className="h-px w-8 bg-gold-400" />
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Our Quality Process
          </h2>
          <p className="mt-4 text-lg text-emerald-100/80">
            A clear five-step journey from selecting the right rice to delivering
            it safely to your business.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative mt-16"
        >
          <motion.div
            variants={lineVariants}
            className="gold-gradient absolute left-0 right-0 top-8 hidden h-0.5 origin-left lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center"
              >
                <div className="absolute left-1/2 top-16 hidden h-full w-px bg-gradient-to-b from-gold-500/40 to-transparent lg:hidden" />

                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400 bg-emerald-950 shadow-[0_0_0_6px_rgba(250,204,21,0.12),0_10px_30px_rgba(0,0,0,0.3)]">
                  <step.icon className="h-7 w-7 text-gold-400" />
                </div>

                <span className="mt-5 inline-flex items-center justify-center rounded-full bg-gold-400/15 px-3 py-1 text-xs font-bold tracking-wide text-gold-300">
                  Step {step.number}
                </span>

                <h3 className="font-heading mt-3 text-lg font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[220px] text-sm text-emerald-100/65">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}