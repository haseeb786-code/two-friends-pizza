'use client';

import { Deal } from '@/types/deals';
import { motion } from 'framer-motion';
import { Crown, Check, ArrowRight } from 'lucide-react';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DealCardProps {
  deal: Deal;
}

/**
 * Premium Deal Card — Mobile-First
 * ─────────────────────────────────
 * Clean card with structured includes list.
 * Members-Only: subtle warm border + crown badge — no gaudy gradients.
 * Touch target: entire card area, minimum 48px CTA button.
 * Price: large, left-aligned. CTA: right-aligned.
 */
export function DealCard({ deal }: DealCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [added, setAdded] = useState(false);
  const isMembersOnly = deal.membersOnly;
  const { symbol } = BUSINESS_CONFIG.currency;

  const handleGetDeal = useCallback(() => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, []);

  return (
    <article
      className={cn(
        'relative flex flex-col p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-colors duration-200 overflow-hidden',
        isMembersOnly
          ? 'bg-obsidian-900 border-amber-600/20 hover:border-amber-600/35'
          : 'bg-obsidian-900/80 border-white/[0.06] hover:border-white/[0.12]'
      )}
      aria-label={`${deal.name}: ${symbol}${deal.price}`}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h3 className="font-heading text-[15px] sm:text-base font-bold text-white leading-tight">
            {deal.name}
          </h3>
          <p className="text-[11px] text-obsidian-500 mt-0.5 leading-relaxed line-clamp-1">
            {deal.description}
          </p>
        </div>
        {isMembersOnly && (
          <span className="flex-shrink-0 flex items-center gap-1 bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-amber-500/20">
            <Crown className="w-2.5 h-2.5" aria-hidden="true" />
            Members
          </span>
        )}
      </div>

      {/* ── Includes list ── */}
      <ul className="space-y-1 flex-1 mb-3" aria-label="Deal includes">
        {deal.includes.map((inclusion, i) => (
          <li key={i} className="flex items-center gap-2 text-[12px] sm:text-[13px] text-obsidian-300">
            <span
              className={cn(
                'flex-shrink-0 text-[10px] font-bold tabular-nums',
                isMembersOnly ? 'text-amber-500' : 'text-obsidian-500'
              )}
              aria-hidden="true"
            >
              {inclusion.qty}×
            </span>
            <span className="leading-tight">
              {inclusion.item}
              {inclusion.detail && (
                <span className="text-obsidian-600 ml-1">({inclusion.detail})</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* ── Price + CTA ── */}
      <div className="flex items-end justify-between gap-3 pt-3 border-t border-white/[0.05]">
        <div>
          <span className="text-[9px] text-obsidian-600 uppercase tracking-widest font-medium">
            Bundle
          </span>
          <p className={cn(
            'font-heading text-xl sm:text-2xl font-bold leading-none mt-0.5',
            isMembersOnly ? 'text-amber-400' : 'text-white'
          )}>
            {symbol}{deal.price.toLocaleString()}
          </p>
        </div>
        <motion.button
          onClick={handleGetDeal}
          whileTap={prefersReducedMotion ? {} : { scale: 0.94 }}
          className={cn(
            'flex items-center gap-1.5 h-9 px-4 rounded-lg text-[12px] font-semibold transition-colors duration-150 cursor-pointer flex-shrink-0',
            added
              ? 'bg-basil-500 text-white'
              : isMembersOnly
              ? 'bg-amber-500 active:bg-amber-600 text-obsidian-950'
              : 'bg-flame-600 active:bg-flame-700 text-white'
          )}
          aria-label={added ? `${deal.name} selected` : `Get ${deal.name}`}
        >
          {added ? (
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          {added ? 'Added' : 'Get Deal'}
        </motion.button>
      </div>
    </article>
  );
}
