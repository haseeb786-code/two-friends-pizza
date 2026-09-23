'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Check } from 'lucide-react';
import { Product, ProductSizeOption } from '@/types/menu';
import { useCartStore } from '@/store/cartStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { BUSINESS_CONFIG } from '@/config/business';

interface MenuCardProps {
  product: Product;
  /** Hide the size selector for products that have no sizes (burgers, shawarma, etc.) */
  showSizes?: boolean;
}

/**
 * Reusable product card for all non-deal menu items.
 * - Size selector with animated price update (no layout shift)
 * - Add to Cart wired to Zustand cart store
 * - Placeholder image with shimmer fallback
 * - Hover lift / tap press from existing motion tokens
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

  function handleAddToCart() {
    addItem(product, selectedSize ? { size: selectedSize } : undefined, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <motion.article
      className="group relative flex flex-col bg-obsidian-900 border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-colors duration-300"
      whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.012 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.985 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      aria-label={`${product.name} — ₨${displayPrice}`}
    >
      {/* Image area */}
      <div className="relative w-full aspect-[4/3] bg-obsidian-850 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Placeholder shown when image fails / not yet available */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-5xl opacity-30 select-none" aria-hidden="true">
            {getCategoryEmoji(product.category)}
          </span>
        </div>
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-amber-500 text-obsidian-950 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-white leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-obsidian-400 mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Size selector — only shown for pizza products */}
        {hasSizes && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select size">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-lg border transition-all duration-150 cursor-pointer',
                  selectedSize?.id === size.id
                    ? 'bg-amber-500 text-obsidian-950 border-amber-500'
                    : 'bg-transparent text-obsidian-300 border-white/10 hover:border-amber-500/50 hover:text-white'
                )}
                aria-pressed={selectedSize?.id === size.id}
                aria-label={`${size.name} — ${BUSINESS_CONFIG.currency.symbol}${size.price}`}
              >
                {size.name}
              </button>
            ))}
          </div>
        )}

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayPrice}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              className="font-heading text-xl font-bold text-amber-400"
              aria-live="polite"
              aria-label={`Price: ${BUSINESS_CONFIG.currency.symbol}${displayPrice}`}
            >
              {BUSINESS_CONFIG.currency.symbol}{displayPrice.toLocaleString()}
            </motion.span>
          </AnimatePresence>

          <motion.button
            onClick={handleAddToCart}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer',
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-flame-600 hover:bg-flame-500 text-white'
            )}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          >
            {added ? (
              <Check className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Plus className="w-4 h-4" aria-hidden="true" />
            )}
            {added ? 'Added' : 'Add'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    pizza: '🍕', 'pizza-local': '🔥', burger: '🍔',
    shawarma: '🌯', fries: '🍟', pasta: '🍝', crispy: '🍗',
  };
  return map[category] ?? '🍽️';
}

/** Compact quantity control used inside cart drawer */
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
    <div className="flex items-center gap-2" role="group" aria-label="Adjust quantity">
      <button
        onClick={onDecrease}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-white transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3 h-3" aria-hidden="true" />
      </button>
      <span className="text-sm font-semibold text-white w-4 text-center" aria-live="polite">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-white transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="w-3 h-3" aria-hidden="true" />
      </button>
    </div>
  );
}
