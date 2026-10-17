'use client';

import { Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatExactPrice, formatPriceEffectiveAt } from '@/lib/utils';

interface UpcomingPriceNoticeProps {
  currentPrice: number | null;
  upcomingPrice?: number | null;
  currentWholesalePrice: number | null;
  upcomingWholesalePrice?: number | null;
  effectiveAt: string;
  compact?: boolean;
}

export default function UpcomingPriceNotice({
  currentPrice,
  upcomingPrice,
  currentWholesalePrice,
  upcomingWholesalePrice,
  effectiveAt,
  compact = false,
}: UpcomingPriceNoticeProps) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const effectiveTime = Date.parse(effectiveAt);
    if (!Number.isFinite(effectiveTime)) return;

    const updateRemainingTime = () => {
      setRemainingMs(Math.max(0, effectiveTime - Date.now()));
    };

    updateRemainingTime();
    const interval = window.setInterval(updateRemainingTime, 1000);
    return () => window.clearInterval(interval);
  }, [effectiveAt]);

  const remainingSeconds = remainingMs == null ? null : Math.floor(remainingMs / 1000);
  const remainingDays = remainingSeconds == null ? 0 : Math.floor(remainingSeconds / 86400);
  const remainingHours = remainingSeconds == null ? 0 : Math.floor((remainingSeconds % 86400) / 3600);
  const remainingMinutes = remainingSeconds == null ? 0 : Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds == null ? 0 : remainingSeconds % 60;

  return (
    <aside
      className={`rounded-lg border border-amber-300 bg-amber-50 text-amber-950 ${compact ? 'p-3' : 'p-4'}`}
      aria-label="Upcoming retail price change"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-900">
        <Clock3 className="h-4 w-4 shrink-0" />
        Retail price changes soon
      </div>
      {remainingMs != null && (
        <div
          role="timer"
          aria-label={`${remainingDays} days, ${remainingHours} hours, ${remainingMinutes} minutes, ${seconds} seconds`}
          className="mt-3 grid grid-cols-4 divide-x divide-emerald-700 rounded-md border border-emerald-800 bg-emerald-950 px-1 py-2.5 text-center"
        >
          {[['days', remainingDays], ['hours', remainingHours], ['mins', remainingMinutes], ['secs', seconds]].map(([unit, value]) => (
            <div key={unit} className="min-w-0 px-1">
              <span className="block font-mono text-xl font-bold leading-none tabular-nums text-gold-300">
                {String(value).padStart(2, '0')}
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase text-emerald-100/75">
                {unit}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 grid grid-cols-[auto_1fr_1fr] items-baseline gap-x-3 gap-y-1.5">
        <span />
        <span className="text-xs font-semibold text-amber-900/70">Now</span>
        <span className="text-xs font-semibold text-amber-900/70">
          From {formatPriceEffectiveAt(effectiveAt)}
        </span>
        {upcomingPrice != null && (
          <>
            <span className="text-xs text-amber-900/70">Retail</span>
            <strong className={`truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {currentPrice != null ? formatExactPrice(currentPrice) : 'On request'}
            </strong>
            <strong className={`truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {formatExactPrice(upcomingPrice)}
            </strong>
          </>
        )}
        {upcomingWholesalePrice != null && (
          <>
            <span className="text-xs text-amber-900/70">Wholesale</span>
            <strong className={`truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {currentWholesalePrice != null ? formatExactPrice(currentWholesalePrice) : 'On request'}
            </strong>
            <strong className={`truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {formatExactPrice(upcomingWholesalePrice)}
            </strong>
          </>
        )}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-amber-950/80">
        {upcomingPrice != null && currentPrice != null
          ? 'Pay in full before the retail change to secure today\'s price. Delivery is confirmed separately.'
          : 'Contact us before the change to confirm availability and pricing.'}
      </p>
    </aside>
  );
}