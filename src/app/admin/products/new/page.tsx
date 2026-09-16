import Link from 'next/link';
import { ChevronRight, Plus } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

export const metadata = {
  title: 'Add Product | Admin',
};

export default function NewProductPage() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm text-emerald-900/50 mb-4">
        <Link href="/admin/products" className="hover:text-emerald-700 transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-700 font-medium">Add Product</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
          <Plus className="w-5 h-5 text-emerald-950" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-emerald-950 font-[var(--font-heading)]">
            Add New Product
          </h1>
          <p className="text-sm text-emerald-900/50">
            Fill in the details below to add a new rice product.
          </p>
        </div>
      </div>

      <ProductForm />
    </>
  );
}