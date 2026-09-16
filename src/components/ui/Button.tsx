"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

type MotionButtonProps = HTMLMotionProps<"button">;
type MotionAnchorProps = HTMLMotionProps<"a">;

export interface ButtonProps extends MotionButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
}

const BASE_CLASSES =
  "relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-semibold tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-700 text-white shadow-lg shadow-emerald-900/25 hover:bg-emerald-600 focus-visible:ring-emerald-600",
  secondary:
    "gold-gradient text-emerald-950 shadow-lg shadow-gold-500/30 hover:brightness-105 focus-visible:ring-gold-500",
  outline:
    "border border-emerald-700/30 bg-white/70 text-emerald-900 hover:border-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-600",
  ghost: "bg-transparent text-emerald-900 hover:bg-emerald-100/70 focus-visible:ring-emerald-600",
  whatsapp:
    "bg-[#25d366] text-white shadow-lg shadow-green-600/40 hover:bg-[#1ebe5d] focus-visible:ring-green-600",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-4 text-xs",
  md: "h-11 gap-2 px-6 text-sm",
  lg: "h-14 gap-2.5 px-8 text-base",
};

const ICON_SIZE: Record<ButtonSize, number> = {
  sm: 15,
  md: 18,
  lg: 20,
};

const SHINY_VARIANTS: ButtonVariant[] = ["primary", "secondary", "whatsapp"];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  href,
  target,
  rel,
  className,
  children,
  whileHover,
  whileTap,
  transition,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const hasShine = SHINY_VARIANTS.includes(variant);

  const motionProps = isDisabled
    ? {}
    : {
        whileHover: whileHover ?? { y: -2, scale: 1.02 },
        whileTap: whileTap ?? { scale: 0.97 },
        transition:
          transition ??
          ({ type: "spring", stiffness: 420, damping: 26 } as const),
      };

  const classes = cx(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    hasShine && "group",
    className,
  );

  const content = (
    <>
      {hasShine && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-[160%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[160%]"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-[inherit]">
        {loading ? <Loader2 size={ICON_SIZE[size]} className="animate-spin" aria-hidden="true" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={classes}
        {...motionProps}
        {...(rest as MotionAnchorProps)}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={rest.type ?? "button"}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
      {...motionProps}
      {...rest}
    >
      {content}
    </motion.button>
  );
}

export default Button;