"use client";

import { motion, useReducedMotion } from "framer-motion";

const SPARKS = [
  { x: -30, y: -24 },
  { x: 30, y: -24 },
  { x: -34, y: 10 },
  { x: 34, y: 10 },
  { x: -18, y: 32 },
  { x: 18, y: 32 },
];

export default function SuccessMark({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 ${className}`}
      aria-hidden="true"
    >
      {!reduceMotion && SPARKS.map((spark, index) => (
        <motion.span
          key={`${spark.x}-${spark.y}`}
          className="success-mark-spark"
          style={{ backgroundColor: index % 2 === 0 ? "#eab308" : "#059669" }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{ x: spark.x, y: spark.y, opacity: [0, 1, 0], scale: [0, 1, 0.4] }}
          transition={{ delay: 0.18, duration: 0.55, ease: "easeOut" }}
        />
      ))}
      <motion.svg
        viewBox="0 0 64 64"
        className="relative h-full w-full p-4 text-emerald-600"
        fill="none"
        aria-hidden="true"
        initial={reduceMotion ? false : { scale: 0.72, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      >
        <motion.circle
          cx="32"
          cy="32"
          r="27"
          stroke="currentColor"
          strokeWidth="4"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
        <motion.path
          d="m20 33 8 8 17-19"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.28, duration: 0.38, ease: "easeOut" }}
        />
      </motion.svg>
    </div>
  );
}