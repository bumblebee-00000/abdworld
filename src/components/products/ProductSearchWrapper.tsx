'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductSearch from '@/components/products/ProductSearch';
import ProductFilters, { type FilterState } from '@/components/products/ProductFilters';

interface ProductSearchWrapperProps {
  categories?: string[];
}

export default function ProductSearchWrapper({ categories = [] }: ProductSearchWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    packSizes: [],
    priceRange: '',
  });

  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      params.delete('page');
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const applyFilters = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');
      const joined = newFilters.categories.join(',');
      if (joined) {
        params.set('category', joined);
      } else {
        params.delete('category');
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      applyFilters(newFilters);
    },
    [applyFilters]
  );

  const safeCategories = categories.length > 0 ? categories : ['Basmati', 'Non-Basmati', 'Premium', 'Specialty'];

  return (
    <>
      <ProductSearch onSearch={handleSearch} onFilterToggle={() => setFiltersOpen(true)} />
      <ProductFilters
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={safeCategories}
        allPackSizes={['1kg', '5kg', '10kg', '25kg', '50kg']}
      />
    </>
  );
}
