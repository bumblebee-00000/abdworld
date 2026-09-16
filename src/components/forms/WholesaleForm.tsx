'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Package,
  Scale,
  FileText,
} from 'lucide-react';
import { wholesaleSchema } from '@/lib/validation';
import { generateWhatsAppUrl } from '@/lib/utils';

type Errors = Record<string, string>;

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
const BUSINESS_EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'abdworldinfo@gmail.com';

interface WholesaleFormValues {
  name: string;
  business_name: string;
  phone: string;
  email: string;
  location: string;
  rice_requirement: string;
  approximate_quantity: string;
  message: string;
}

const initialValues: WholesaleFormValues = {
  name: '',
  business_name: '',
  phone: '',
  email: '',
  location: 'West Bengal, Barasat',
  rice_requirement: '',
  approximate_quantity: '',
  message: '',
};

export default function WholesaleForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const result = wholesaleSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Errors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      'Hello ABD World Rice, I would like to make a wholesale enquiry.',
      '',
      `Name: ${values.name}`,
      `Business: ${values.business_name}`,
      `Phone: ${values.phone}`,
      values.email ? `Email: ${values.email}` : '',
      `Location: ${values.location}`,
      `Rice Requirement: ${values.rice_requirement}`,
      `Approximate Quantity: ${values.approximate_quantity}`,
      values.message ? `Message: ${values.message}` : '',
      '',
      'Please get back to me with pricing details.',
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus('idle');
    setServerError('');

    try {
      const res = await fetch('/api/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setServerError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setValues(initialValues);
    } catch {
      setStatus('error');
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full pl-11 pr-4 py-3 bg-cream-50 border ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-cream-300 focus:border-emerald-500 focus:ring-emerald-100'
    } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all`;

  return (
    <div className="bg-white rounded-2xl border border-cream-200 shadow-xl shadow-emerald-900/5 p-6 md:p-8">
      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-950 font-[var(--font-heading)] mb-3">
            Enquiry Submitted Successfully!
          </h3>
          <p className="text-emerald-900/80 mb-8 max-w-md mx-auto">
            Thank you for your interest. Our wholesale team will contact you
            within 24 hours with pricing and availability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={generateWhatsAppUrl(
                WHATSAPP_NUMBER,
                buildWhatsAppMessage()
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Send via WhatsApp for Faster Response
            </a>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-3 border border-cream-300 text-emerald-900 font-semibold rounded-xl hover:bg-cream-50 transition-colors"
            >
              Submit Another Enquiry
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClass(!!errors.name)}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
                <input
                  type="text"
                  name="business_name"
                  value={values.business_name}
                  onChange={handleChange}
                  placeholder="Your Business Pvt Ltd"
                  className={inputClass(!!errors.business_name)}
                />
              </div>
              {errors.business_name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.business_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={inputClass(!!errors.phone)}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="you@business.com"
                  className={inputClass(!!errors.email)}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-2">
                Location / City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
                <input
                  type="text"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  placeholder="West Bengal, Barasat"
                  className={inputClass(!!errors.location)}
                />
              </div>
              {errors.location && (
                <p className="mt-1.5 text-xs text-red-500">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-2">
                Approximate Quantity in Tons <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
                <input
                  type="text"
                  name="approximate_quantity"
                  value={values.approximate_quantity}
                  onChange={handleChange}
                  placeholder="e.g. 5 tons / month"
                  className={inputClass(!!errors.approximate_quantity)}
                />
              </div>
              {errors.approximate_quantity && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.approximate_quantity}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Rice Requirement <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
              <input
                type="text"
                name="rice_requirement"
                value={values.rice_requirement}
                onChange={handleChange}
                placeholder="e.g. Premium Basmati, Golden Sella, Sonamasuri..."
                className={inputClass(!!errors.rice_requirement)}
              />
            </div>
            {errors.rice_requirement && (
              <p className="mt-1.5 text-xs text-red-500">{errors.rice_requirement}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Message (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-emerald-900/40" />
              <textarea
                name="message"
                value={values.message}
                onChange={handleChange}
                placeholder="Tell us more about your requirements..."
                rows={4}
                className={`${inputClass(false)} resize-none`}
              />
            </div>
            {errors.message && (
              <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
            )}
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-900/10"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Enquiry...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Wholesale Enquiry
              </>
            )}
          </button>

          <p className="text-xs text-center text-emerald-900/50">
            By submitting, you agree to be contacted by our sales team regarding
            your enquiry.
          </p>
        </form>
      )}
    </div>
  );
}