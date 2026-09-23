import { Variants } from 'framer-motion';
import { primitiveTokens } from '@/styles/tokens';

const { durations, easings } = primitiveTokens.motion;

/**
 * 1. Page Transition Variants
 * Smooth, subtle opacity with minimal vertical drift (no disorienting jumps)
 */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.smooth,
      ease: easings.cinematic,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: durations.quick,
      ease: easings.hover,
    },
  },
};

/**
 * 2. Section Reveal on Viewport
 * Weighty, grounded entrance for headlines and content sections
 */
export const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.cinematic,
      ease: easings.reveal,
    },
  },
};

/**
 * 3. Staggered Container for Lists / Grids
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * 4. Product Card Hover Interaction
 * Controlled micro-lift with subtle scale, avoiding aggressive bouncing
 */
export const productCardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.base,
      ease: easings.cinematic,
    },
  },
  hover: {
    y: -4,
    scale: 1.015,
    transition: {
      duration: durations.quick,
      ease: easings.hover,
    },
  },
};

/**
 * 5. Cart Drawer & Sidebar Slide-in
 */
export const cartDrawerVariants: Variants = {
  closed: {
    x: '100%',
    transition: {
      duration: durations.base,
      ease: easings.hover,
    },
  },
  open: {
    x: 0,
    transition: {
      duration: durations.smooth,
      ease: easings.cinematic,
    },
  },
};

/**
 * 6. Modal / Dialog Scale Fade
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.base,
      ease: easings.cinematic,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: durations.quick,
      ease: easings.hover,
    },
  },
};

/**
 * 7. Micro-Interactions (Buttons & Interactive Icons)
 */
export const buttonTapVariants: Variants = {
  tap: { scale: 0.97 },
  hover: { scale: 1.02 },
};

/**
 * Accessibility Helper:
 * Fallback to pure opacity transition when user prefers reduced motion
 */
export function getAccessibleVariant(
  normalVariant: Variants,
  prefersReducedMotion: boolean
): Variants {
  if (!prefersReducedMotion) return normalVariant;

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    hover: {},
    tap: {},
  };
}
