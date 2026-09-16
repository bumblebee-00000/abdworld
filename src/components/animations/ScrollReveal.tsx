"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export type ScrollRevealDirection = "up" | "down" | "left" | "right" | "none";

export interface ScrollRevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  direction?: ScrollRevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const OFFSETS: Record<Exclude<ScrollRevealDirection, "none">, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 48,
  once = true,
  className,
  ...rest
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const axis = OFFSETS[direction === "none" ? "up" : direction];

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: axis.x * distance, y: axis.y * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;