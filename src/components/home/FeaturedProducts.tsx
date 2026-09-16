'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, ShoppingCart } from 'lucide-react';
import { FALLBACK_PRODUCTS } from '@/lib/products/catalog';
import type { Product } from '@/types';
import ProductImageShowcase from '@/components/products/ProductImageShowcase';

interface FeaturedProductsProps {
  products?: Product[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
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

export default function FeaturedProducts({ products = FALLBACK_PRODUCTS }: FeaturedProductsProps) {
  return (
    <section className="section-padding bg-cream-50">
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
              Our Collection
            </span>
            <span className="h-px w-8 bg-gold-500" />
          </span>
          <h2 className="mt-4 text-4xl font-bold text-emerald-950 sm:text-5xl">
            Our Rice Collection
          </h2>
          <p className="mt-4 text-lg text-emerald-900/75">
            Handpicked grains, sorted and packed with care. Explore our most
            sought-after wholesale varieties.
          </p>
          <div className="gold-gradient mx-auto mt-6 h-1 w-16 rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <motion.article
              key={product.id}
              variants={cardVariants}
              className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300/50 bg-white shadow-[0_4px_24px_rgba(2,44,34,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(2,44,34,0.16)]"
            >
              <div className="relative flex h-56 items-center justify-center overflow-hidden">
                <div className="premium-gradient absolute inset-0" />
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background:
                      'radial-gradient(ellipse 60% 60% at 75% 20%, rgba(250, 204, 21, 0.28) 0%, transparent 60%)',
                  }}
                />
                <ProductImageShowcase product={product} />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {product.category}
                  </span>
                </div>

                <h3 className="font-heading mt-4 text-2xl font-bold text-emerald-950">
                  {product.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-emerald-900/75">
                  {product.short_description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {product.pack_sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-lg border border-cream-300/70 bg-cream-50 px-2.5 py-1 text-xs font-medium text-emerald-900/80"
                    >
                      {size}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-cream-200 pt-5">
                  <span className="font-heading text-lg font-semibold text-gold-600">
                    {product.price
                      ? `₹${product.price.toLocaleString('en-IN')}`
                      : 'Contact for Price'}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-emerald-700/20 text-sm font-semibold text-emerald-800 transition-all duration-300 hover:border-emerald-700 hover:bg-emerald-700 hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Link>
                  <Link
                    href={`/products/${product.slug}?order=1`}
                    className="gold-gradient inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold text-emerald-950 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(234,179,8,0.4)]"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Order Now
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 text-center"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-base font-semibold text-emerald-800 transition-colors duration-300 hover:text-emerald-600"
          >
            View All Products
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}