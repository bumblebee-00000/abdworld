import { Clock3 } from 'lucide-react';
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
  return (
    <aside
      className={`rounded-lg border border-amber-300 bg-amber-50 text-amber-950 ${compact ? 'p-3' : 'p-4'}`}
      aria-label="Upcoming retail price change"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-900">
        <Clock3 className="h-4 w-4 shrink-0" />
        Retail price changes soon
      </div>
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