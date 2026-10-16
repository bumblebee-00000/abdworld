'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Loader2, AlertCircle, User, Phone, Mail, MapPin } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { cn, generateWhatsAppUrl, generateOrderMessage, formatExactPrice, formatPrice, parsePackWeightKg } from '@/lib/utils';
import { normalizePhoneNumber, useSiteSettings } from '@/components/settings/SiteSettingsProvider';
import type { Product } from '@/types';

interface OrderFormProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  selectedPackSize?: string;
}

type FormStatus = 'idle' | 'loading' | 'error';

interface FormData {
  pack_size: string;
  quantity: number;
  customer_name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  pack_size: '',
  quantity: 1,
  customer_name: '',
  phone: '',
  email: '',
  city: '',
  message: '',
};

function getMinimumPackCount(minimumOrderKg: number, packSize: string): number | null {
  const packWeightKg = parsePackWeightKg(packSize);
  return packWeightKg ? Math.ceil(minimumOrderKg / packWeightKg) : null;
}

function validateForm(data: FormData, minimumOrderKg: number): FormErrors {
  const errors: FormErrors = {};
  const minimumPackCount = getMinimumPackCount(minimumOrderKg, data.pack_size);

  if (!data.pack_size) errors.pack_size = 'Please select a pack size';
  if (!data.quantity || data.quantity < 1) errors.quantity = 'Quantity must be at least 1';
  else if (minimumPackCount === null) errors.pack_size = 'We cannot confirm the weight for this pack size. Please contact us.';
  else if (data.quantity < minimumPackCount) {
    errors.quantity = `Minimum order is ${minimumOrderKg} kg (${minimumPackCount} packs of ${data.pack_size}).`;
  }
  if (!data.customer_name || data.customer_name.length < 2) errors.customer_name = 'Name is required';
  if (data.phone.replace(/\D/g, '').length < 10) errors.phone = 'Valid phone number is required';
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email address';
  if (data.city && data.city.length < 2) errors.city = 'Enter a valid city';

  return errors;
}

