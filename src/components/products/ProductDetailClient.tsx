'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, Package, Shield, Truck, Star, User, Phone, Mail, MapPin } from 'lucide-react';
import ImageGallery from '@/components/products/ImageGallery';
import ProductSpecs from '@/components/products/ProductSpecs';
import ProductVideo from '@/components/products/ProductVideo';
import OrderForm from '@/components/products/OrderForm';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

const LEAD_STORAGE_KEY = 'abd-world-product-lead';

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [selectedPackSize, setSelectedPackSize] = useState<string | undefined>();
  const [leadData, setLeadData] = useState({ name: '', phone: '', email: '', city: '' });
  const [leadFormOpen, setLeadFormOpen] = useState(true);
  const [leadStorageChecked, setLeadStorageChecked] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LEAD_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        name?: string;
        phone?: string;
        email?: string;
        city?: string;
      };
      if (parsed.name && parsed.phone) {
        setLeadData({
          name: parsed.name || '',
          phone: parsed.phone || '',
          email: parsed.email || '',
          city: parsed.city || '',
        });
        setLeadFormOpen(false);
      }
    } catch {
      window.localStorage.removeItem(LEAD_STORAGE_KEY);
    } finally {
      setLeadStorageChecked(true);
    }
  }, []);

  const handleOrderClick = (packSize?: string) => {
    setSelectedPackSize(packSize);
    setOrderFormOpen(true);
  };

  const handleLeadChange = (field: keyof typeof leadData, value: string) => {
    setLeadData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLeadSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = leadData.name.trim();
    const phone = leadData.phone.trim();
    const email = leadData.email.trim();
    const city = leadData.city.trim();

    if (name.length < 2) {
      alert('Please enter your full name.');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      alert('Please enter a valid phone number.');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const payload = {
      name,
      phone,
      email,
      city,
    };

    setLeadSubmitting(true);
    setLeadError('');

    try {
      const response = await fetch('/api/product-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          product_name: product.name,
          product_slug: product.slug,
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || 'We could not send your details. Please try again.');
      }

      window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(payload));
      setLeadData(payload);
      setLeadFormOpen(false);
    } catch (error) {
      setLeadError(error instanceof Error ? error.message : 'We could not send your details. Please try again.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  if (!leadStorageChecked) {
    return <div className="section-padding" aria-hidden="true" />;
  }

  if (leadFormOpen) {
    return (
      <div className="section-padding">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
            <div className="mb-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">Customer Details</p>
              <h1 className="mt-3 font-heading text-3xl font-bold text-emerald-950 sm:text-4xl">
                Please share your details
              </h1>
              <p className="mt-3 text-sm text-emerald-900/70">
                We need your contact details before showing the product details, so we can reach you directly about this item.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-emerald-950">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/40" />
                  <input
                    type="text"
                    value={leadData.name}
                    onChange={(e) => handleLeadChange('name', e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 py-3 pl-11 pr-4 text-sm text-emerald-950 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-emerald-950">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/40" />
                  <input
                    type="tel"
                    value={leadData.phone}
                    onChange={(e) => handleLeadChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 py-3 pl-11 pr-4 text-sm text-emerald-950 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-emerald-950">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/40" />
                  <input
                    type="email"
                    value={leadData.email}
                    onChange={(e) => handleLeadChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 py-3 pl-11 pr-4 text-sm text-emerald-950 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-emerald-950">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/40" />
                  <input
                    type="text"
                    value={leadData.city}
                    onChange={(e) => handleLeadChange('city', e.target.value)}
                    placeholder="Your city"
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 py-3 pl-11 pr-4 text-sm text-emerald-950 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={leadSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart className="h-4 w-4" />
                {leadSubmitting ? 'Sending Details...' : 'Continue to Product Details'}
              </button>
              {leadError && (
                <p role="alert" className="text-center text-sm font-medium text-red-600">
                  {leadError}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl">
        {/* Main Product Layout */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left - Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ImageGallery
              images={product.images ?? []}
              mainImage={product.main_image}
              alt={product.name}
            />
          </motion.div>

          {/* Right - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <div className="mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">
                {product.category}
              </span>
            </div>

            <h1 className="font-heading text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating Placeholder */}
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-gold-400 text-gold-400" />
              ))}
              <span className="ml-2 text-xs text-cream-500">Premium Quality</span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-emerald-700/80">
              {product.short_description}
            </p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              {product.price !== null ? (
                <>
                  <span className="text-3xl font-bold text-emerald-950">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-emerald-700/60">per kg</span>
                </>
              ) : (
                <span className="text-lg font-semibold text-gold-600">Contact for Price</span>
              )}
            </div>

            {/* Pack Sizes */}
            {product.pack_sizes.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Available Pack Sizes
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.pack_sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleOrderClick(size)}
                      className="rounded-xl border-2 border-cream-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition-all hover:border-emerald-500 hover:bg-emerald-50"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mt-5">
              {product.stock_status === 'in_stock' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div id="order" className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handleOrderClick()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/15 transition-all hover:bg-emerald-800 hover:shadow-xl"
              >
                <ShoppingCart className="h-5 w-5" />
                Order Now
              </button>
              <button
                onClick={() => handleOrderClick()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-transparent px-8 py-3.5 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-50"
              >
                <MessageCircle className="h-5 w-5" />
                Enquire via WhatsApp
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: <Shield className="h-5 w-5" />, label: 'Quality Assured' },
                { icon: <Truck className="h-5 w-5" />, label: 'Fast Delivery' },
                { icon: <Package className="h-5 w-5" />, label: 'Bulk Discounts' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-cream-200 bg-cream-50 p-3 text-center"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    {badge.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Full Description */}
        {product.full_description && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <h2 className="font-heading text-2xl font-bold text-emerald-950 mb-6">
              About This <span className="text-gradient">Product</span>
            </h2>
            <div className="prose max-w-none rounded-2xl border border-cream-200 bg-white p-8 text-sm leading-relaxed text-emerald-800">
              {product.full_description.split('\n').map((paragraph, i) => (
                <p key={i} className={i > 0 ? 'mt-4' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Specifications */}
        <div className="mt-16">
          <ProductSpecs
            rice_type={product.rice_type}
            origin={product.origin}
            grain_length={product.grain_length}
            aroma={product.aroma}
            texture={product.texture}
            cooking_info={product.cooking_info}
            best_used_for={product.best_used_for}
            pack_sizes={product.pack_sizes}
          />
        </div>

        {/* Video */}
        {product.video_url && (
          <div className="mt-16">
            <ProductVideo
              videoUrl={product.video_url}
              posterImage={product.main_image}
              productName={product.name}
            />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-emerald-950 mb-8">
              Related <span className="text-gradient">Products</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/products/${rp.slug}`}
                  className="group overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-cream-100">
                    {rp.main_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rp.main_image}
                        alt={rp.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-4xl opacity-40">🌾</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
                      {rp.category}
                    </p>
                    <h3 className="mt-1 font-heading text-base font-bold text-emerald-950 group-hover:text-emerald-700">
                      {rp.name}
                    </h3>
                    {rp.price !== null && (
                      <p className="mt-2 text-sm font-semibold text-emerald-800">{formatPrice(rp.price)}/kg</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      <OrderForm
        product={product}
        isOpen={orderFormOpen}
        onClose={() => setOrderFormOpen(false)}
        selectedPackSize={selectedPackSize}
      />
    </div>
  );
}
