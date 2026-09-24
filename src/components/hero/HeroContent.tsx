'use client';

import React, { useRef } from 'react';
import { ShoppingBag, ChevronDown, Sparkles, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  sectionRevealVariants,
  staggerContainerVariants,
} from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BUSINESS_CONFIG } from '@/config/business';

interface HeroContentProps {
  onOrderClick?: () => void;
}

/**
 * Hero Typography & CTA Content Layer
 * Tailored 100% to Two Friends Pizza — "Dosti Ka Slice"
 * No unwanted artisanal/wood-fired fluff — pure fast-food excellence.
 */
export function HeroContent({ onOrderClick }: HeroContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, prefersReducedMotion ? 0 : -40]);

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : staggerContainerVariants;

  const revealVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : sectionRevealVariants;

  const handleOrderClick = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      const menuEl = document.getElementById('menu');
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
        {/* Brand Tagline Badge */}
        <motion.div variants={revealVariants}>
          <Badge variant="flame" className="flex items-center gap-1.5 w-fit text-xs font-semibold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Two Friends Pizza · Dosti Ka Slice</span>
          </Badge>
        </motion.div>

        {/* Primary Headline */}
        <motion.div variants={revealVariants} className="space-y-1">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white">
            Fresh, Tasty,
            <br />
            <span className="text-amber-400">
              Always.
            </span>
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          variants={revealVariants}
          className="text-sm sm:text-base text-obsidian-300 max-w-[420px] leading-relaxed"
        >
          Signature loaded pizzas, crispy zinger burgers, stuffed shawarmas, and sizzling combo deals in Rawat. Friends · Food · Good Times.
        </motion.p>

        {/* Location / Social Proof */}
        <motion.div
          variants={revealVariants}
          className="flex items-center gap-2 text-xs sm:text-sm text-obsidian-400"
        >
          <div className="flex" aria-label="5 star rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            ))}
          </div>
          <span>Best Fast Food on Main Chak Belli Road, Rawat</span>
        </motion.div>

        {/* CTA Row */}
        <motion.div
          variants={revealVariants}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2"
        >
          <Button
            variant="primary"
            size="lg"
            leftIcon={<ShoppingBag className="w-5 h-5" />}
            onClick={handleOrderClick}
            className="min-w-[160px] text-sm sm:text-base font-semibold shadow-lg shadow-flame-900/30"
            aria-label="Order Now — scroll to menu"
          >
            Order Now
          </Button>
          <a
            href="#menu"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-white/10 text-obsidian-300 hover:text-white hover:border-white/20 text-sm font-medium transition-colors"
          >
            View Menu
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-6 md:left-0 flex items-center gap-2 text-xs text-obsidian-500"
        aria-hidden="true"
      >
        <ChevronDown className="w-4 h-4 animate-bounce" />
        <span>Explore Menu</span>
      </motion.div>
    </motion.div>
  );
}
