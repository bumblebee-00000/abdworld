'use client';

import { motion } from 'framer-motion';
import {
  Wheat,
  MapPin,
  Ruler,
  Wind,
  ChefHat,
  Flame,
  UtensilsCrossed,
  Package,
} from 'lucide-react';

interface SpecItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface ProductSpecsProps {
  rice_type?: string;
  origin?: string;
  grain_length?: string;
  aroma?: string;
  texture?: string;
  cooking_info?: string;
  best_used_for?: string;
  pack_sizes?: string[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ProductSpecs({
  rice_type,
  origin,
  grain_length,
  aroma,
  texture,
  cooking_info,
  best_used_for,
  pack_sizes,
}: ProductSpecsProps) {
  const specs: SpecItem[] = [];

  if (rice_type) specs.push({ label: 'Rice Type', value: rice_type, icon: <Wheat className="h-5 w-5" /> });
  if (origin) specs.push({ label: 'Origin', value: origin, icon: <MapPin className="h-5 w-5" /> });
  if (grain_length) specs.push({ label: 'Grain Length', value: grain_length, icon: <Ruler className="h-5 w-5" /> });
  if (aroma) specs.push({ label: 'Aroma', value: aroma, icon: <Wind className="h-5 w-5" /> });
  if (texture) specs.push({ label: 'Texture', value: texture, icon: <ChefHat className="h-5 w-5" /> });
  if (cooking_info) specs.push({ label: 'Cooking Info', value: cooking_info, icon: <Flame className="h-5 w-5" /> });
  if (best_used_for) specs.push({ label: 'Best Used For', value: best_used_for, icon: <UtensilsCrossed className="h-5 w-5" /> });
  if (pack_sizes && pack_sizes.length > 0) {
    specs.push({ label: 'Packaging', value: pack_sizes.join(', '), icon: <Package className="h-5 w-5" /> });
  }

  if (specs.length === 0) return null;

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-emerald-950 mb-6">
        Product <span className="text-gradient">Specifications</span>
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {specs.map((spec, i) => (
          <motion.div
            key={spec.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="group flex items-start gap-4 rounded-xl border border-cream-200 bg-white p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
              {spec.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-cream-500">
                {spec.label}
              </p>
              <p className="mt-1 text-sm font-medium text-emerald-950 leading-relaxed">
                {spec.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
