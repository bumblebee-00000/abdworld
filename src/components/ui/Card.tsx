"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  image?: {
    src: string;
    alt: string;
  };
  hover?: boolean;
  padded?: boolean;
  bodyClassName?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({
  children,
  image,
  hover = true,
  padded = true,
  bodyClassName,
  className,
  whileHover,
  style,
  ...rest
}: CardProps) {
  const liftVariants = hover
    ? {
        whileHover: whileHover ?? { y: -8 },
        transition: { type: "spring", stiffness: 260, damping: 22 } as const,
      }
    : {};

  return (
    <motion.div
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-md shadow-lg shadow-emerald-950/5",
        hover &&
          "transition-[box-shadow,border-color] duration-300 will-change-transform hover:border-gold-300/60 hover:shadow-2xl hover:shadow-emerald-950/10",
        className,
      )}
      style={style as CSSProperties}
      {...liftVariants}
      {...rest}
    >
      {image ? (
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-emerald-950/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />
        </div>
      ) : null}
      <div className={cx("flex flex-1 flex-col", padded && "p-6", bodyClassName)}>{children}</div>
    </motion.div>
  );
}

export default Card;