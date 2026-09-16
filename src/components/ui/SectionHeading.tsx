import type { ReactNode } from "react";
import { Wheat } from "lucide-react";

export type SectionHeadingAlign = "center" | "left";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: SectionHeadingAlign;
  decorative?: boolean;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  decorative = true,
  className,
  eyebrowClassName,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cx("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <span
          className={cx(
            "inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold-600",
            eyebrowClassName,
          )}
        >
          {centered ? <span aria-hidden="true" className="h-px w-8 bg-gold-500/70" /> : null}
          {eyebrow}
          <span aria-hidden="true" className="h-px w-8 bg-gold-500/70" />
        </span>
      ) : null}
      <h2
        className={cx(
          "mt-3 font-heading text-3xl leading-tight font-bold text-emerald-950 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cx(
            "mt-4 text-base leading-relaxed text-emerald-950/60",
            centered && "mx-auto",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      ) : null}
      {decorative ? (
        <div className={cx("mt-6 flex items-center gap-2", centered && "justify-center")}>
          <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/80" />
          <Wheat size={16} aria-hidden="true" className="text-gold-600" />
          <span aria-hidden="true" className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/80" />
        </div>
      ) : null}
    </div>
  );
}

export default SectionHeading;