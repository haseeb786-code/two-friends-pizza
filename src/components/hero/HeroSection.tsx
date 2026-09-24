'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { HeroContent } from './HeroContent';
import { RevolvingPizzaHero } from './RevolvingPizzaHero';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Root Hero Section
 * ─────────────────
 * Layout strategy:
 *  - Desktop (lg+): 2-column split — left typography / right realistic revolving pizza
 *  - Tablet (md): 1-column stacked — realistic pizza with centered perspective
 *  - Mobile (sm-): 1-column stacked — scaled appropriately, never overlaps headline/buttons
 *
 * Z-index strategy:
 *  Background aura: z-0
 *  Pizza visual: z-10
 *  Typography & CTA buttons: z-20
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
      className="relative w-full min-h-[90vh] lg:min-h-screen overflow-hidden bg-canvas flex flex-col justify-center"
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

        {/* Warm ember glow — upper right quadrant */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-amber-900/25 blur-[120px]" />

        {/* Subtle flame bloom */}
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] rounded-full bg-flame-900/20 blur-[100px]" />

        {/* Faint bottom fill to ground the scene */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
      </motion.div>

      {/* ── Main content grid ── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 items-center py-6 sm:py-12">

        {/* Left column — typography and CTA (always accessible, z-20) */}
        <div className="relative z-20 flex items-center justify-start order-2 lg:order-1">
          <HeroContent />
        </div>

        {/* Right column — Realistic Revolving Pizza Presentation */}
        <div
          className="relative z-10 order-1 lg:order-2 flex items-center justify-center w-full"
          aria-hidden="true"
        >
          <div className="w-full h-[280px] xs:h-[320px] sm:h-[400px] lg:h-[540px] xl:h-[600px] flex items-center justify-center">
            <RevolvingPizzaHero />
          </div>
        </div>
      </div>
    </section>
  );
}
