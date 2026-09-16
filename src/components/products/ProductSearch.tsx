'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
}

export default function ProductSearch({ onSearch, onFilterToggle }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(query), 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, onSearch]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rice varieties..."
          className="w-full rounded-xl border-2 border-cream-300 bg-white py-3 pl-12 pr-10 text-emerald-950 outline-none transition-all duration-300 placeholder:text-cream-500 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(5,150,105,0.15)]"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-cream-100 text-emerald-600 transition-colors hover:bg-cream-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <button
        onClick={onFilterToggle}
        className="flex h-12 items-center gap-2 rounded-xl border-2 border-cream-300 bg-white px-4 text-emerald-700 transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-50 lg:hidden"
        aria-label="Toggle filters"
      >
        <SlidersHorizontal className="h-5 w-5" />
        <span className="hidden text-sm font-medium sm:inline">Filters</span>
      </button>
    </div>
  );
}