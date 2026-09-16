'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react';
import type { Order, OrderStatus } from '@/types';

const statuses: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'contacted', label: 'Contacted', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-gold-100 text-gold-700 border-gold-200' },
  { value: 'processing', label: 'Processing', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        if (!ignore) setOrders(data.orders || []);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load orders');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    setUpdateError('');
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColor = (status: string) =>
    statuses.find((s) => s.value === status)?.color || 'bg-gray-100 text-gray-700 border-gray-200';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="mt-4 text-sm text-emerald-900/60">Loading orders...</p>
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
          Orders
        </h2>
        <p className="text-sm text-emerald-900/50 mt-1">
          {orders.length} total orders
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
            filter === 'all'
              ? 'bg-emerald-800 text-white border-emerald-800'
              : 'bg-white text-emerald-900/60 border-cream-300 hover:border-emerald-400'
          }`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              filter === s.value
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-emerald-900/60 border-cream-300 hover:border-emerald-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {updateError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{updateError}</p>
        </div>
      )}

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-50 text-left text-xs uppercase tracking-wider text-emerald-900/50">
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <ShoppingCart className="w-12 h-12 text-emerald-900/20 mx-auto mb-4" />
                    <p className="text-emerald-900/50">No orders found.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr
                      className="hover:bg-cream-50 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === order.id ? null : order.id)
                      }
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-emerald-950">
                          {order.customer_name}
                        </p>
                        <p className="text-xs text-emerald-900/40">
                          {order.phone}
                        </p>
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
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-900/50 whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        {expandedId === order.id ? (
                          <ChevronUp className="w-4 h-4 text-emerald-900/40" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-emerald-900/40" />
                        )}
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr className="bg-cream-50/50">
                        <td colSpan={6} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-900/50 mb-3">
                                Customer Details
                              </h4>
                              <ul className="space-y-2 text-sm text-emerald-900/70">
                                <li>
                                  <strong className="text-emerald-950">Name:</strong>{' '}
                                  {order.customer_name}
                                </li>
                                <li>
                                  <strong className="text-emerald-950">Phone:</strong>{' '}
                                  {order.phone}
                                </li>
                                {order.email && (
                                  <li>
                                    <strong className="text-emerald-950">Email:</strong>{' '}
                                    {order.email}
                                  </li>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-900/50 mb-3">
                                Delivery Details
                              </h4>
                              <ul className="space-y-2 text-sm text-emerald-900/70">
                                <li>{order.address}</li>
                                <li>
                                  {order.city}, {order.state} - {order.pin_code}
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-900/50 mb-3">
                                Order Details
                              </h4>
                              <ul className="space-y-2 text-sm text-emerald-900/70">
                                <li>
                                  <strong className="text-emerald-950">Product:</strong>{' '}
                                  {order.product_name} ({order.pack_size})
                                </li>
                                <li>
                                  <strong className="text-emerald-950">Quantity:</strong>{' '}
                                  {order.quantity}
                                </li>
                                {order.message && (
                                  <li>
                                    <strong className="text-emerald-950">Message:</strong>{' '}
                                    {order.message}
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-6 flex items-center gap-3">
                            <span className="text-sm font-semibold text-emerald-950">
                              Update Status:
                            </span>
                            <select
                              value={order.status}
                              disabled={updatingId === order.id}
                              onChange={(e) =>
                                handleStatusChange(
                                  order.id,
                                  e.target.value as OrderStatus
                                )
                              }
                              className="px-4 py-2.5 bg-white border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all disabled:opacity-60"
                            >
                              {statuses.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            {updatingId === order.id && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-pulse" />
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}