/**
 * Two Friends Pizza - Unified Cinematic Design Tokens
 * 
 * Single Source of Truth architecture:
 * Primitive Tokens -> Semantic Tokens -> Component Tokens
 * 
 * Cinematic Dark-Immersive Food Direction:
 * High contrast obsidian surfaces, wood-fired ember gold, rich flame accents,
 * and elegant editorial typography with zero clutter or gratuitous blur.
 */

// =============================================================================
// 1. PRIMITIVE TOKENS
// =============================================================================

export const primitiveTokens = {
  colors: {
    // Obsidian & Deep Neutrals
    obsidian: {
      950: '#070707', // Deepest background canvas
      900: '#0e0e0e', // Surface layer 1
      850: '#141414', // Surface layer 2 (cards, dialogs)
      800: '#1c1c1c', // Elevated surfaces / hover cards
      700: '#2a2a2a', // Subtle borders & dividers
      600: '#404040', // Muted borders
      500: '#666666', // Low emphasis text
      400: '#949494', // Secondary text
      300: '#b8b8b8', // Body readable
      200: '#dedede', // High readable
      100: '#f0f0f0', // Crisp highlights
      50: '#ffffff',  // Pure white
    },
    // Flame & Searing Accents (Culinary Red)
    flame: {
      900: '#450a0a',
      800: '#7f1d1d',
      700: '#991b1b',
      600: '#dc2626',
      500: '#ef4444',
      400: '#f87171',
    },
    // Wood-Fired Embers (Crust Gold & Warm Glow)
    amber: {
      900: '#451a03',
      800: '#78350f',
      700: '#b45309',
      600: '#d97706',
      500: '#f59e0b',
      400: '#fbbf24',
      300: '#fde68a',
    },
    // Fresh Ingredient Accents
    basil: {
      600: '#15803d',
      500: '#22c55e',
      400: '#4ade80',
    },
  },

  typography: {
    fontFamilies: {
      heading: 'var(--font-heading, "Playfair Display", Georgia, serif)',
      body: 'var(--font-sans, "Plus Jakarta Sans", system-ui, -apple-system, sans-serif)',
      mono: 'var(--font-mono, "JetBrains Mono", monospace)',
    },
    fontSizes: {
      '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
      xs: ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.04em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
      '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
      '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
      '7xl': ['4.5rem', { lineHeight: '1.02', letterSpacing: '-0.05em' }],
    },
    fontWeights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
  },

  spacing: {
    0: '0px',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',      // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',      // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
  },

  radii: {
    none: '0px',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },

  shadows: {
    ambient: '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
    rimLight: '0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 32px -4px rgba(0, 0, 0, 0.8)',
    glowGold: '0 0 24px -4px rgba(245, 158, 11, 0.25)',
    glowFlame: '0 0 24px -4px rgba(220, 38, 38, 0.25)',
    elevationHigh: '0 20px 48px -12px rgba(0, 0, 0, 0.95)',
  },

  motion: {
    durations: {
      instant: 0.1,    // 100ms
      quick: 0.2,      // 200ms
      base: 0.35,      // 350ms
      smooth: 0.6,     // 600ms
      cinematic: 0.9,  // 900ms
      slow: 1.4,       // 1400ms
    },
    easings: {
      cinematic: [0.16, 1, 0.3, 1],   // Deceleration with premium weight
      reveal: [0.22, 1, 0.36, 1],
      hover: [0.4, 0, 0.2, 1],
      springSmooth: { type: 'spring', damping: 25, stiffness: 200 },
      springSnappy: { type: 'spring', damping: 20, stiffness: 350 },
    },
  },

  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// =============================================================================
// 2. SEMANTIC TOKENS
// =============================================================================

export const semanticTokens = {
  background: {
    canvas: primitiveTokens.colors.obsidian[950],
    surface: primitiveTokens.colors.obsidian[900],
    surfaceElevated: primitiveTokens.colors.obsidian[850],
    surfaceOverlay: 'rgba(10, 10, 10, 0.85)',
    surfaceSubtle: primitiveTokens.colors.obsidian[800],
    accentWarm: 'rgba(245, 158, 11, 0.08)',
    accentFlame: 'rgba(220, 38, 38, 0.08)',
  },

  text: {
    primary: primitiveTokens.colors.obsidian[50],
    secondary: primitiveTokens.colors.obsidian[300],
    muted: primitiveTokens.colors.obsidian[500],
    accent: primitiveTokens.colors.amber[400],
    flame: primitiveTokens.colors.flame[500],
    inverse: primitiveTokens.colors.obsidian[950],
  },

  border: {
    subtle: 'rgba(255, 255, 255, 0.07)',
    medium: 'rgba(255, 255, 255, 0.14)',
    accent: 'rgba(245, 158, 11, 0.4)',
    flame: 'rgba(220, 38, 38, 0.4)',
  },

  action: {
    primary: {
      bg: primitiveTokens.colors.flame[600],
      hover: primitiveTokens.colors.flame[500],
      active: primitiveTokens.colors.flame[700],
      text: primitiveTokens.colors.obsidian[50],
      border: 'transparent',
    },
    secondary: {
      bg: 'rgba(255, 255, 255, 0.05)',
      hover: 'rgba(255, 255, 255, 0.10)',
      active: 'rgba(255, 255, 255, 0.15)',
      text: primitiveTokens.colors.obsidian[100],
      border: 'rgba(255, 255, 255, 0.12)',
    },
    gold: {
      bg: primitiveTokens.colors.amber[500],
      hover: primitiveTokens.colors.amber[400],
      active: primitiveTokens.colors.amber[600],
      text: primitiveTokens.colors.obsidian[950],
      border: 'transparent',
    },
    disabled: {
      bg: primitiveTokens.colors.obsidian[800],
      text: primitiveTokens.colors.obsidian[600],
      border: 'transparent',
    },
  },

  state: {
    focusRing: `0 0 0 2px ${primitiveTokens.colors.obsidian[950]}, 0 0 0 4px ${primitiveTokens.colors.amber[500]}`,
    hoverLift: 'translateY(-2px)',
    activePress: 'scale(0.98)',
  },
} as const;

// =============================================================================
// 3. COMPONENT TOKENS
// =============================================================================

export const componentTokens = {
  header: {
    height: '4.5rem',
    background: 'rgba(7, 7, 7, 0.85)',
    borderBottom: semanticTokens.border.subtle,
    backdropBlur: '12px',
  },
  card: {
    background: semanticTokens.background.surface,
    backgroundHover: semanticTokens.background.surfaceElevated,
    borderRadius: primitiveTokens.radii.xl,
    border: semanticTokens.border.subtle,
    borderHover: semanticTokens.border.medium,
    shadow: primitiveTokens.shadows.ambient,
    padding: primitiveTokens.spacing[6],
  },
  badge: {
    borderRadius: primitiveTokens.radii.full,
    padding: '0.25rem 0.75rem',
    fontSize: primitiveTokens.typography.fontSizes.xs[0],
    fontWeight: primitiveTokens.typography.fontWeights.semibold,
  },
  cartDrawer: {
    width: '420px',
    background: semanticTokens.background.surfaceElevated,
    borderLeft: semanticTokens.border.medium,
    shadow: primitiveTokens.shadows.elevationHigh,
  },
  modal: {
    background: semanticTokens.background.surfaceElevated,
    borderRadius: primitiveTokens.radii['2xl'],
    border: semanticTokens.border.medium,
    shadow: primitiveTokens.shadows.elevationHigh,
  },
} as const;

/**
 * Single Unified Design System Export
 */
export const designTokens = {
  primitive: primitiveTokens,
  semantic: semanticTokens,
  component: componentTokens,
} as const;

export type DesignTokens = typeof designTokens;
