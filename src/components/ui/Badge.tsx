import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'flame' | 'gold' | 'neutral' | 'success';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  flame: 'bg-flame-900/60 text-flame-300 border-flame-600/40',
  gold: 'bg-amber-900/50 text-amber-300 border-amber-500/40',
  neutral: 'bg-obsidian-850 text-obsidian-200 border-white/10',
  success: 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40',
};

/**
 * Accessible Badge Component with high-contrast text ratios
 */
export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