export default function OrderForm({ product, isOpen, onClose, selectedPackSize }: OrderFormProps) {
  const settings = useSiteSettings();
  const minimumOrderKg = Math.max(1, product.min_order_quantity || 1);
  const initialPackSize = selectedPackSize || product.pack_sizes[0] || '';
  const initialMinimumPackCount = getMinimumPackCount(minimumOrderKg, initialPackSize);
  const [formData, setFormData] = useState<FormData>(() => ({
    ...initialFormData,
    pack_size: initialPackSize,
    quantity: initialMinimumPackCount || 1,
  }));
  const currentMinimumPackCount = getMinimumPackCount(minimumOrderKg, formData.pack_size);
  const selectedPackWeightKg = parsePackWeightKg(formData.pack_size);
  const orderSubtotal = product.price != null && selectedPackWeightKg
    ? product.price * selectedPackWeightKg * formData.quantity
    : null;
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => {
      if (field !== 'pack_size') return { ...prev, [field]: value };

      const nextPackSize = String(value);
      const previousMinimum = getMinimumPackCount(minimumOrderKg, prev.pack_size);
      const nextMinimum = getMinimumPackCount(minimumOrderKg, nextPackSize);
      const quantity = nextMinimum === null
        ? prev.quantity
        : previousMinimum !== null && prev.quantity <= previousMinimum
          ? nextMinimum
          : Math.max(prev.quantity, nextMinimum);

      return { ...prev, pack_size: nextPackSize, quantity };
    });
    if (errors[field] || (field === 'pack_size' && errors.quantity)) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        if (field === 'pack_size') delete next.quantity;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, minimumOrderKg);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          product_id: product.id,
          product_name: product.name,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      const data = await res.json();
      if (!data.paymentUrl) throw new Error('Payment checkout is unavailable. Please try again.');
      window.location.assign(data.paymentUrl);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit order');
    }
  };

  const handleWhatsApp = () => {
    const minimumPackCount = getMinimumPackCount(minimumOrderKg, formData.pack_size);
    if (minimumPackCount === null || formData.quantity < minimumPackCount) {
      setErrors((prev) => ({
        ...prev,
        [minimumPackCount === null ? 'pack_size' : 'quantity']: minimumPackCount === null
          ? 'We cannot confirm the weight for this pack size. Please contact us.'
          : `Minimum order is ${minimumOrderKg} kg (${minimumPackCount} packs of ${formData.pack_size}).`,
      }));
      return;
    }

    const message = generateOrderMessage({
      product_name: product.name,
      pack_size: formData.pack_size,
      quantity: formData.quantity,
      customer_name: formData.customer_name,
      city: formData.city,
    });
    const url = generateWhatsAppUrl(normalizePhoneNumber(settings.whatsapp_number), message);
    window.open(url, '_blank');
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Order - ${product.name}`}
    >
      <AnimatePresence mode="wait">
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3"
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </motion.div>
            )}

            <div className="flex items-center gap-4 rounded-xl bg-cream-50 border border-cream-200 p-4">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-cream-200">
                {product.main_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.main_image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">🌾</div>
                )}
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-emerald-950">{product.name}</p>
                {product.price !== null && (
                  <p className="text-xs text-emerald-700/70">{formatPrice(product.price)} / kg</p>
                )}
                {orderSubtotal !== null && (
                  <p className="mt-1 text-sm font-semibold text-emerald-950">
                    Full advance: {formatExactPrice(orderSubtotal)}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs leading-relaxed text-emerald-800/70">
              This payment covers the rice subtotal. Delivery charges and arrangements are confirmed separately. The price is secured only after successful payment.
            </p>

            {/* Pack Size & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Pack Size *
                </label>
                <select
                  value={formData.pack_size}
                  onChange={(e) => updateField('pack_size', e.target.value)}
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all',
                    errors.pack_size ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                >
                  <option value="">Select size</option>
                  {product.pack_sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {errors.pack_size && <p className="mt-1 text-xs text-red-500">{errors.pack_size}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Number of Packs *
                </label>
                <input
                  type="number"
                  min={currentMinimumPackCount || 1}
                  step={1}
                  max={10000}
                  value={formData.quantity}
                  onChange={(e) => updateField('quantity', parseInt(e.target.value, 10) || 0)}
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all',
                    errors.quantity ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
                <p className="mt-1 text-xs text-emerald-800/70">
                  Minimum: {minimumOrderKg} kg
                  {formData.pack_size && currentMinimumPackCount && ` (${currentMinimumPackCount} packs of ${formData.pack_size})`}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <User className="h-3.5 w-3.5" /> Full Name *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => updateField('customer_name', e.target.value)}
                placeholder="Your full name"
                className={cn(
                  'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                  errors.customer_name ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                )}
              />
              {errors.customer_name && <p className="mt-1 text-xs text-red-500">{errors.customer_name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <Phone className="h-3.5 w-3.5" /> Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="10-digit phone"
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                    errors.phone ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <Mail className="h-3.5 w-3.5" /> Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Optional"
                  className={cn(
                    'w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400 focus:border-emerald-500',
                    errors.email && 'border-red-300 focus:border-red-500'
                  )}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <MapPin className="h-3.5 w-3.5" /> City (Optional)
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="Your city"
                className={cn(
                  'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                  errors.city ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                )}
              />
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Any special requirements..."
                rows={2}
                className="w-full resize-none rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400 focus:border-emerald-500"
              />
            </div>

            <p className="text-xs leading-relaxed text-emerald-800/70">
              Your payment link uses the displayed retail price and expires when a scheduled increase takes effect.
            </p>

            {/* Submit Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={status === 'loading' || orderSubtotal === null || orderSubtotal < 1}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Opening secure checkout...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {orderSubtotal !== null && orderSubtotal >= 1 ? 'Pay full amount' : 'Price unavailable online'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={status === 'loading'}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-transparent px-6 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-50 disabled:opacity-60"
              >
                <MessageCircle className="h-4 w-4" />
                Order via WhatsApp
              </button>
            </div>
        </motion.form>
      </AnimatePresence>
    </Modal>
  );
}
