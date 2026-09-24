'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Premium Revolving Pizza Hero Presentation
 * ──────────────────────────────────────────
 * - Realistic high-resolution culinary pizza presentation.
 * - Suspended/floating in space with continuous, slow cinematic turntable rotation.
 * - Deep 3D perspective with realistic ground shadow and ember backlight.
 * - Smooth physics-based cursor parallax on desktop.
 * - Optimized for 60fps on mobile without WebGL battery drain or GPU overhead.
 */
export function RevolvingPizzaHero() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax springs (damped, subtle)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* ── Layer 1: Ambient Oven Glow / Warm Backlight ── */}
      <div
        className="absolute w-[300px] sm:w-[420px] lg:w-[520px] h-[300px] sm:h-[420px] lg:h-[520px] rounded-full bg-gradient-radial from-amber-500/15 via-flame-600/08 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Layer 2: Floating 3D Stage ── */}
      <motion.div
        style={prefersReducedMotion ? {} : { rotateX: rotateXSpring, rotateY: rotateYSpring }}
        className="relative flex items-center justify-center"
      >
        {/* Floating Vertical Bobbing Wrapper */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [-10, 10, -10],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative flex items-center justify-center"
        >
          {/* ── Layer 3: Realistic Pizza Platter / Crust Shadow ── */}
          <div className="relative w-[240px] h-[240px] xs:w-[280px] xs:h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[460px] lg:h-[460px] xl:w-[500px] xl:h-[500px]">

            {/* Slow Cinematic Continuous Turntable Rotation */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      rotate: 360,
                    }
              }
              transition={{
                duration: 48, // 48 seconds for a majestic, unhurried full revolution
                repeat: Infinity,
                ease: 'linear',
              }}
              className="relative w-full h-full rounded-full overflow-hidden shadow-2xl"
              style={{
                boxShadow:
                  '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(245, 158, 11, 0.15)',
              }}
            >
              {/* Realistic High-Resolution Pizza Presentation */}
              <Image
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=90"
                alt="Two Friends Pizza Signature Pizza"
                fill
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 500px"
                className="object-cover rounded-full pointer-events-none scale-105"
              />

              {/* Dimensional Crust Rim Shading */}
              <div className="absolute inset-0 rounded-full border-[3px] sm:border-[4px] border-amber-600/30 pointer-events-none" />

              {/* Subtle Gourmet Glaze Overlay */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/40 via-transparent to-amber-400/10 pointer-events-none mix-blend-overlay"
                aria-hidden="true"
              />
            </motion.div>

            {/* Outer Subtle Crust Glow Accent */}
            <div className="absolute -inset-1 rounded-full border border-amber-500/20 pointer-events-none blur-[1px]" />
          </div>

          {/* ── Layer 4: Atmospheric Floating Embers / Seasoning Specks ── */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              <EmberParticle x="-25%" y="-15%" delay={0} size={3} />
              <EmberParticle x="35%" y="-30%" delay={1.4} size={2.5} />
              <EmberParticle x="-40%" y="25%" delay={2.6} size={2} />
              <EmberParticle x="45%" y="20%" delay={0.8} size={3.5} />
              <EmberParticle x="10%" y="45%" delay={3.2} size={2} />
            </div>
          )}
        </motion.div>

        {/* ── Layer 5: Dynamic Ground Shadow (Breathes with floating motion) ── */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [0.92, 1.05, 0.92],
                  opacity: [0.45, 0.75, 0.45],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-10 sm:-bottom-14 w-[180px] xs:w-[220px] sm:w-[300px] lg:w-[380px] h-[36px] sm:h-[48px] rounded-full bg-black/80 blur-xl pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}

/** Micro ember speck drifting gently */
function EmberParticle({
  x,
  y,
  delay,
  size,
}: {
  x: string;
  y: string;
  delay: number;
  size: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        y: [-10, -40],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
      style={{ left: `calc(50% + ${x})`, top: `calc(50% + ${y})`, width: size, height: size }}
      className="absolute rounded-full bg-amber-400/70 shadow-sm shadow-amber-400 pointer-events-none"
    />
  );
}
