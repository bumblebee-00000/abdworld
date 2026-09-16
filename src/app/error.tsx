'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-6">
      <div className="text-center">
        <div className="mb-6">
          <span className="block text-7xl font-bold text-emerald-200">500</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-emerald-950">
          Something Went Wrong
        </h1>
        <p className="mt-4 max-w-md text-base text-emerald-700/70">
          We encountered an unexpected error. Our team has been notified. 
          Please try again or contact us if the issue persists.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-800"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-xl border-2 border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-50"
          >
            Go Home
          </Link>
        </div>
        <div className="mt-12 text-6xl opacity-20">🌾</div>
      </div>
    </div>
  );
}
