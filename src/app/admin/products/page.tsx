'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Package,
  Star,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (!ignore) setProducts(data.products || []);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.origin.toLowerCase().includes(q) ||
      p.rice_type.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete product');
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: false } : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="mt-4 text-sm text-emerald-900/60">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-950 font-[var(--font-heading)]">
            Products
          </h2>
          <p className="text-sm text-emerald-900/50 mt-1">
            {products.length} products total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-800 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category, origin..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-50 text-left text-xs uppercase tracking-wider text-emerald-900/50">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Featured</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Package className="w-12 h-12 text-emerald-900/20 mx-auto mb-4" />
                    <p className="text-emerald-900/50">
                      {search
                        ? 'No products match your search.'
                        : 'No products yet. Add your first product!'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-cream-50 transition-colors ${
                      !product.is_active ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                          {product.main_image ? (
                            <Image
                              src={product.main_image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-emerald-900/30" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-950">
                            {product.name}
                          </p>
                          <p className="text-xs text-emerald-900/40">
                            {product.rice_type} • {product.origin}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                          product.stock_status === 'in_stock'
                            ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                            : product.stock_status === 'low_stock'
                              ? 'border-gold-200 bg-gold-100 text-gold-700'
                              : 'border-red-200 bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stock_status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-900/70">
                      {product.price ? (
                        <>
                          <p className="font-medium text-emerald-950">
                            {formatPrice(product.price)}
                          </p>
                          {product.wholesale_price && (
                            <p className="text-xs text-emerald-900/40">
                              Wholesale: {formatPrice(product.wholesale_price)}
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="text-emerald-900/40">Price on request</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Star
                        className={`w-5 h-5 ${
                          product.is_featured
                            ? 'fill-gold-400 text-gold-400'
                            : 'text-emerald-900/20'
                        }`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        {deleteId === product.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deleting}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
                            >
                              {deleting ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-cream-100 rounded-lg hover:bg-cream-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}