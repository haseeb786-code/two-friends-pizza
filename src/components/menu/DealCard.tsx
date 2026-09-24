'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, ArrowRight, X, ShoppingBag, Image as ImageIcon } from 'lucide-react';
import { Deal } from '@/types/deals';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DealCardProps {
  deal: Deal;
}

/**
 * Premium Deal Card — Mobile-First
 * ─────────────────────────────────
 * - Flow: Deals → Get Deal → Confirmation Modal → Yes → Add to Cart
 * - High-resolution combo food photography matching exact deal bundle.
 * - Clean inclusions list with quantities.
 * - Full Zustand cart store integration.
 */
export function DealCard({ deal }: DealCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { addDeal } = useCartStore();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const isMembersOnly = deal.membersOnly;
  const { symbol } = BUSINESS_CONFIG.currency;

  const defaultImages = deal.images && deal.images.length > 0 
    ? deal.images.slice(0, 2) 
    : [deal.image];

  const [imageList] = useState<string[]>(defaultImages);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    if (!isConfirmOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsConfirmOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConfirmOpen]);

  // Click "Get Deal" opens confirmation modal (does NOT add immediately)
  const handleOpenConfirm = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  // User confirms "Yes, Add to Cart"
  const handleConfirmAddToCart = useCallback(() => {
    addDeal(deal, 1);
    setIsConfirmOpen(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [addDeal, deal]);

  // User cancels
  const handleCancel = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  const currentImage = imageList[activeImageIndex] || deal.image;

  return (
    <>
      <article
        className={cn(
          'group relative flex flex-col rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden',
          isMembersOnly
            ? 'bg-obsidian-900 border-amber-600/30 hover:border-amber-600/50 hover:shadow-lg hover:shadow-amber-950/20'
            : 'bg-obsidian-900/90 border-white/[0.06] hover:border-white/[0.14] hover:shadow-lg hover:shadow-black/40'
        )}
        aria-label={`${deal.name}: ${symbol}${deal.price}`}
      >
        {/* ── Deal Image Banner ── */}
        <div className="relative w-full aspect-[16/9] bg-obsidian-850 overflow-hidden">
          {!imageError && currentImage ? (
            <Image
              src={currentImage}
              alt={deal.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              priority={deal.isFeatured}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-obsidian-850">
              <span className="text-3xl opacity-20 select-none" aria-hidden="true">🎁</span>
            </div>
          )}

          {/* Gradient shadow for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-black/30 pointer-events-none" />

          {/* Members Badge */}
          {isMembersOnly && (
            <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-amber-500 text-obsidian-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              <Crown className="w-2.5 h-2.5" aria-hidden="true" />
              Members Deal
            </span>
          )}

          {/* Dual Image Indicators */}
          {imageList.length > 1 && (
            <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1 z-10">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-200 cursor-pointer',
                    activeImageIndex === idx
                      ? 'w-4 bg-white shadow-sm'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  )}
                  aria-label={`View deal photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
          <div>
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-heading text-[15px] sm:text-base font-bold text-white leading-tight">
                {deal.name}
              </h3>
              {imageList.length > 1 && (
                <span className="text-[9px] text-obsidian-500 font-medium tabular-nums inline-flex items-center gap-0.5">
                  <ImageIcon className="w-2.5 h-2.5" />
                  {activeImageIndex + 1}/{imageList.length}
                </span>
              )}
            </div>
            <p className="text-[11px] text-obsidian-400 mt-1 leading-relaxed line-clamp-1">
              {deal.description}
            </p>
          </div>

          {/* Includes list */}
          <ul className="space-y-1.5 flex-1" aria-label="Deal includes">
            {deal.includes.map((inclusion, i) => (
              <li key={i} className="flex items-center gap-2 text-[12px] sm:text-[13px] text-obsidian-300">
                <span
                  className={cn(
                    'flex-shrink-0 text-[10px] font-bold tabular-nums w-4 text-center',
                    isMembersOnly ? 'text-amber-400' : 'text-flame-400'
                  )}
                  aria-hidden="true"
                >
                  {inclusion.qty}×
                </span>
                <span className="leading-tight">
                  {inclusion.item}
                  {inclusion.detail && (
                    <span className="text-obsidian-500 ml-1">({inclusion.detail})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Price + CTA */}
          <div className="flex items-end justify-between gap-3 pt-3 border-t border-white/[0.05] mt-auto">
            <div>
              <span className="text-[9px] text-obsidian-500 uppercase tracking-widest font-semibold block">
                Bundle Price
              </span>
              <p className={cn(
                'font-heading text-xl sm:text-2xl font-bold leading-none mt-0.5 tabular-nums',
                isMembersOnly ? 'text-amber-400' : 'text-white'
              )}>
                {symbol}{deal.price.toLocaleString()}
              </p>
            </div>
            <motion.button
              onClick={handleOpenConfirm}
              whileTap={prefersReducedMotion ? {} : { scale: 0.94 }}
              className={cn(
                'flex items-center gap-1.5 h-9 px-4 rounded-lg text-[12px] font-semibold transition-colors duration-150 cursor-pointer flex-shrink-0',
                added
                  ? 'bg-basil-500 text-white'
                  : isMembersOnly
                  ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-obsidian-950 shadow-sm'
                  : 'bg-flame-600 hover:bg-flame-500 active:bg-flame-700 text-white shadow-sm'
              )}
              aria-label={`Get ${deal.name} for ${symbol}${deal.price}`}
            >
              {added ? (
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{added ? 'Added to Cart!' : 'Get Deal'}</span>
            </motion.button>
          </div>
        </div>
      </article>

      {/* ── Confirmation Modal: Deals → Get Deal → Confirmation → Yes → Add to Cart ── */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleCancel}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`deal-confirm-title-${deal.id}`}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-obsidian-950 border border-white/10 rounded-2xl p-5 shadow-2xl z-10 space-y-4"
            >
              {/* Close Button */}
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-obsidian-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Cancel and close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-flame-400">
                  Deal Confirmation
                </p>
                <h3
                  id={`deal-confirm-title-${deal.id}`}
                  className="font-heading text-lg font-bold text-white mt-0.5"
                >
                  Add this deal to your cart?
                </h3>
              </div>

              {/* Deal Card Summary Preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-obsidian-850">
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt={deal.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🎁</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white truncate">{deal.name}</p>
                    {isMembersOnly && (
                      <span className="text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-semibold uppercase">
                        Members
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-obsidian-400 mt-0.5 line-clamp-1">
                    {deal.includes.map((i) => `${i.qty}× ${i.item}`).join(', ')}
                  </p>
                  <p className="text-sm font-bold text-amber-400 mt-1 tabular-nums">
                    {symbol}{deal.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 h-11 rounded-xl border border-white/10 hover:border-white/20 active:bg-white/5 text-[13px] font-semibold text-obsidian-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddToCart}
                  className="flex-1 h-11 rounded-xl bg-flame-600 hover:bg-flame-500 active:bg-flame-700 text-[13px] font-semibold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-flame-950/40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Yes, Add to Cart</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
