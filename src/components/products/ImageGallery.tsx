'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  mainImage?: string;
  alt: string;
}

export default function ImageGallery({ images, mainImage, alt }: ImageGalleryProps) {
  const allImages = mainImage ? [mainImage, ...images.filter((i) => i !== mainImage)] : images;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const hasImages = allImages.length > 0;

  useEffect(() => {
    if (allImages.length < 2 || isPaused || isFullscreen || isZoomed) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % allImages.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [allImages.length, isFullscreen, isPaused, isZoomed]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setIsZoomed(false);
  };

  const goPrev = () => goTo(activeIndex === 0 ? allImages.length - 1 : activeIndex - 1);
  const goNext = () => goTo(activeIndex === allImages.length - 1 ? 0 : activeIndex + 1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  if (!hasImages) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-cream-100 border border-cream-200">
        <div className="text-center">
          <span className="block text-7xl opacity-40 mb-3">🌾</span>
          <p className="text-sm text-cream-500 font-medium">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="group relative overflow-hidden rounded-2xl border border-cream-200 bg-cream-100"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="relative aspect-square cursor-pointer overflow-hidden"
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={allImages[activeIndex]}
              alt={`${alt} - Image ${activeIndex + 1}`}
              className="h-full w-full object-cover"
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      transform: 'scale(2)',
                      cursor: 'zoom-out',
                    }
                  : { cursor: 'zoom-in' }
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              loading="lazy"
            />
          </AnimatePresence>

          {/* Zoom Hint */}
          <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-emerald-950/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-3.5 w-3.5" />
            {isZoomed ? 'Move to pan' : 'Click to zoom'}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(true);
            }}
            className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950/60 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-emerald-950/80"
            aria-label="View fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-950 shadow-lg opacity-0 transition-all group-hover:opacity-100 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-950 shadow-lg opacity-0 transition-all group-hover:opacity-100 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-950/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={cn(
                'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                index === activeIndex
                  ? 'border-emerald-600 shadow-md'
                  : 'border-cream-200 opacity-60 hover:border-emerald-400 hover:opacity-100'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${alt} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close fullscreen"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <motion.img
              key={activeIndex}
              src={allImages[activeIndex]}
              alt={`${alt} - Fullscreen ${activeIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />

            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              {activeIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
