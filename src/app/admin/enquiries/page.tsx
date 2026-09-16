'use client';

import React, { useEffect, useState } from 'react';
import {
  Loader2,
  AlertCircle,
  Inbox,
  Building2,
  Package,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  FileText,
  Scale,
} from 'lucide-react';
import type { OrderStatus } from '@/types';

type EnquiryType = 'wholesale' | 'contact';

interface WholesaleEnquiryData {
  id: string;
  type: 'wholesale';
  name: string;
  business_name: string;
  phone: string;
  email: string | null;
  location: string;
  rice_requirement: string;
  approximate_quantity: string;
  message: string | null;
  status: OrderStatus;
  created_at: string;
}

interface ContactEnquiryData {
  id: string;
  type: 'contact';
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  message: string;
  status: OrderStatus;
  created_at: string;
}

type Enquiry = WholesaleEnquiryData | ContactEnquiryData;

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'contacted', label: 'Contacted', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-gold-100 text-gold-700 border-gold-200' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminEnquiriesPage() {
  const [tab, setTab] = useState<EnquiryType>('wholesale');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/enquiries');
        if (!res.ok) throw new Error('Failed to fetch enquiries');
        const data = await res.json();
        const all: Enquiry[] = [];
        (data.wholesale || []).forEach((w: Omit<WholesaleEnquiryData, 'type'>) =>
          all.push({ ...w, type: 'wholesale' })
        );
        (data.contact || []).forEach((c: Omit<ContactEnquiryData, 'type'>) =>
          all.push({ ...c, type: 'contact' })
        );
        all.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        if (!ignore) setEnquiries(all);
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : 'Failed to load enquiries'
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = enquiries.filter((e) => e.type === tab);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    setUpdateError('');
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: tab, status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : 'Failed to update status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColor = (status: string) =>
    statusOptions.find((s) => s.value === status)?.color ||
    'bg-gray-100 text-gray-700 border-gray-200';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="mt-4 text-sm text-emerald-900/60">Loading enquiries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="mt-4 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-950 font-[var(--font-heading)]">
          Enquiries
        </h2>
        <p className="text-sm text-emerald-900/50 mt-1">
          {enquiries.length} total enquiries
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cream-200">
        <button
          onClick={() => setTab('wholesale')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            tab === 'wholesale'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-emerald-900/50 hover:text-emerald-700'
          }`}
        >
          Wholesale
          <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">
            {enquiries.filter((e) => e.type === 'wholesale').length}
          </span>
        </button>
        <button
          onClick={() => setTab('contact')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            tab === 'contact'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-emerald-900/50 hover:text-emerald-700'
          }`}
        >
          Contact
          <span className="ml-2 px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 text-xs">
            {enquiries.filter((e) => e.type === 'contact').length}
          </span>
        </button>
      </div>

      {updateError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{updateError}</p>
        </div>
      )}

      {/* Enquiries list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-cream-200 p-16 text-center">
            <Inbox className="w-12 h-12 text-emerald-900/20 mx-auto mb-4" />
            <p className="text-emerald-900/50">No {tab} enquiries yet.</p>
          </div>
        ) : (
          filtered.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-white rounded-2xl border border-cream-200 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === enquiry.id ? null : enquiry.id)
                }
                className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 text-left hover:bg-cream-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    {enquiry.type === 'wholesale' ? (
                      <Building2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Mail className="w-5 h-5 text-gold-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-950">
                      {enquiry.name}
                    </p>
                    <p className="text-xs text-emerald-900/40">
                      {enquiry.type === 'wholesale'
                        ? (enquiry as WholesaleEnquiryData).business_name
                        : (enquiry as ContactEnquiryData).subject}
                      {' • '}
                      {formatDate(enquiry.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(enquiry.status)}`}
                  >
                    {enquiry.status.charAt(0).toUpperCase() +
                      enquiry.status.slice(1)}
                  </span>
                  <span className="text-xs text-emerald-900/40">
                    {expandedId === enquiry.id ? 'Hide' : 'View'}
                  </span>
                </div>
              </button>

              {expandedId === enquiry.id && (
                <div className="border-t border-cream-200 p-6 bg-cream-50/50">
                  {enquiry.type === 'wholesale' ? (
                    <WholesaleDetails
                      enquiry={enquiry as WholesaleEnquiryData}
                    />
                  ) : (
                    <ContactDetails enquiry={enquiry as ContactEnquiryData} />
                  )}

                  <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className="text-sm font-semibold text-emerald-950">
                      Update Status:
                    </span>
                    <select
                      value={enquiry.status}
                      disabled={updatingId === enquiry.id}
                      onChange={(e) =>
                        handleStatusChange(
                          enquiry.id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="px-4 py-2.5 bg-white border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all disabled:opacity-60"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {updatingId === enquiry.id && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-pulse" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function WholesaleDetails({
  enquiry,
}: {
  enquiry: WholesaleEnquiryData;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-emerald-900/70">
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong className="text-emerald-950">Business:</strong>{' '}
          {enquiry.business_name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong className="text-emerald-950">Phone:</strong> {enquiry.phone}
        </span>
      </div>
      {enquiry.email && (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-emerald-950">Email:</strong> {enquiry.email}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong className="text-emerald-950">Location:</strong>{' '}
          {enquiry.location}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong className="text-emerald-950">Rice Requirement:</strong>{' '}
          {enquiry.rice_requirement}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong className="text-emerald-950">Approx Quantity:</strong>{' '}
          {enquiry.approximate_quantity}
        </span>
      </div>
      {enquiry.message && (
        <div className="md:col-span-2 flex items-start gap-2">
          <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong className="text-emerald-950">Message:</strong>{' '}
            {enquiry.message}
          </span>
        </div>
      )}
    </div>
  );
}

function ContactDetails({ enquiry }: { enquiry: ContactEnquiryData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-emerald-900/70">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong className="text-emerald-950">Phone:</strong> {enquiry.phone}
        </span>
      </div>
      {enquiry.email && (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-emerald-950">Email:</strong> {enquiry.email}
          </span>
        </div>
      )}
      <div className="md:col-span-2 flex items-start gap-2">
        <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          <strong className="text-emerald-950">Message:</strong>{' '}
          {enquiry.message}
        </span>
      </div>
    </div>
  );
}