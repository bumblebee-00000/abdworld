'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';


interface ProductVideoProps {
  videoUrl: string;
  posterImage?: string;
  productName: string;
}

export default function ProductVideo({ videoUrl, posterImage, productName }: ProductVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-emerald-950 mb-6">
        Product <span className="text-gradient">Video</span>
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative overflow-hidden rounded-2xl bg-emerald-950 shadow-xl"
      >
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterImage}
            muted={isMuted}
            playsInline
            preload="metadata"
            onLoadedData={() => setIsLoaded(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover"
          />

          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-950">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-cream-200 border-t-gold-400" />
            </div>
          )}

          {/* Play Button Overlay */}
          {!isPlaying && isLoaded && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-emerald-950/30 transition-colors hover:bg-emerald-950/40"
              aria-label={`Play ${productName} video`}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-400 shadow-2xl shadow-gold-400/30 transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-1 h-8 w-8 text-emerald-950" fill="currentColor" />
              </div>
            </motion.button>
          )}

          {/* Controls */}
          {isLoaded && (
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-emerald-950/80 to-transparent px-5 py-4 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" fill="currentColor" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
