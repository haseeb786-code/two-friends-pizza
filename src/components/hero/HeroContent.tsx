'use client';

import React, { useRef } from 'react';
import { ShoppingBag, ChevronDown, Flame, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  pageTransitionVariants,
  sectionRevealVariants,
  staggerContainerVariants,
} from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroContentProps {
  onOrderClick?: () => void;
}

/**
 * Hero Typography & CTA Content Layer
 * Sits in the left/center column — always above the 3D canvas z-index
 * so the CTA is never obscured by visual effects.
 */
export function HeroContent({ onOrderClick }: HeroContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Parallax scroll hook — text drifts up slightly as user scrolls down
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, prefersReducedMotion ? 0 : -40]);

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : staggerContainerVariants;

  const revealVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : sectionRevealVariants;

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="relative z-10 flex flex-col justify-center h-full max-w-[560px] px-6 md:px-0 py-16"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Status Pill */}
        <motion.div variants={revealVariants}>
          <Badge variant="flame" className="flex items-center gap-1.5 w-fit">
            <Flame className="w-3 h-3" aria-hidden="true" />
            <span>Wood-Fired · Flame-Grilled</span>
          </Badge>
        </motion.div>

        {/* Primary Headline — strong hierarchy */}
        <motion.div variants={revealVariants} className="space-y-1">
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight text-white">
            Two Friends.
            <br />
            <span className="text-amber-400">
              One Fire.
            </span>
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          variants={revealVariants}
          className="text-base sm:text-lg text-obsidian-300 max-w-[400px] leading-relaxed"
        >
          Artisanal wood-fired pizzas and flame-grilled gourmet burgers. Handcrafted. Never compromised.
        </motion.p>

        {/* Social proof micro-copy */}
        <motion.div
          variants={revealVariants}
          className="flex items-center gap-2 text-sm text-obsidian-400"
        >
          <div className="flex" aria-label="Rated 5 stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            ))}
          </div>
          <span>Loved by the neighbourhood</span>
        </motion.div>

        {/* CTA Row — clearly separated, never obscured */}
        <motion.div
          variants={revealVariants}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2"
        >
          <Button
            variant="primary"
            size="lg"
            leftIcon={<ShoppingBag className="w-5 h-5" />}
            onClick={onOrderClick}
            className="min-w-[160px] text-base font-semibold"
            aria-label="Order Now — opens menu"
          >
            Order Now
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-obsidian-300 hover:text-white text-sm"
          >
            View Menu
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — bottom of hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-6 md:left-0 flex items-center gap-2 text-xs text-obsidian-500"
        aria-hidden="true"
      >
        <ChevronDown className="w-4 h-4 animate-bounce" />
        <span>Scroll to explore</span>
      </motion.div>
    </motion.div>
  );
}
