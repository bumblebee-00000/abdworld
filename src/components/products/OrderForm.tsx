'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Loader2, CheckCircle2, AlertCircle, User, Phone, Mail, MapPin, Hash } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { cn, generateWhatsAppUrl, generateOrderMessage, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

interface OrderFormProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  selectedPackSize?: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  pack_size: string;
  quantity: number;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
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
  address: '',
  city: '',
  state: '',
  pin_code: '',
  message: '',
};

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.pack_size) errors.pack_size = 'Please select a pack size';
  if (!data.quantity || data.quantity < 1) errors.quantity = 'Quantity must be at least 1';
  if (!data.customer_name || data.customer_name.length < 2) errors.customer_name = 'Name is required';
  if (!data.phone || data.phone.length < 10) errors.phone = 'Valid phone number is required';
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email address';
  if (!data.address || data.address.length < 5) errors.address = 'Address is required';
  if (!data.city || data.city.length < 2) errors.city = 'City is required';
  if (!data.state || data.state.length < 2) errors.state = 'State is required';
  if (!data.pin_code || data.pin_code.length < 4) errors.pin_code = 'Valid PIN code is required';

  return errors;
}

export default function OrderForm({ product, isOpen, onClose, selectedPackSize }: OrderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    pack_size: selectedPackSize || product.pack_sizes[0] || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
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

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit order');
    }
  };

  const handleWhatsApp = () => {
    const message = generateOrderMessage({
      product_name: product.name,
      pack_size: formData.pack_size,
      quantity: formData.quantity,
      customer_name: formData.customer_name,
      city: formData.city,
    });
    const url = generateWhatsAppUrl(WHATSAPP_NUMBER, message);
    window.open(url, '_blank');
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Order - ${product.name}`}
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-emerald-950">
              Order Submitted!
            </h3>
            <p className="mt-3 max-w-sm text-sm text-emerald-700/70">
              Thank you! We have received your order enquiry and will contact you shortly with pricing and delivery details.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={onClose}
                className="rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
              >
                Close
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </button>
            </div>
          </motion.div>
        ) : (
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

            {/* Product Summary */}
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
              </div>
            </div>

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
                  Quantity *
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={formData.quantity}
                  onChange={(e) => updateField('quantity', parseInt(e.target.value) || 1)}
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all',
                    errors.quantity ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
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

            {/* Address */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <MapPin className="h-3.5 w-3.5" /> Delivery Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Full delivery address"
                rows={2}
                className={cn(
                  'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400 resize-none',
                  errors.address ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                )}
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="City"
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                    errors.city ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="State"
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                    errors.state ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <Hash className="h-3.5 w-3.5" /> PIN *
                </label>
                <input
                  type="text"
                  value={formData.pin_code}
                  onChange={(e) => updateField('pin_code', e.target.value)}
                  placeholder="PIN Code"
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                    errors.pin_code ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.pin_code && <p className="mt-1 text-xs text-red-500">{errors.pin_code}</p>}
              </div>
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

            {/* Submit Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Order Enquiry
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
        )}
      </AnimatePresence>
    </Modal>
  );
}
