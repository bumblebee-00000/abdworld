'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
  categories: string[];
  packSizes: string[];
  priceRange: string;
}

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  allPackSizes: string[];
}

const priceRanges = [
  { label: 'All Prices', value: '' },
  { label: 'Under ₹100', value: '0-100' },
  { label: '₹100 - ₹300', value: '100-300' },
  { label: '₹300 - ₹500', value: '300-500' },
  { label: '₹500 - ₹1000', value: '500-1000' },
  { label: 'Above ₹1000', value: '1000-999999' },
];

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: 0.25 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-cream-200 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-emerald-950">
          {title}
        </h3>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-emerald-600 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterContent({ filters, onFilterChange, categories, allPackSizes }: {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  allPackSizes: string[];
}) {
  const togglePackSize = (size: string) => {
    const newSizes = filters.packSizes.includes(size)
      ? filters.packSizes.filter((s) => s !== size)
      : [...filters.packSizes, size];
    onFilterChange({ ...filters, packSizes: newSizes });
  };

  const clearAll = () => {
    onFilterChange({ categories: [], packSizes: [], priceRange: '' });
  };

  const hasActiveFilters =
    filters.categories.length > 0 || filters.packSizes.length > 0 || filters.priceRange;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
        <h2 className="font-heading text-lg font-bold text-emerald-950">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs font-medium text-gold-600 transition-colors hover:text-gold-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        <FilterSection title="Category">
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <label
                key={cat}
                onClick={() => {
                  const newCategories = filters.categories.includes(cat)
                    ? filters.categories.filter((c) => c !== cat)
                    : [...filters.categories, cat];
                  onFilterChange({ ...filters, categories: newCategories });
                }}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-cream-50"
              >
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded border-2 transition-all',
                    filters.categories.includes(cat)
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-cream-400 bg-white'
                  )}
                >
                  {filters.categories.includes(cat) && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-emerald-800">{cat}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price Range">
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-cream-50"
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border-2 transition-all',
                    filters.priceRange === range.value
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-cream-400 bg-white'
                  )}
                >
                  {filters.priceRange === range.value && (
                    <div className="mx-auto mt-0.5 h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-sm text-emerald-800">{range.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {allPackSizes.length > 0 && (
          <FilterSection title="Pack Size" defaultOpen={false}>
            <div className="flex flex-wrap gap-2">
              {allPackSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => togglePackSize(size)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    filters.packSizes.includes(size)
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-cream-300 bg-white text-emerald-700 hover:border-emerald-400'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterSection>
        )}
      </div>
    </div>
  );
}

export default function ProductFilters({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  categories,
  allPackSizes,
}: ProductFiltersProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-cream-200 bg-white shadow-sm">
          <FilterContent
            filters={filters}
            onFilterChange={onFilterChange}
            categories={categories}
            allPackSizes={allPackSizes}
          />
        </div>
      </div>

      {/* Mobile Slide-out */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-emerald-950/60 backdrop-blur-sm lg:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                onClick={onClose}
                className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-cream-100 text-emerald-700 transition-colors hover:bg-cream-200"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
              <FilterContent
                filters={filters}
                onFilterChange={onFilterChange}
                categories={categories}
                allPackSizes={allPackSizes}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
