"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

export type GrainIntensity = "low" | "medium" | "high";

export interface RiceGrainParticlesProps {
  className?: string;
  intensity?: GrainIntensity;
}

interface Grain {
  left: number;
  top: number;
  width: number;
  duration: number;
  delay: number;
  opacity: number;
  rotateA: number;
  rotateB: number;
  sway: number;
  rise: number;
}

const COUNTS: Record<GrainIntensity, { desktop: number; mobile: number }> = {
  low: { desktop: 12, mobile: 5 },
  medium: { desktop: 26, mobile: 10 },
  high: { desktop: 40, mobile: 16 },
};

const MOBILE_MEDIA_QUERY = "(min-width: 768px)";

const GRAIN_KEYFRAMES = `
@keyframes awr-grain-float {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(var(--awr-rotate-a, -10deg));
    opacity: var(--awr-opacity, 0.22);
  }
  50% {
    transform: translate3d(var(--awr-sway, 8px), var(--awr-rise, -34px), 0) rotate(var(--awr-rotate-b, 14deg));
    opacity: 0.55;
  }
}
`;

function mulberry32(seed: number) {
  let value = seed;
  return function next(): number {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGrains(count: number): Grain[] {
  const rand = mulberry32(0xabd2026);
  return Array.from({ length: count }, () => {
    const width = 18 + rand() * 30;
    return {
      left: rand() * 100,
      top: 10 + rand() * 78,
      width,
      duration: 9 + rand() * 11,
      delay: -rand() * 18,
      opacity: 0.15 + rand() * 0.28,
      rotateA: -18 + rand() * 36,
      rotateB: -18 + rand() * 36,
      sway: (rand() - 0.5) * 28,
      rise: 20 + rand() * 30,
    };
  });
}

export function RiceGrainParticles({ className, intensity = "medium" }: RiceGrainParticlesProps) {
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const count = COUNTS[intensity][isDesktop ? "desktop" : "mobile"];
  const grains = useMemo(() => buildGrains(count), [count]);

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={"pointer-events-none absolute inset-0 overflow-hidden " + (className ?? "")}
    >
      <style>{GRAIN_KEYFRAMES}</style>
      {grains.map((grain, index) => {
        const style = {
          left: `${grain.left}%`,
          top: `${grain.top}%`,
          width: `${grain.width}px`,
          height: `${(grain.width * 0.4).toFixed(1)}px`,
          background:
            "radial-gradient(circle at 35% 30%, rgba(253, 248, 240, 0.9), rgba(212, 196, 152, 0.18))",
          boxShadow: "0 1px 3px rgba(2, 44, 34, 0.08)",
          borderRadius: "50%",
          animation: `awr-grain-float ${grain.duration.toFixed(2)}s ease-in-out ${grain.delay.toFixed(
            2,
          )}s infinite`,
          "--awr-rotate-a": `${grain.rotateA.toFixed(1)}deg`,
          "--awr-rotate-b": `${grain.rotateB.toFixed(1)}deg`,
          "--awr-sway": `${grain.sway.toFixed(1)}px`,
          "--awr-rise": `${grain.rise.toFixed(1)}px`,
          "--awr-opacity": grain.opacity,
        } as CSSProperties;
        return <span key={index} className="absolute will-change-transform" style={style} />;
      })}
    </div>
  );
}

export default RiceGrainParticles;