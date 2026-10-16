import { ArrowRight, Clock3 } from 'lucide-react';
import { formatExactPrice, formatPriceEffectiveAt } from '@/lib/utils';

interface UpcomingPriceNoticeProps {
  currentPrice: number | null;
  upcomingPrice: number;
  effectiveAt: string;
  compact?: boolean;
}

export default function UpcomingPriceNotice({
  currentPrice,
  upcomingPrice,
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
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="min-w-0">
          <span className="block text-xs text-amber-900/70">Order by</span>
          <strong className={`block truncate ${compact ? 'text-base' : 'text-lg'}`}>
            {currentPrice != null ? `${formatExactPrice(currentPrice)}/kg` : 'Contact for price'}
          </strong>
        </div>
        <ArrowRight className="h-4 w-4 text-amber-800" />
        <div className="min-w-0">
          <span className="block text-xs text-amber-900/70">
            From {formatPriceEffectiveAt(effectiveAt)}
          </span>
          <strong className={`block truncate ${compact ? 'text-base' : 'text-lg'}`}>
            {formatExactPrice(upcomingPrice)}/kg
          </strong>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-amber-950/80">
        {currentPrice != null
          ? 'Pay in full before the change to secure today\'s price. Delivery is confirmed separately.'
          : 'Contact us before the change to confirm availability and the current price.'}
      </p>
    </aside>
  );
}