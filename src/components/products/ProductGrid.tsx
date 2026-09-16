'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart, Package } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import ProductImageShowcase from '@/components/products/ProductImageShowcase';

interface ProductGridProps {
  products: Product[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-cream-200 bg-white py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cream-100">
          <Package className="h-10 w-10 text-cream-400" />
        </div>
        <h3 className="font-heading text-xl font-bold text-emerald-950">No products found</h3>
        <p className="mt-2 max-w-sm text-sm text-emerald-700/70">
          Try adjusting your filters or search terms to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={cardVariants}>
          <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-950/5">
            {/* Image Area */}
            <Link
              href={`/products/${product.slug}`}
              className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-emerald-950"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_75%_20%,rgba(250,204,21,0.25),transparent_60%)]" />
              <ProductImageShowcase product={product} />

              {product.is_featured && (
                <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-emerald-950 shadow-sm">
                  Featured
                </span>
              )}

              {product.stock_status === 'out_of_stock' && (
                <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                  Out of Stock
                </span>
              )}
            </Link>

            {/* Card Body */}
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
                  {product.category}
                </span>
              </div>

              <Link href={`/products/${product.slug}`}>
                <h3 className="font-heading text-lg font-bold leading-tight text-emerald-950 transition-colors group-hover:text-emerald-700">
                  {product.name}
                </h3>
              </Link>

              <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-emerald-700/70">
                {product.short_description}
              </p>

              {/* Pack Sizes */}
              {product.pack_sizes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {product.pack_sizes.slice(0, 3).map((size) => (
                    <span
                      key={size}
                      className="rounded-full bg-cream-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
                    >
                      {size}
                    </span>
                  ))}
                  {product.pack_sizes.length > 3 && (
                    <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                      +{product.pack_sizes.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2">
                {product.price !== null ? (
                  <>
                    <span className="text-xl font-bold text-emerald-950">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs text-emerald-700/60">/ kg</span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-gold-600">Contact for Price</span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 bg-transparent px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-700 hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Link>
                <Link
                  href={`/products/${product.slug}#order`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-800"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
