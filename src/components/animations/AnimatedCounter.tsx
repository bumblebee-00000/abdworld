"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export interface AnimatedCounterProps {
  value?: number;
  target?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({
  value,
  target,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  className,
}: AnimatedCounterProps) {
  const finalValue = value ?? target ?? 0;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(reduceMotion ? finalValue : 0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, finalValue, {
      duration: reduceMotion ? 0 : duration,
      ease: "easeOut",
      onUpdate: (latest) => setCurrent(latest),
    });

    return () => controls.stop();
  }, [inView, finalValue, duration, reduceMotion]);

  const display = format
    ? format(current)
    : decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString("en-IN");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;