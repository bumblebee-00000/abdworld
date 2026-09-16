'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  MessageCircle,
  Save,
} from 'lucide-react';
import type { SiteSettings } from '@/types';

type Errors = Record<string, string>;

export default function AdminSettingsPage() {
  const [values, setValues] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [adminRes, publicRes] = await Promise.all([
          fetch('/api/admin/settings'),
          fetch('/api/settings'),
        ]);

        if (!adminRes.ok && !publicRes.ok) {
          throw new Error('Failed to fetch settings');
        }

        const adminData = adminRes.ok ? await adminRes.json() : null;
        const publicData = publicRes.ok ? await publicRes.json() : null;

        const settings = adminData?.settings || publicData?.settings;
        if (settings) setValues(settings);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load settings'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!values) return;
    const { name, value } = e.target;
    setValues((prev) => (prev ? { ...prev, [name]: value } : prev));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save settings.');
        return;
      }

      setSuccess('Settings saved successfully.');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="mt-4 text-sm text-emerald-900/60">Loading settings...</p>
      </div>
    );
  }

  if (error && !values) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="mt-4 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!values) return null;

  const inputClass = (name: string) =>
    `w-full px-4 py-3 bg-cream-50 border ${
      errors[name]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-cream-300 focus:border-emerald-500 focus:ring-emerald-100'
    } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-emerald-950 font-[var(--font-heading)]">
            Site Settings
          </h2>
          <p className="text-sm text-emerald-900/50 mt-1">
            Manage your business information shown across the website.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-900/10"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {/* Business Info */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-950" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
            Business Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              value={values.business_name}
              onChange={handleChange}
              className={inputClass('business_name')}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Logo URL
            </label>
            <input
              type="text"
              name="logo_url"
              value={values.logo_url || ''}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className={inputClass('logo_url')}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-emerald-950 mb-2">
            About Content
          </label>
          <textarea
            name="about_content"
            value={values.about_content}
            onChange={handleChange}
            rows={4}
            className={`${inputClass('about_content')} resize-none`}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
            <Phone className="w-5 h-5 text-emerald-950" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
            Contact Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
              <input
                type="text"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="+91 99999 99999"
                className={`${inputClass('phone')} pl-11`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              WhatsApp Number
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
              <input
                type="text"
                name="whatsapp_number"
                value={values.whatsapp_number}
                onChange={handleChange}
                placeholder="919999999999"
                className={`${inputClass('whatsapp_number')} pl-11`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
              <input
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Business email address"
                className={`${inputClass('email')} pl-11`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Business Hours
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
              <input
                type="text"
                name="business_hours"
                value={values.business_hours}
                onChange={handleChange}
                placeholder="Mon - Sat: 9:00 AM - 6:00 PM"
                className={`${inputClass('business_hours')} pl-11`}
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-emerald-950 mb-2">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-900/40" />
            <input
              type="text"
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="Rice Market, Main Road"
              className={`${inputClass('address')} pl-11`}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={values.city}
              onChange={handleChange}
              placeholder="Your City"
              className={inputClass('city')}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              value={values.state}
              onChange={handleChange}
              placeholder="Your State"
              className={inputClass('state')}
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-950" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
            Social Media Links
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Facebook URL
            </label>
            <input
              type="text"
              name="facebook_url"
              value={values.facebook_url || ''}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
              className={inputClass('facebook_url')}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              Instagram URL
            </label>
            <input
              type="text"
              name="instagram_url"
              value={values.instagram_url || ''}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
              className={inputClass('instagram_url')}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-950 mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              name="youtube_url"
              value={values.youtube_url || ''}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className={inputClass('youtube_url')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-900/10"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save All Changes
        </button>
      </div>
    </form>
  );
}