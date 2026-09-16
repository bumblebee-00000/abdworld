"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export type ModalSize = keyof typeof SIZE_CLASSES;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnBackdrop = true,
  showCloseButton = true,
  className,
}: ModalProps) {
  const [mounted] = useState(() => typeof window !== "undefined");

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="modal-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 z-[100] bg-emerald-950/70 backdrop-blur-sm"
          />
          <motion.div
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, x: "-50%", y: "calc(-50% + 32px)", scale: 0.96 }}
            animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: "-50%", y: "calc(-50% + 20px)", scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className={cx(
              "fixed left-1/2 top-1/2 z-[101] flex max-h-[88vh] w-11/12 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-emerald-950/30 ring-1 ring-white/60 sm:w-full",
              SIZE_CLASSES[size],
              className,
            )}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center gap-4 border-b border-cream-200 px-6 py-4 sm:px-7">
                <div className="min-w-0 flex-1">
                  {title ? (
                    <h2 className="font-heading text-xl font-bold leading-tight text-emerald-950">{title}</h2>
                  ) : null}
                  {description ? (
                    <p className="mt-1 text-sm leading-relaxed text-emerald-950/55">{description}</p>
                  ) : null}
                </div>
                {showCloseButton ? (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-100 text-emerald-900 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            )}
            <div className="overflow-y-auto px-6 py-5 sm:px-7 sm:py-6">{children}</div>
            <div className="h-1 shrink-0 gold-gradient" />
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default Modal;