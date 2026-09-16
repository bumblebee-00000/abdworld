import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Access Denied',
  description: 'You do not have permission to access this page.',
};

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-6">
      <div className="text-center">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <Lock className="h-10 w-10 text-emerald-700" />
        </div>
        <span className="block text-7xl font-bold text-emerald-200">403</span>
        <h1 className="mt-4 font-heading text-3xl font-bold text-emerald-950">
          Access Denied
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-emerald-700/70">
          You do not have permission to view this page. If you believe this is a
          mistake, please contact the business owner.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Home
        </Link>
        <div className="mt-12 text-6xl opacity-20">🌾</div>
      </div>
    </div>
  );
}