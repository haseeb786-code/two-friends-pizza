'use client';

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { HeroContent } from './HeroContent';
import { HeroFallback } from './HeroFallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Lazy-load the entire 3D canvas — keeps initial JS bundle zero-3D-overhead.
 * HeroScene, R3F, Three.js, and Drei are never included in the first paint bundle.
 */
const Dynamic3DCanvas = dynamic(
  () => import('@/components/three/Dynamic3DCanvas').then((m) => ({ default: m.Dynamic3DCanvas })),
  { ssr: false, loading: () => <HeroFallback /> }
);

const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then((m) => ({ default: m.HeroScene })),
  { ssr: false }
);

/**
 * Root Hero Section
 * ─────────────────
 * Layout strategy:
 *  - Desktop (lg+): 2-column split — left text / right 3D canvas
 *  - Tablet (md): 1-column stacked — text above, 3D below (reduced)
 *  - Mobile (sm-): 1-column stacked — text above, 3D scene simplified/particles removed
 *
 * Z-index strategy:
 *  Canvas: z-0
 *  Vignette overlay: z-[1]
 *  Content: z-10
 *  CTA buttons: z-20
 *
 * Ensures the CTA is NEVER visually obscured by 3D canvas, particles, or gradients.
 */
export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle background parallax on scroll — only on desktop non-reduced-motion
  const { scrollY } = useScroll({ target: sectionRef });
  const bgY = useTransform(
    scrollY,
    [0, 600],
    [0, prefersReducedMotion ? 0 : 30]
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-canvas flex flex-col"
      aria-label="Hero section — Two Friends Pizza"
    >
      {/* ── Atmospheric background layer ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Deep obsidian base */}
        <div className="absolute inset-0 bg-canvas" />

        {/* Warm ember glow — positioned upper-right quadrant for cinematic depth */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-amber-900/25 blur-[120px]" />

        {/* Subtle flame bloom near left center */}
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] rounded-full bg-flame-900/20 blur-[100px]" />

        {/* Faint bottom fill to ground the scene */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
      </motion.div>

      {/* ── Main content grid ── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 xl:px-16">

        {/* Left column — typography and CTA (always on top, z-20 on mobile overlay) */}
        <div className="relative z-20 flex items-center justify-start order-2 lg:order-1">
          <HeroContent />
        </div>

        {/* Right column — 3D canvas */}
        <div
          className="relative z-0 order-1 lg:order-2 flex items-center justify-center w-full"
          aria-hidden="true"
        >
          {/* Mobile: canvas sits above text, capped height, reduced complexity */}
          <div className="w-full h-[300px] sm:h-[380px] lg:h-[580px] xl:h-[640px] mt-16 lg:mt-0">
            <Dynamic3DCanvas
              className="w-full h-full"
              cameraPosition={[0, 1.2, 4.5]}
              cameraFov={42}
              shadows
              fallback={<HeroFallback />}
            >
              <HeroScene mobile={false} />
            </Dynamic3DCanvas>
          </div>
        </div>
      </div>
    </section>
  );
}
