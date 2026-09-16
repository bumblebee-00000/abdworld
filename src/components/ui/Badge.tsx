import type { ReactNode } from "react";

export type BadgeVariant = "emerald" | "gold" | "cream" | "outline" | "danger" | "neutral";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  emerald: "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  gold: "bg-gold-100 text-gold-700 ring-1 ring-inset ring-gold-300",
  cream: "bg-cream-200/70 text-emerald-950 ring-1 ring-inset ring-cream-300",
  outline: "border border-emerald-700/25 bg-transparent text-emerald-800",
  danger: "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200",
  neutral: "bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-200",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "gap-1 px-2 py-0.5 text-[10px]",
  md: "gap-1.5 px-3 py-1 text-xs",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Badge({
  children,
  variant = "emerald",
  size = "md",
  icon,
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center whitespace-nowrap rounded-full font-semibold uppercase tracking-wider",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {dot ? <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" /> : null}
      {icon ? <span aria-hidden="true" className="shrink-0">{icon}</span> : null}
      {children}
    </span>
  );
}

export default Badge;