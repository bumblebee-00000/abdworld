'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/types';

interface ProductImageShowcaseProps {
  product: Product;
}

export default function ProductImageShowcase({ product }: ProductImageShowcaseProps) {
  const images = [product.main_image, ...product.images].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return <div className="h-full w-full bg-emerald-950" />;
  }

  const mainImage = images[activeIndex];
  const accentImage = images[(activeIndex + 1) % images.length];

  return (
    <>
      <div className="absolute right-4 top-4 z-10 flex animate-float items-center overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm">
        <motion.img
          key={`accent-${accentImage}`}
          src={accentImage}
          alt=""
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="h-14 w-14 object-cover"
          loading="lazy"
        />
      </div>
      <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110">
        <motion.img
          key={`main-${mainImage}`}
          src={mainImage}
          alt={product.name}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </>
  );
}
