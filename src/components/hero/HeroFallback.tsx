'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Static/video fallback for the 3D canvas.
 * Displayed when:
 *  - Browser does not support WebGL
 *  - Low-power mobile device
 *  - User has prefers-reduced-motion enabled
 *
 * ⚠️ ASSET REQUIRED:
 *  Provide a cinematic dark-background food photograph at /public/hero-fallback.jpg
 *  Minimum 2400 × 1350px, high-contrast, obsidian-dark environment
 *  Photography direction: overhead pizza shot, moody dramatic lighting,
 *  dark slate/stone surface, minimal garnish. Similar to high-end food editorial.
 *
 *  Optionally: a 4–6 second looping `.mp4` at /public/hero-fallback.mp4
 *  for a richer but still-accessible fallback experience.
 */
export function HeroFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full min-h-[380px] lg:min-h-[520px] relative overflow-hidden rounded-2xl"
      aria-hidden="true"
    >
      {/* Atmospheric radial gradient standing in for the food photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-amber-950/40" />

      {/* Subtle grid texture overlay — depth suggestion */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(245,158,11,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glowing orb — ember warmth centre */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-600/10 blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-flame-600/15 blur-[40px]" />

      {/* Placeholder label */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-1">
        <span className="text-xs uppercase tracking-widest text-amber-500/70 font-semibold">
          Visual Loading…
        </span>
        <span className="text-xs text-obsidian-500">
          Place hero-fallback.jpg in /public for production
        </span>
      </div>
    </motion.div>
  );
}
