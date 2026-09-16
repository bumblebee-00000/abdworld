'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { productSchema } from '@/lib/validation';
import { slugify } from '@/lib/utils';
import type { Product } from '@/types';

type Errors = Record<string, string>;

interface ProductFormValues {
  name: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  main_image: string;
  images: string;
  video_url: string;
  price: string;
  wholesale_price: string;
  pack_sizes: string;
  rice_type: string;
  origin: string;
  grain_length: string;
  aroma: string;
  texture: string;
  cooking_info: string;
  best_used_for: string;
  min_order_quantity: string;
  stock_status: string;
  is_featured: boolean;
  is_active: boolean;
  seo_title: string;
  seo_description: string;
}

interface ProductFormProps {
  initialData?: Partial<
    Omit<Product, 'id' | 'created_at' | 'updated_at'>
  >;
  productId?: string;
}

const categories = [
  'basmati',
  'non-basmati',
  'specialty',
  'golden-sella',
  'brown-rice',
  'other',
];

const emptyValues: ProductFormValues = {
  name: '',
  slug: '',
  category: 'basmati',
  short_description: '',
  full_description: '',
  main_image: '',
  images: '',
  video_url: '',
  price: '',
  wholesale_price: '',
  pack_sizes: '',
  rice_type: '',
  origin: '',
  grain_length: '',
  aroma: '',
  texture: '',
  cooking_info: '',
  best_used_for: '',
  min_order_quantity: '1',
  stock_status: 'in_stock',
  is_featured: false,
  is_active: true,
  seo_title: '',
  seo_description: '',
};

function buildInitialValues(initialData?: ProductFormProps['initialData']): ProductFormValues {
  if (!initialData) return emptyValues;
  const imagesRaw = initialData.images;
  return {
    name: initialData.name || '',
    slug: initialData.slug || '',
    category: initialData.category || 'basmati',
    short_description: initialData.short_description || '',
    full_description: initialData.full_description || '',
    main_image: initialData.main_image || '',
    images: typeof imagesRaw === 'string' ? imagesRaw : (imagesRaw || []).join(', '),
    video_url: initialData.video_url || '',
    price: initialData.price ? String(initialData.price) : '',
    wholesale_price: initialData.wholesale_price
      ? String(initialData.wholesale_price)
      : '',
    pack_sizes: (initialData.pack_sizes || []).join(', '),
    rice_type: initialData.rice_type || '',
    origin: initialData.origin || '',
    grain_length: initialData.grain_length || '',
    aroma: initialData.aroma || '',
    texture: initialData.texture || '',
    cooking_info: initialData.cooking_info || '',
    best_used_for: initialData.best_used_for || '',
    min_order_quantity: initialData.min_order_quantity
      ? String(initialData.min_order_quantity)
      : '1',
    stock_status: initialData.stock_status || 'in_stock',
    is_featured: initialData.is_featured || false,
    is_active: initialData.is_active ?? true,
    seo_title: initialData.seo_title || '',
    seo_description: initialData.seo_description || '',
  };
}

