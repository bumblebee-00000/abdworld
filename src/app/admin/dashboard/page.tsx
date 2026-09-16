'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Inbox,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface Stats {
  total_products: number;
  active_products: number;
  new_orders: number;
  new_enquiries: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  product_name: string;
  pack_size: string;
  quantity: number;
  status: string;
  created_at: string;
}

interface RecentEnquiry {
  id: string;
  name: string;
  business_name?: string;
  subject?: string;
  type: 'wholesale' | 'contact';
  status: string;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function statusBadgeClass(status: string) {
  const classes: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-violet-100 text-violet-700 border-violet-200',
    confirmed: 'bg-gold-100 text-gold-700 border-gold-200',
    processing: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };
  return classes[status] || 'bg-gray-100 text-gray-700 border-gray-200';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [enquiries, setEnquiries] = useState<RecentEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [statsRes, ordersRes, enquiriesRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/orders?limit=5'),
          fetch('/api/admin/enquiries?limit=5'),
        ]);

        if (!statsRes.ok || !ordersRes.ok || !enquiriesRes.ok) {
          throw new Error('Failed to load dashboard data');
        }

        const [statsData, ordersData, enquiriesData] = await Promise.all([
          statsRes.json(),
          ordersRes.json(),
          enquiriesRes.json(),
        ]);

        if (!ignore) {
          setStats(statsData);
          setOrders(ordersData.orders || []);
          setEnquiries([
            ...(enquiriesData.wholesale || []).map((enquiry: RecentEnquiry) => ({
              ...enquiry,
              type: 'wholesale' as const,
            })),
            ...(enquiriesData.contact || []).map((enquiry: RecentEnquiry) => ({
              ...enquiry,
              type: 'contact' as const,
            })),
          ].sort((first, second) =>
            new Date(second.created_at).getTime() - new Date(first.created_at).getTime()
          ).slice(0, 5));
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : 'Failed to load dashboard data'
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="mt-4 text-sm text-emerald-900/60">Loading dashboard...</p>
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

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.total_products ?? 0,
      icon: Package,
      color: 'text-emerald-600 bg-emerald-100',
      href: '/admin/products',
    },
    {
      label: 'New Orders',
      value: stats?.new_orders ?? 0,
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-100',
      href: '/admin/orders',
    },
    {
      label: 'New Enquiries',
      value: stats?.new_enquiries ?? 0,
      icon: Inbox,
      color: 'text-gold-600 bg-gold-100',
      href: '/admin/enquiries',
    },
    {
      label: 'Active Products',
      value: stats?.active_products ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-100',
      href: '/admin/products',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group bg-white rounded-2xl border border-cream-200 p-6 hover:border-gold-400 hover:shadow-lg hover:shadow-gold-500/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-900/30 group-hover:text-gold-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="text-3xl font-bold text-emerald-950 font-[var(--font-heading)]">
              {card.value}
            </p>
            <p className="text-sm text-emerald-900/50 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-cream-200">
          <div>
            <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
              Recent Orders
            </h3>
            <p className="text-sm text-emerald-900/50">Latest 5 orders</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-50 text-left text-xs uppercase tracking-wider text-emerald-900/50">
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Qty</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-emerald-900/50">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-emerald-950">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 text-emerald-900/70">
                      {order.product_name}
                      <span className="block text-xs text-emerald-900/40">
                        {order.pack_size}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-900/70">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-900/50">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent enquiries */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-cream-200">
          <div>
            <h3 className="text-lg font-bold text-emerald-950 font-[var(--font-heading)]">
              Recent Enquiries
            </h3>
            <p className="text-sm text-emerald-900/50">Latest 5 enquiries</p>
          </div>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-50 text-left text-xs uppercase tracking-wider text-emerald-900/50">
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Detail</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-emerald-900/50">
                    No enquiries yet.
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-emerald-950">
                      {enquiry.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-100 text-emerald-700 capitalize">
                        {enquiry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-900/70">
                      {enquiry.business_name || enquiry.subject || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(
                          enquiry.status
                        )}`}
                      >
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-900/50">
                      {formatDate(enquiry.created_at)}
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