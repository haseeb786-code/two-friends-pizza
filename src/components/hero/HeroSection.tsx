'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useScroll, useTransform, motion } from 'framer-motion';
import { HeroContent } from './HeroContent';
import { RevolvingPizzaHero } from './RevolvingPizzaHero';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Root Hero Section with Authentic Pizzeria Evening Atmosphere
 * ─────────────────────────────────────────────────────────────
 * Layout strategy:
 *  - Desktop (lg+): 2-column split — left typography / right 3D revolving pizza
 *  - Tablet (md): 1-column stacked — realistic pizza with centered perspective
 *  - Mobile (sm-): 1-column stacked — scaled appropriately, never overlaps headline/buttons
 *
 * Rich Background Atmosphere:
 *  - High-resolution warm pizzeria oven ambience with evening string-light bokeh.
 *  - Atmospheric radial warmth and dark obsidian vignettes.
 *  - 100% text readability and WCAG AAA contrast preserved.
 */
export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle background parallax on scroll
  const { scrollY } = useScroll({ target: sectionRef });
  const bgY = useTransform(
    scrollY,
    [0, 600],
    [0, prefersReducedMotion ? 0 : 35]
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[92vh] lg:min-h-screen overflow-hidden bg-canvas flex flex-col justify-center"
      aria-label="Hero section — Two Friends Pizza"
    >
      {/* ── Atmospheric Pizzeria Evening Background Layer ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Deep obsidian base */}
        <div className="absolute inset-0 bg-canvas" />

        {/* Authentic Pizzeria Oven & Dining Evening Ambience Image */}
        <div className="absolute inset-0 opacity-[0.12] mix-blend-luminosity">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter blur-[1.5px]"
          />
        </div>

        {/* Warm hearth ember glow — upper right quadrant */}
        <div className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-gradient-radial from-amber-500/20 via-flame-700/10 to-transparent blur-[130px]" />

        {/* Subtle flame bloom — left mid quadrant */}
        <div className="absolute top-[35%] left-[-10%] w-[480px] h-[480px] rounded-full bg-gradient-radial from-flame-600/15 via-amber-900/10 to-transparent blur-[110px]" />

        {/* Bottom gradient mask for seamless transition into trust pillars */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-obsidian-950 via-obsidian-950/70 to-transparent" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-canvas via-canvas/60 to-transparent" />
      </motion.div>

      {/* ── Main content grid ── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 items-center py-8 sm:py-14">

        {/* Left column — typography and CTA (always accessible, z-20) */}
        <div className="relative z-20 flex items-center justify-start order-2 lg:order-1">
          <HeroContent />
        </div>

        {/* Right column — 3D Revolving Tilted Pizza Presentation */}
        <div
          className="relative z-10 order-1 lg:order-2 flex items-center justify-center w-full"
          aria-hidden="true"
        >
          <div className="w-full h-[320px] xs:h-[360px] sm:h-[420px] lg:h-[560px] xl:h-[620px] flex items-center justify-center">
            <RevolvingPizzaHero />
          </div>
        </div>
      </div>
    </section>
  );
}
