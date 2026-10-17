'use client';

import { Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatExactPrice } from '@/lib/utils';

interface UpcomingPriceNoticeProps {
  upcomingWholesalePrice?: number | null;
  effectiveAt: string;
  compact?: boolean;
}

export default function UpcomingPriceNotice({
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
      className={`rounded-lg border border-gold-300 bg-cream-50 text-emerald-950 ${compact ? 'p-3' : 'p-4'}`}
      aria-label="Upcoming price update"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-950">
        <Clock3 className="h-4 w-4 shrink-0 text-highlight-600" />
        Wholesale price update
      </div>
      <p className="mt-1 text-xs leading-relaxed text-emerald-900/75">
        Order before the timer ends to secure today&apos;s wholesale price.
      </p>
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
      {upcomingWholesalePrice != null && (
        <div className="mt-3 rounded-md border border-gold-200 bg-white/80 p-2.5">
          <p className="text-[10px] font-semibold uppercase text-emerald-700/70">
            New wholesale price
          </p>
          <p className="mt-1 text-sm font-bold text-emerald-950">
            {formatExactPrice(upcomingWholesalePrice)}
            <span className="ml-1 text-xs font-medium text-emerald-700/70">/kg</span>
          </p>
        </div>
      )}
    </aside>
  );
}