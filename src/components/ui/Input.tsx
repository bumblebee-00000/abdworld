"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { CircleAlert, ChevronDown } from "lucide-react";

const FIELD_BASE =
  "w-full rounded-xl border bg-white/90 px-4 py-2.5 text-sm text-emerald-950 shadow-sm transition-all duration-200 placeholder:text-cream-500/70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

function fieldColors(hasError: boolean): string {
  return hasError
    ? "border-red-400 hover:border-red-400 focus:border-red-500 focus:ring-red-500/15"
    : "border-cream-300 hover:border-cream-400 focus:border-emerald-600 focus:ring-emerald-500/15";
}

const LABEL_CLASSES =
  "mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900/80";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface FieldShellProps {
  label?: string;
  id: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function FieldShell({ label, id, optional, error, hint, children }: FieldShellProps) {
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className={LABEL_CLASSES}>
          <span>{label}</span>
          {optional ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cream-500">Optional</span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
          <CircleAlert size={13} aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-cream-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    optional,
    leftIcon,
    rightIcon,
    containerClassName,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <FieldShell label={label} id={id} optional={optional} error={error} hint={hint}>
      <div className={cx("relative", containerClassName)}>
        {leftIcon ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-500"
          >
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            FIELD_BASE,
            fieldColors(Boolean(error)),
            Boolean(leftIcon) && "pl-11",
            Boolean(rightIcon) && "pr-11",
            className,
          )}
          {...rest}
        />
        {rightIcon ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-500"
          >
            {rightIcon}
          </span>
        ) : null}
      </div>
    </FieldShell>
  );
});
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, optional, className, id: idProp, rows = 5, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <FieldShell label={label} id={id} optional={optional} error={error} hint={hint}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cx(
          FIELD_BASE,
          fieldColors(Boolean(error)),
          "resize-none leading-relaxed py-3",
          className,
        )}
        {...rest}
      />
    </FieldShell>
  );
});
Textarea.displayName = "Textarea";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, optional, className, id: idProp, children, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <FieldShell label={label} id={id} optional={optional} error={error} hint={hint}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            FIELD_BASE,
            fieldColors(Boolean(error)),
            "appearance-none pr-11 cursor-pointer",
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cream-500"
        />
      </div>
    </FieldShell>
  );
});
Select.displayName = "Select";