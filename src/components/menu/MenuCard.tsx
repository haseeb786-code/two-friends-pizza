'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Check } from 'lucide-react';
import { Product, ProductSizeOption } from '@/types/menu';
import { useCartStore } from '@/store/cartStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { BUSINESS_CONFIG } from '@/config/business';

interface MenuCardProps {
  product: Product;
  showSizes?: boolean;
}

/**
 * Premium Product Card — Mobile-First
 * ────────────────────────────────────
 * Horizontal layout on mobile (image left, content right) for thumb-friendly scanning.
 * Vertical card on ≥sm for grid layouts.
 * Size selector: compact inline pills.
 * Price: animates on size change without layout shift.
 * Add-to-cart: ripple-free tap with confirmation state.
 * Touch targets: all interactive elements ≥44px tap area.
 */
export function MenuCard({ product, showSizes = true }: MenuCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { addItem } = useCartStore();
  const hasSizes = product.sizes.length > 0 && showSizes;

  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | null>(
    hasSizes ? (product.sizes.find((s) => s.isDefault) ?? product.sizes[0]) : null
  );
  const [added, setAdded] = useState(false);

  const displayPrice = selectedSize ? selectedSize.price : product.basePrice;

  const handleAddToCart = useCallback(() => {
    addItem(product, selectedSize ? { size: selectedSize } : undefined, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }, [addItem, product, selectedSize]);

  const { symbol } = BUSINESS_CONFIG.currency;

  return (
    <article
      className="group relative flex flex-row sm:flex-col bg-obsidian-900/80 border border-white/[0.06] rounded-xl sm:rounded-2xl overflow-hidden transition-colors duration-200 hover:border-white/[0.12]"
      aria-label={`${product.name} — ${symbol}${displayPrice}`}
    >
      {/* ── Image area ── */}
      <div className="relative w-[100px] sm:w-full aspect-square sm:aspect-[4/3] bg-obsidian-850 overflow-hidden flex-shrink-0">
        {/* Emoji placeholder — real photos drop in later */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl sm:text-4xl opacity-20 select-none" aria-hidden="true">
            {getCategoryEmoji(product.category)}
          </span>
        </div>
        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-amber-500 text-obsidian-950 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
            Popular
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 min-w-0 p-3 sm:p-4 gap-2 sm:gap-2.5">
        {/* Name + description */}
        <div className="min-w-0">
          <h3 className="font-heading text-[14px] sm:text-[15px] font-semibold text-white leading-tight truncate">
            {product.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-obsidian-500 mt-0.5 leading-relaxed line-clamp-2 hidden sm:block">
            {product.description}
          </p>
        </div>

        {/* Size selector */}
        {hasSizes && (
          <div className="flex flex-wrap gap-1" role="group" aria-label="Select size">
            {product.sizes.map((size) => {
              const isSelected = selectedSize?.id === size.id;
              return (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'h-7 px-2.5 text-[10px] sm:text-[11px] font-semibold rounded-md border transition-all duration-100 cursor-pointer',
                    isSelected
                      ? 'bg-white text-obsidian-950 border-white'
                      : 'bg-transparent text-obsidian-400 border-white/[0.08] active:bg-white/5'
                  )}
                  aria-pressed={isSelected}
                  aria-label={`${size.name} — ${symbol}${size.price}`}
                >
                  {size.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayPrice}
              initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.12 }}
              className="font-heading text-lg sm:text-xl font-bold text-amber-400 leading-none"
              aria-live="polite"
              aria-label={`Price: ${symbol}${displayPrice}`}
            >
              {symbol}{displayPrice.toLocaleString()}
            </motion.span>
          </AnimatePresence>

          <motion.button
            onClick={handleAddToCart}
            whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
            className={cn(
              'flex items-center justify-center gap-1 h-8 sm:h-9 px-3 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-150 cursor-pointer flex-shrink-0',
              added
                ? 'bg-basil-500 text-white'
                : 'bg-flame-600 active:bg-flame-700 text-white'
            )}
            aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          >
            {added ? (
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span className="hidden xs:inline">{added ? 'Added' : 'Add'}</span>
          </motion.button>
        </div>
      </div>
    </article>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    pizza: '🍕', 'pizza-local': '🍕', burger: '🍔',
    shawarma: '🌯', fries: '🍟', pasta: '🍝', crispy: '🍗',
  };
  return map[category] ?? '🍽️';
}

/** Compact quantity control — used in CartDrawer */
export function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex items-center gap-0" role="group" aria-label="Adjust quantity">
      <button
        onClick={onDecrease}
        className="w-8 h-8 flex items-center justify-center rounded-l-lg bg-obsidian-800 active:bg-obsidian-700 text-white transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3 h-3" aria-hidden="true" />
      </button>
      <span className="w-8 h-8 flex items-center justify-center bg-obsidian-800/60 text-[13px] font-bold text-white" aria-live="polite">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center rounded-r-lg bg-obsidian-800 active:bg-obsidian-700 text-white transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="w-3 h-3" aria-hidden="true" />
      </button>
    </div>
  );
}
