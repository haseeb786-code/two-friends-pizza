'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Authentic 3D Tilted Revolving Pizza Hero
 * ──────────────────────────────────────────
 * - True 3D perspective pitch (~48° tilt) so toppings and thick crust are visible in 3D depth.
 * - Multi-axis floating wobble (rotateX, rotateY, rotateZ, and y-axis float) — NOT a flat clock spin.
 * - Continuous turntable rotation on the tilted 3D plane.
 * - Interactive cursor-driven 3D parallax on desktop.
 * - Realistic wafting steam plumes and heat shimmer rising from the hot crust.
 * - 60fps GPU transform-accelerated.
 */
export function RevolvingPizzaHero() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax springs (subtle 3D angle influence)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 90 };
  const mouseTiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const mouseTiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);

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
      className="relative w-full h-full flex items-center justify-center select-none py-6"
      style={{ perspective: 1200 }}
    >
      {/* ── Layer 1: Ambient Oven Hearth Glow / Warm Backlight ── */}
      <div
        className="absolute w-[320px] sm:w-[440px] lg:w-[560px] h-[320px] sm:h-[440px] lg:h-[560px] rounded-full bg-gradient-radial from-amber-500/20 via-flame-600/10 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Layer 2: 3D Tilting Stage with Interactive Cursor Parallax ── */}
      <motion.div
        style={
          prefersReducedMotion
            ? { transformStyle: 'preserve-3d' }
            : {
                rotateX: mouseTiltX,
                rotateY: mouseTiltY,
                transformStyle: 'preserve-3d',
              }
        }
        className="relative flex items-center justify-center"
      >
        {/* ── Layer 3: Multi-Axis Floating & Tilting Wobble (True 3D Float) ── */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [-14, 14, -14],
                  rotateX: [46, 52, 46],
                  rotateZ: [-12, -4, -12],
                  rotateY: [-6, 6, -6],
                }
          }
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative flex items-center justify-center"
        >
          {/* ── Layer 4: 3D Turntable Platter ── */}
          <div
            className="relative w-[240px] h-[240px] xs:w-[280px] xs:h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px] xl:w-[480px] xl:h-[480px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Turntable Revolution on the 3D Tilted Plane */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      rotate: 360,
                    }
              }
              transition={{
                duration: 42,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="relative w-full h-full rounded-full overflow-hidden shadow-2xl"
              style={{
                boxShadow:
                  '0 35px 70px -15px rgba(0, 0, 0, 0.98), 0 0 40px rgba(245, 158, 11, 0.2)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Authentic High-Resolution Real Pizza with Thick Golden Crust & Real Toppings */}
              <Image
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=90"
                alt="Two Friends Pizza Signature Hand-Crafted Pizza"
                fill
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 480px"
                className="object-cover rounded-full pointer-events-none scale-105"
              />

              {/* Dimensional Crust Rim with Golden Shading */}
              <div className="absolute inset-0 rounded-full border-[4px] sm:border-[6px] border-amber-600/40 pointer-events-none" />

              {/* High-Gloss Gourmet Olive Oil Glaze */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/45 via-transparent to-amber-300/15 pointer-events-none mix-blend-overlay"
                aria-hidden="true"
              />
            </motion.div>

            {/* Glowing Crust Accent Rim */}
            <div className="absolute -inset-1 rounded-full border border-amber-400/30 pointer-events-none blur-[1px]" />

            {/* ── Floating Visual Badges Alongside 3D Pizza ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.6 },
                y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute -top-3 -right-2 sm:-right-8 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-bold shadow-2xl pointer-events-none whitespace-nowrap"
            >
              <span className="text-amber-400">⚡</span>
              <span>Hot & Fresh in 25m · Free &lt;5km</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.2 },
                y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
              }}
              className="absolute -bottom-3 -left-2 sm:-left-8 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-bold shadow-2xl pointer-events-none whitespace-nowrap"
            >
              <span>🧀</span>
              <span>100% Real Mozzarella</span>
            </motion.div>

            {/* Floating Herb Leaf Accent */}
            <motion.div
              animate={{
                y: [-6, 8, -6],
                rotate: [-8, 8, -8],
              }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-1/3 -right-12 hidden lg:flex items-center justify-center text-2xl filter drop-shadow-xl pointer-events-none"
            >
              🌿
            </motion.div>

            {/* ── Realistic Rising Oven Steam & Heat Shimmer (Rising Vertically in 3D) ── */}
            {!prefersReducedMotion && (
              <div
                className="absolute inset-0 pointer-events-none overflow-visible z-20"
                aria-hidden="true"
              >
                {/* Heat shimmer haze */}
                <motion.div
                  animate={{
                    opacity: [0.15, 0.35, 0.15],
                    scaleY: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-20 inset-x-6 h-36 rounded-full bg-gradient-to-t from-amber-400/15 via-white/8 to-transparent blur-xl pointer-events-none mix-blend-screen"
                />

                {/* Staggered Rising Steam Plumes */}
                <SteamWisp x="30%" y="20%" delay={0} scale={1.1} duration={4.6} drift={-12} />
                <SteamWisp x="50%" y="15%" delay={1.1} scale={1.3} duration={5.0} drift={16} />
                <SteamWisp x="40%" y="30%" delay={2.2} scale={0.95} duration={4.2} drift={-8} />
                <SteamWisp x="65%" y="25%" delay={3.3} scale={1.2} duration={4.8} drift={14} />
                <SteamWisp x="45%" y="35%" delay={0.7} scale={1.4} duration={5.2} drift={-15} />
              </div>
            )}
          </div>

          {/* ── Atmospheric Floating Embers / Seasoning Specks ── */}
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

        {/* ── Layer 5: True 3D Ground Floor Shadow (Flat on Floor Plane) ── */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [0.88, 1.08, 0.88],
                  opacity: [0.5, 0.85, 0.5],
                }
          }
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transform: 'rotateX(75deg) translateY(70px)',
          }}
          className="absolute -bottom-8 w-[220px] xs:w-[260px] sm:w-[340px] lg:w-[420px] h-[55px] rounded-full bg-black/95 blur-2xl pointer-events-none"
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

/** Realistic wafting oven steam plume */
function SteamWisp({
  x,
  y,
  delay,
  scale = 1,
  duration = 5,
  drift = 0,
}: {
  x: string;
  y: string;
  delay: number;
  scale?: number;
  duration?: number;
  drift?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: scale * 0.6, x: 0 }}
      animate={{
        opacity: [0, 0.45, 0.35, 0],
        y: [0, -40, -100, -170],
        x: [0, drift * 0.4, drift, drift * 1.3],
        scale: [scale * 0.6, scale * 1.1, scale * 1.6, scale * 2.3],
        rotate: [0, drift > 0 ? 12 : -12],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
      style={{
        left: x,
        top: y,
        filter: 'blur(10px)',
      }}
      className="absolute w-16 h-24 rounded-[50%] bg-gradient-to-t from-white/25 via-amber-100/20 to-transparent pointer-events-none mix-blend-screen"
    />
  );
}
