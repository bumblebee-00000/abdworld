'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Loader2, AlertCircle, User, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { cn, generateWhatsAppUrl, isValidIndianMobileNumber, parsePackWeightKg } from '@/lib/utils';
import { normalizePhoneNumber, useSiteSettings } from '@/components/settings/SiteSettingsProvider';
import type { Product } from '@/types';

interface OrderFormProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  selectedPackSize?: string;
}

type FormStatus = 'idle' | 'loading' | 'error' | 'success';

interface FormData {
  pack_size: string;
  quantity: number;
  customer_name: string;
  phone: string;
  email: string;
  location: string;
  area: string;
  district: string;
  state: string;
  pin_code: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

interface PostalSuggestion {
  location?: string;
  block?: string;
  area?: string;
  district?: string;
  state?: string;
  pin_code?: string;
}

interface ReverseGeocodeResponse extends PostalSuggestion {
  error?: string;
  notice?: string;
}

type PostalField = 'location' | 'area' | 'district' | 'state' | 'pin_code';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
];

const initialFormData: FormData = {
  pack_size: '',
  quantity: 1,
  customer_name: '',
  phone: '',
  email: '',
  location: '',
  area: '',
  district: '',
  state: '',
  pin_code: '',
  message: '',
};

function getMinimumPackCount(minimumOrderKg: number, packSize: string): number | null {
  const packWeightKg = parsePackWeightKg(packSize);
  return packWeightKg ? Math.ceil(minimumOrderKg / packWeightKg) : null;
}

