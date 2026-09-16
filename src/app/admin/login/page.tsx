'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Wheat,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            (res.status === 429
              ? 'Too many login attempts. Please wait 15 minutes and try again.'
              : 'Invalid credentials. Please try again.')
        );
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen premium-gradient relative overflow-hidden flex items-center justify-center">
      <Wheat className="absolute -top-24 -right-24 w-96 h-96 text-gold-500/10 pointer-events-none" />
      <Wheat className="absolute -bottom-24 -left-24 w-80 h-80 text-white/5 pointer-events-none rotate-45" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #facc15 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cream-100/60 hover:text-gold-400 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>

        <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mb-5">
              <Wheat className="w-8 h-8 text-emerald-950" />
            </div>
            <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">
              Admin Login
            </h1>
            <p className="text-sm text-cream-100/80 mt-2 font-medium">
              ABD WORLD Management Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-cream-100 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-100/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.08] border border-white/20 rounded-xl text-sm text-white placeholder:text-cream-100/40 focus:outline-none focus:border-gold-400/80 focus:ring-4 focus:ring-gold-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cream-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-100/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-white/[0.08] border border-white/20 rounded-xl text-sm text-white placeholder:text-cream-100/40 focus:outline-none focus:border-gold-400/80 focus:ring-4 focus:ring-gold-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-100/40 hover:text-gold-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 gold-gradient text-emerald-950 font-bold rounded-xl hover:shadow-lg hover:shadow-gold-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-cream-100/40">
            Authorized personnel only. All login attempts are monitored.
          </p>
        </div>
      </div>
    </div>
  );
}