'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Pencil, Loader2, AlertCircle } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import type { Product } from '@/types';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data.product || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="mt-4 text-sm text-emerald-900/60">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="mt-4 text-sm text-red-600">
          {error || 'Product not found'}
        </p>
        <Link
          href="/admin/products"
          className="mt-6 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-emerald-900/50 mb-4">
        <Link href="/admin/products" className="hover:text-emerald-700 transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-700 font-medium">Edit Product</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
          <Pencil className="w-5 h-5 text-emerald-950" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-emerald-950 font-[var(--font-heading)]">
            Edit Product
          </h1>
          <p className="text-sm text-emerald-900/50">
            Update the details for {product.name}
          </p>
        </div>
      </div>

      <ProductForm productId={id} initialData={product} />
    </>
  );
}