function PostalSuggestionList({
  field,
  suggestions,
  onSelect,
}: {
  field: PostalField;
  suggestions: PostalSuggestion[];
  onSelect: (suggestion: PostalSuggestion) => void;
}) {
  if (!suggestions.length) return null;

  return (
    <div role="listbox" className="absolute left-0 right-0 top-full z-50 mt-1 max-h-40 overflow-y-auto rounded-lg border border-cream-300 bg-white shadow-lg">
      {field === 'pin_code' && (
        <p className="sticky top-0 border-b border-cream-200 bg-cream-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
          {suggestions.length} postal locations for this PIN
        </p>
      )}
      {suggestions.map((suggestion, index) => {
        const title = field === 'pin_code'
          ? suggestion.area || suggestion.location || suggestion.pin_code || ''
          : suggestion[field] || suggestion.area || suggestion.location || '';
        const details = (field === 'state'
          ? [suggestion.district, suggestion.pin_code]
          : field === 'district'
            ? [suggestion.location, suggestion.state, suggestion.pin_code]
            : field === 'pin_code'
              ? [suggestion.block, suggestion.location, suggestion.district, suggestion.state, suggestion.pin_code]
              : field === 'location'
                ? [suggestion.area, suggestion.district, suggestion.state, suggestion.pin_code]
                : [suggestion.location, suggestion.district, suggestion.state, suggestion.pin_code]
        ).filter(Boolean).join(' · ');

        return (
          <button
            key={`${suggestion.pin_code ?? ''}-${suggestion.area ?? suggestion.state ?? index}`}
            type="button"
            role="option"
            aria-selected={false}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(suggestion)}
            className="block w-full border-b border-cream-100 px-3 py-2 text-left last:border-0 hover:bg-cream-50"
          >
            <span className="block text-xs font-semibold text-emerald-950">{title}</span>
            {details && <span className="block text-[11px] text-emerald-700/75">{details}</span>}
          </button>
        );
      })}
    </div>
  );
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
  if (!isValidIndianMobileNumber(data.phone)) errors.phone = 'Enter a valid Indian mobile number';
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email address';
  if (!data.location || data.location.trim().length < 2) errors.location = 'Enter your location';
  if (!data.area || data.area.trim().length < 2) errors.area = 'Enter your area';
  if (!data.district || data.district.trim().length < 2) errors.district = 'Enter your district';
  if (!data.state || data.state.trim().length < 2) errors.state = 'Enter your state';
  if (!/^\d{6}$/.test(data.pin_code)) errors.pin_code = 'Enter a valid 6-digit PIN code';

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState('');
  const [locationError, setLocationError] = useState('');
  const [activePostalField, setActivePostalField] = useState<PostalField | null>(null);
  const [postalSuggestions, setPostalSuggestions] = useState<PostalSuggestion[]>([]);
  const postalQuery = activePostalField ? formData[activePostalField] : '';
  const visiblePostalSuggestions = activePostalField === 'state'
    ? INDIAN_STATES
      .filter((state) => state.toLowerCase().includes(postalQuery.trim().toLowerCase()))
      .map((state) => ({ state }))
    : postalSuggestions;

  useEffect(() => {
    if (!activePostalField || activePostalField === 'state') return;

    const query = postalQuery.trim();
    if (activePostalField === 'pin_code' ? !/^\d{6}$/.test(query) : query.length < 3) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const searchParams = new URLSearchParams({ q: query, field: activePostalField });
        if (formData.state) {
          searchParams.set('state', formData.state);
        }
        if (activePostalField !== 'district' && formData.district) {
          searchParams.set('district', formData.district);
        }
        const response = await fetch(`/api/postal-lookup?${searchParams}`, { signal: controller.signal });
        if (!response.ok) return;

        const data: { suggestions?: PostalSuggestion[] } = await response.json();
        if (controller.signal.aborted) return;
        setPostalSuggestions(data.suggestions ?? []);
      } catch {
        if (!controller.signal.aborted) setPostalSuggestions([]);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [activePostalField, formData.district, formData.state, postalQuery]);

  const selectPostalSuggestion = (suggestion: PostalSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      location: suggestion.location ?? prev.location,
      area: suggestion.area ?? prev.area,
      district: suggestion.district ?? prev.district,
      state: suggestion.state ?? prev.state,
      pin_code: suggestion.pin_code ?? prev.pin_code,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.location;
      delete next.area;
      delete next.district;
      delete next.state;
      delete next.pin_code;
      return next;
    });
    setPostalSuggestions([]);
    setActivePostalField(null);
  };

  const useCurrentLocation = () => {
    setLocationError('');
    setLocationNotice('');

    if (!navigator.geolocation) {
      setLocationError('Location access is not available in this browser. Enter your address manually.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch('/api/location/reverse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });
          const data: ReverseGeocodeResponse = await response.json();
          if (!response.ok) throw new Error(data.error || 'Could not look up your current location.');

          setFormData((prev) => ({
            ...prev,
            location: data.location ?? '',
            area: data.area ?? '',
            district: data.district ?? '',
            state: data.state ?? '',
            pin_code: data.pin_code ?? '',
          }));
          setErrors((prev) => {
            const next = { ...prev };
            delete next.location;
            delete next.area;
            delete next.district;
            delete next.state;
            delete next.pin_code;
            return next;
          });
          setPostalSuggestions([]);
          setActivePostalField(null);
          setLocationNotice(data.notice || 'Address filled from your current location. Please confirm it before submitting.');
        } catch (error) {
          setLocationError(error instanceof Error ? error.message : 'Could not look up your current location.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        setLocationError(error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. Allow access or enter your address manually.'
          : 'Could not detect your location. Try again or enter your address manually.');
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 15000 }
    );
  };

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
    if (field === 'location' || field === 'area' || field === 'district' || field === 'state' || field === 'pin_code') {
      setPostalSuggestions([]);
    }
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
      const res = await fetch('/api/product-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.customer_name,
          phone: formData.phone,
          email: formData.email,
          location: formData.location,
          area: formData.area,
          district: formData.district,
          state: formData.state,
          pin_code: formData.pin_code,
          product_name: product.name,
          product_slug: product.slug,
          pack_size: formData.pack_size,
          quantity: formData.quantity,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const data: { error?: string; fieldErrors?: FormErrors } = await res.json();
        if (data.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send quote request');
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

    const message = [
      'Hello ABD WORLD, I would like a wholesale quote.',
      '',
      `Product: ${product.name}`,
      `Pack size: ${formData.pack_size}`,
      `Quantity: ${formData.quantity} packs`,
      formData.customer_name ? `Name: ${formData.customer_name}` : '',
      `Location: ${formData.location}`,
      `Area: ${formData.area}`,
      `District: ${formData.district}`,
      `State: ${formData.state}`,
      `PIN code: ${formData.pin_code}`,
      formData.message ? `Requirements: ${formData.message}` : '',
      '',
      'Please confirm wholesale pricing, availability, and delivery details.',
    ].filter(Boolean).join('\n');
    const url = generateWhatsAppUrl(normalizePhoneNumber(settings.whatsapp_number), message);
    window.open(url, '_blank');
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Request a quote - ${product.name}`}
    >
      {status === 'success' ? (
        <div className="py-8 text-center" role="status">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
          <h3 className="mt-4 font-heading text-xl font-bold text-emerald-950">
            Quote request received
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-emerald-800/75">
            Our team will confirm wholesale pricing, availability, and delivery details.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            Done
          </button>
        </div>
      ) : (
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
                <p className="text-xs text-emerald-700/70">Wholesale quote</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-emerald-800/70">
              Share your requirement and our team will confirm wholesale pricing and delivery details.
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
                  placeholder="10-digit mobile number"
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
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-700/25 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 disabled:cursor-wait disabled:opacity-60"
              >
                <MapPin className="h-4 w-4" />
                {isLocating ? 'Finding your address...' : 'Use my current location'}
              </button>
              <p className="mt-1 text-[10px] text-emerald-700/60">
                Address lookup by{' '}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  OpenStreetMap contributors
                </a>
              </p>
              {locationNotice && <p role="status" className="mt-1.5 text-xs text-emerald-700">{locationNotice}</p>}
              {locationError && <p role="alert" className="mt-1.5 text-xs text-red-600">{locationError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <MapPin className="h-3.5 w-3.5" /> Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  onFocus={() => {
                    setPostalSuggestions([]);
                    setActivePostalField('location');
                  }}
                  onBlur={() => setActivePostalField((active) => active === 'location' ? null : active)}
                  placeholder="City or town"
                  autoComplete="address-level2"
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                    errors.location ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                {activePostalField === 'location' && (
                  <PostalSuggestionList
                    field="location"
                    suggestions={visiblePostalSuggestions}
                    onSelect={selectPostalSuggestion}
                  />
                )}
              </div>
              <div className="relative">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <MapPin className="h-3.5 w-3.5" /> Area *
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => updateField('area', e.target.value)}
                  onFocus={() => {
                    setPostalSuggestions([]);
                    setActivePostalField('area');
                  }}
                  onBlur={() => setActivePostalField((active) => active === 'area' ? null : active)}
                  placeholder="Area or locality"
                  autoComplete="address-line2"
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                    errors.area ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.area && <p className="mt-1 text-xs text-red-500">{errors.area}</p>}
                {activePostalField === 'area' && (
                  <PostalSuggestionList
                    field="area"
                    suggestions={visiblePostalSuggestions}
                    onSelect={selectPostalSuggestion}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  District *
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  onFocus={() => {
                    setPostalSuggestions([]);
                    setActivePostalField('district');
                  }}
                  onBlur={() => setActivePostalField((active) => active === 'district' ? null : active)}
                  placeholder="District"
                  autoComplete="address-level3"
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                    errors.district ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                {activePostalField === 'district' && (
                  <PostalSuggestionList
                    field="district"
                    suggestions={visiblePostalSuggestions}
                    onSelect={selectPostalSuggestion}
                  />
                )}
              </div>
              <div className="relative">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  onFocus={() => {
                    setPostalSuggestions([]);
                    setActivePostalField('state');
                  }}
                  onBlur={() => setActivePostalField((active) => active === 'state' ? null : active)}
                  placeholder="State"
                  autoComplete="address-level1"
                  className={cn(
                    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                    errors.state ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                  )}
                />
                {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                {activePostalField === 'state' && (
                  <PostalSuggestionList
                    field="state"
                    suggestions={visiblePostalSuggestions}
                    onSelect={selectPostalSuggestion}
                  />
                )}
              </div>
            </div>

            <div className="relative">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <MapPin className="h-3.5 w-3.5" /> PIN Code *
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={formData.pin_code}
                onChange={(e) => updateField('pin_code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                onFocus={() => {
                  setPostalSuggestions([]);
                  setActivePostalField('pin_code');
                }}
                onBlur={() => setActivePostalField((active) => active === 'pin_code' ? null : active)}
                placeholder="6-digit PIN code"
                autoComplete="postal-code"
                className={cn(
                  'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition-all placeholder:text-cream-400',
                  errors.pin_code ? 'border-red-300 focus:border-red-500' : 'border-cream-300 focus:border-emerald-500'
                )}
              />
              {errors.pin_code && <p className="mt-1 text-xs text-red-500">{errors.pin_code}</p>}
              <p className="mt-1 text-xs text-emerald-700/70">
                Enter all 6 digits to see matching location suggestions.
              </p>
              {activePostalField === 'pin_code' && (
                <PostalSuggestionList
                  field="pin_code"
                  suggestions={visiblePostalSuggestions}
                  onSelect={selectPostalSuggestion}
                />
              )}
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
                    Sending quote request...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Request Quote
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
                Request Quote via WhatsApp
              </button>
            </div>
        </motion.form>
      </AnimatePresence>
      )}
    </Modal>
  );
}
