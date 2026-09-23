import type { Config } from 'tailwindcss';
import { primitiveTokens, semanticTokens } from './src/styles/tokens';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: primitiveTokens.colors.obsidian,
        flame: primitiveTokens.colors.flame,
        amber: primitiveTokens.colors.amber,
        basil: primitiveTokens.colors.basil,
        // Semantic aliases
        canvas: semanticTokens.background.canvas,
        surface: semanticTokens.background.surface,
        'surface-elevated': semanticTokens.background.surfaceElevated,
      },
      fontFamily: {
        heading: [primitiveTokens.typography.fontFamilies.heading],
        sans: [primitiveTokens.typography.fontFamilies.body],
        mono: [primitiveTokens.typography.fontFamilies.mono],
      },
      borderRadius: primitiveTokens.radii,
      boxShadow: primitiveTokens.shadows,
      spacing: primitiveTokens.spacing,
      screens: primitiveTokens.breakpoints,
    },
  },
  plugins: [],
};

export default config;