export default function ProductForm({
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(() =>
    buildInitialValues(initialData)
  );
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [allowSlugEdit, setAllowSlugEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValues((prev) => ({ ...prev, [name]: checked }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (name === 'name' && !allowSlugEdit) {
        setValues((prev) => ({ ...prev, slug: slugify(value) }));
      }
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const buildPayload = () => ({
    name: values.name,
    slug: values.slug || slugify(values.name),
    category: values.category,
    short_description: values.short_description,
    full_description: values.full_description,
    main_image: values.main_image,
    images: values.images
      ? values.images
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    video_url: values.video_url,
    price: values.price ? parseFloat(values.price) : null,
    wholesale_price: values.wholesale_price
      ? parseFloat(values.wholesale_price)
      : null,
    pack_sizes: values.pack_sizes
      ? values.pack_sizes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    rice_type: values.rice_type,
    origin: values.origin,
    grain_length: values.grain_length,
    aroma: values.aroma,
    texture: values.texture,
    cooking_info: values.cooking_info,
    best_used_for: values.best_used_for,
    min_order_quantity: values.min_order_quantity
      ? parseInt(values.min_order_quantity, 10)
      : 1,
    stock_status: values.stock_status,
    is_featured: values.is_featured,
    is_active: values.is_active,
    seo_title: values.seo_title,
    seo_description: values.seo_description,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError('');

    const payload = buildPayload();
    const result = productSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Errors = {};
      result.error.issues.forEach((issue) => {
        const path = String(issue.path[0]);
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: productId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Failed to save product.');
        return;
      }

      router.push('/admin/products');
      router.refresh();
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 bg-cream-50 border ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-cream-300 focus:border-emerald-500 focus:ring-emerald-100'
    } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {serverError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-sm font-bold text-emerald-950">
            1
          </span>
          <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
            Basic Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Premium Basmati Rice"
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="slug"
                value={values.slug}
                onChange={handleChange}
                disabled={!allowSlugEdit}
                placeholder="premium-basmati-rice"
                className={`${inputClass(!!errors.slug)} ${
                  !allowSlugEdit ? 'bg-cream-100 text-emerald-900/50' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setAllowSlugEdit(!allowSlugEdit)}
                className="p-2.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-cream-200 shrink-0"
                aria-label="Toggle slug editing"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            {errors.slug && (
              <p className="mt-1.5 text-xs text-red-500">{errors.slug}</p>
            )}
            {!allowSlugEdit && (
              <p className="mt-1.5 text-xs text-emerald-900/40">
                Auto-generated from name. Click the icon to edit.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              className={inputClass(!!errors.category)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat.replace('-', ' ')}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Rice Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="rice_type"
              value={values.rice_type}
              onChange={handleChange}
              placeholder="e.g. Long Grain / Aged"
              className={inputClass(!!errors.rice_type)}
            />
            {errors.rice_type && (
              <p className="mt-1.5 text-xs text-red-500">{errors.rice_type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Origin <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="origin"
              value={values.origin}
              onChange={handleChange}
              placeholder="e.g. Punjab, India"
              className={inputClass(!!errors.origin)}
            />
            {errors.origin && (
              <p className="mt-1.5 text-xs text-red-500">{errors.origin}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Stock Status
            </label>
            <select
              name="stock_status"
              value={values.stock_status}
              onChange={handleChange}
              className={inputClass(false)}
            >
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Min Order Quantity
            </label>
            <input
              type="number"
              name="min_order_quantity"
              value={values.min_order_quantity}
              onChange={handleChange}
              min={1}
              className={inputClass(!!errors.min_order_quantity)}
            />
            {errors.min_order_quantity && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.min_order_quantity}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-emerald-950 mb-2">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="short_description"
            value={values.short_description}
            onChange={handleChange}
            placeholder="One-line summary shown on product cards"
            className={inputClass(!!errors.short_description)}
          />
          {errors.short_description && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.short_description}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-emerald-950 mb-2">
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="full_description"
            value={values.full_description}
            onChange={handleChange}
            rows={6}
            placeholder="Detailed product description"
            className={`${inputClass(!!errors.full_description)} resize-none`}
          />
          {errors.full_description && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.full_description}
            </p>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-sm font-bold text-emerald-950">
            2
          </span>
          <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
            Images & Media
          </h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Main Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="main_image"
              value={values.main_image}
              onChange={(e) => {
                handleChange(e);
                setPreviewImage(e.target.value);
              }}
              placeholder="https://example.com/image.jpg"
              className={inputClass(!!errors.main_image)}
            />
            {errors.main_image && (
              <p className="mt-1.5 text-xs text-red-500">{errors.main_image}</p>
            )}
            <p className="mt-2 text-xs text-emerald-900/40">
              For now, paste image URLs. File upload will be available in a
              future update.
            </p>
            {previewImage && (
              <div className="mt-3 relative w-40 h-32 rounded-lg overflow-hidden border border-cream-200 bg-cream-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Additional Image URLs
            </label>
            <input
              type="text"
              name="images"
              value={values.images}
              onChange={handleChange}
              placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
              className={inputClass(false)}
            />
            <p className="mt-2 text-xs text-emerald-900/40">
              Separate URLs with commas.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Video URL
            </label>
            <input
              type="text"
              name="video_url"
              value={values.video_url}
              onChange={handleChange}
              placeholder="https://example.com/video.mp4"
              className={inputClass(!!errors.video_url)}
            />
            {errors.video_url && (
              <p className="mt-1.5 text-xs text-red-500">{errors.video_url}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Packaging */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-sm font-bold text-emerald-950">
            3
          </span>
          <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
            Pricing & Packaging
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Retail Price (₹/kg)
            </label>
            <input
              type="number"
              name="price"
              value={values.price}
              onChange={handleChange}
              min={0}
              step="0.01"
              placeholder="e.g. 120"
              className={inputClass(!!errors.price)}
            />
            {errors.price && (
              <p className="mt-1.5 text-xs text-red-500">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Wholesale Price (₹/kg)
            </label>
            <input
              type="number"
              name="wholesale_price"
              value={values.wholesale_price}
              onChange={handleChange}
              min={0}
              step="0.01"
              placeholder="e.g. 105"
              className={inputClass(!!errors.wholesale_price)}
            />
            {errors.wholesale_price && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.wholesale_price}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-emerald-950 mb-2">
            Pack Sizes <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="pack_sizes"
              value={values.pack_sizes}
              onChange={handleChange}
              placeholder="5kg, 10kg, 25kg, 50kg"
              className={inputClass(!!errors.pack_sizes)}
            />
          </div>
          {errors.pack_sizes && (
            <p className="mt-1.5 text-xs text-red-500">{errors.pack_sizes}</p>
          )}
          <p className="mt-2 text-xs text-emerald-900/40">
            Separate sizes with commas. e.g. 5kg, 10kg, 25kg
          </p>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-sm font-bold text-emerald-950">
            4
          </span>
          <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
            Specifications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Grain Length
            </label>
            <input
              type="text"
              name="grain_length"
              value={values.grain_length}
              onChange={handleChange}
              placeholder="e.g. Extra Long (8.4mm+)"
              className={inputClass(!!errors.grain_length)}
            />
            {errors.grain_length && (
              <p className="mt-1.5 text-xs text-red-500">{errors.grain_length}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Aroma
            </label>
            <input
              type="text"
              name="aroma"
              value={values.aroma}
              onChange={handleChange}
              placeholder="e.g. Natural fragrant aroma"
              className={inputClass(!!errors.aroma)}
            />
            {errors.aroma && (
              <p className="mt-1.5 text-xs text-red-500">{errors.aroma}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Texture
            </label>
            <input
              type="text"
              name="texture"
              value={values.texture}
              onChange={handleChange}
              placeholder="e.g. Soft, fluffy"
              className={inputClass(!!errors.texture)}
            />
            {errors.texture && (
              <p className="mt-1.5 text-xs text-red-500">{errors.texture}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Best Used For
            </label>
            <input
              type="text"
              name="best_used_for"
              value={values.best_used_for}
              onChange={handleChange}
              placeholder="e.g. Biryani, Pulao, Daily meals"
              className={inputClass(!!errors.best_used_for)}
            />
            {errors.best_used_for && (
              <p className="mt-1.5 text-xs text-red-500">{errors.best_used_for}</p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-emerald-950 mb-2">
            Cooking Info
          </label>
          <textarea
            name="cooking_info"
            value={values.cooking_info}
            onChange={handleChange}
            rows={3}
            placeholder="Soaking time, water ratio, cooking tips..."
            className={`${inputClass(!!errors.cooking_info)} resize-none`}
          />
          {errors.cooking_info && (
            <p className="mt-1.5 text-xs text-red-500">{errors.cooking_info}</p>
          )}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-sm font-bold text-emerald-950">
            5
          </span>
          <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
            SEO
          </h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              name="seo_title"
              value={values.seo_title}
              onChange={handleChange}
              placeholder="e.g. Buy Premium Basmati Rice Wholesale"
              className={inputClass(!!errors.seo_title)}
            />
            {errors.seo_title && (
              <p className="mt-1.5 text-xs text-red-500">{errors.seo_title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              SEO Description
            </label>
            <textarea
              name="seo_description"
              value={values.seo_description}
              onChange={handleChange}
              rows={3}
              placeholder="Meta description shown in search results"
              className={`${inputClass(!!errors.seo_description)} resize-none`}
            />
            {errors.seo_description && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.seo_description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-sm font-bold text-emerald-950">
            6
          </span>
          <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
            Visibility
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="flex items-center justify-between p-5 bg-cream-50 rounded-xl border border-cream-200 cursor-pointer hover:border-emerald-400 transition-colors">
            <div>
              <span className="block font-semibold text-emerald-950 text-sm">
                Active Product
              </span>
              <span className="block text-xs text-emerald-900/50 mt-0.5">
                Visible to the public
              </span>
            </div>
            <input
              type="checkbox"
              name="is_active"
              checked={values.is_active}
              onChange={handleChange}
              className="w-5 h-5 accent-emerald-600"
            />
          </label>

          <label className="flex items-center justify-between p-5 bg-cream-50 rounded-xl border border-cream-200 cursor-pointer hover:border-gold-400 transition-colors">
            <div>
              <span className="block font-semibold text-emerald-950 text-sm">
                Featured Product
              </span>
              <span className="block text-xs text-emerald-900/50 mt-0.5">
                Show on homepage
              </span>
            </div>
            <input
              type="checkbox"
              name="is_featured"
              checked={values.is_featured}
              onChange={handleChange}
              className="w-5 h-5 accent-gold-500"
            />
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="sticky bottom-4 flex flex-col sm:flex-row items-center gap-4 bg-white/90 backdrop-blur-md rounded-2xl border border-cream-200 p-4 shadow-xl shadow-emerald-900/5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-900/10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : productId ? (
            'Update Product'
          ) : (
            'Create Product'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="w-full sm:w-auto px-8 py-3.5 text-emerald-900 font-semibold rounded-xl border border-cream-300 hover:bg-cream-100 transition-colors"
        >
          Cancel
        </button>
        {errors && Object.keys(errors).length > 0 && (
          <p className="text-xs text-red-500 text-center sm:text-left">
            Please fix the highlighted fields and try again.
          </p>
        )}
      </div>
    </form>
  );
}