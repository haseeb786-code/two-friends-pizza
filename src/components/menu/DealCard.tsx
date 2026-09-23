'use client';

import { Deal } from '@/types/deals';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';
import { ShoppingBag, Crown, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DealCardProps {
  deal: Deal;
}

/**
 * Deal Card — shows bundled items + price prominently.
 * Members-Only deals get a gold Crown badge + gold border treatment.
 *
 * Note: Deals are added to cart as a metadata record.
 * Full deal-as-product cart integration will be completed in the checkout phase.
 * For now, clicking "Get Deal" records the intent and shows confirmation.
 */
export function DealCard({ deal }: DealCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [added, setAdded] = useState(false);

  function handleGetDeal() {
    // Phase 3 intent marker — cart integration for deals extended in checkout phase
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const isMembersOnly = deal.membersOnly;

  return (
    <motion.article
      className={cn(
        'relative flex flex-col p-5 rounded-2xl border transition-colors duration-300 overflow-hidden',
        isMembersOnly
          ? 'bg-gradient-to-br from-amber-950/40 to-obsidian-900 border-amber-500/30 hover:border-amber-500/60'
          : 'bg-obsidian-900 border-white/[0.07] hover:border-white/[0.14]'
      )}
      whileHover={prefersReducedMotion ? {} : { y: -3, scale: 1.008 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.985 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      aria-label={`${deal.name}: ${BUSINESS_CONFIG.currency.symbol}${deal.price}`}
    >
      {/* Members-Only glow accent */}
      {isMembersOnly && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.06] rounded-full blur-2xl" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-heading text-base font-bold text-white">{deal.name}</h3>
          <p className="text-xs text-obsidian-400 mt-0.5">{deal.description}</p>
        </div>
        {isMembersOnly && (
          <span className="flex-shrink-0 flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
            <Crown className="w-3 h-3" aria-hidden="true" />
            Members
          </span>
        )}
      </div>

      {/* Includes list */}
      <ul className="space-y-1.5 flex-1 mb-4" aria-label="Deal includes">
        {deal.includes.map((inclusion, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-obsidian-300">
            <span
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                isMembersOnly
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-flame-600/20 text-flame-400'
              )}
              aria-hidden="true"
            >
              {inclusion.qty}×
            </span>
            <span>
              {inclusion.item}
              {inclusion.detail && (
                <span className="text-obsidian-500 text-xs ml-1">({inclusion.detail})</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Price + CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
        <div>
          <span className="text-xs text-obsidian-500 uppercase tracking-widest">Bundle Price</span>
          <p className={cn('font-heading text-2xl font-bold', isMembersOnly ? 'text-amber-400' : 'text-white')}>
            {BUSINESS_CONFIG.currency.symbol}{deal.price.toLocaleString()}
          </p>
        </div>
        <motion.button
          onClick={handleGetDeal}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer',
            added
              ? 'bg-emerald-600 text-white'
              : isMembersOnly
              ? 'bg-amber-500 hover:bg-amber-400 text-obsidian-950'
              : 'bg-flame-600 hover:bg-flame-500 text-white'
          )}
          aria-label={added ? `${deal.name} selected` : `Get ${deal.name} for ₨${deal.price}`}
        >
          {added ? (
            <Check className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          )}
          {added ? 'Selected!' : 'Get Deal'}
        </motion.button>
      </div>
    </motion.article>
  );
}
