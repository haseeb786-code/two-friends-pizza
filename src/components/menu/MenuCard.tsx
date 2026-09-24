'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Check, Image as ImageIcon } from 'lucide-react';
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
 * Premium Product Card — Mobile-First with Dual Image & Upload Support
 * ───────────────────────────────────────────────────────────────────
 * - Curated high-resolution food photography.
 * - Supports up to 2 images per card with elegant switch indicator.
 * - Interactive image upload option for custom photos.
 * - Zero layout shift or image distortion via `object-fit: cover`.
 * - Horizontal layout on mobile (image left, content right), vertical on sm+.
 */
export function MenuCard({ product, showSizes = true }: MenuCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { addItem } = useCartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasSizes = product.sizes.length > 0 && showSizes;

  // Image collection: product default images or uploaded images (up to 2)
  const defaultImages = product.images && product.images.length > 0 
    ? product.images.slice(0, 2) 
    : [product.image];
  
  const [imageList, setImageList] = useState<string[]>(defaultImages);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

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

  // Handle local image upload (up to 2 images)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUrls: string[] = [];
    const maxFiles = Math.min(files.length, 2);
    for (let i = 0; i < maxFiles; i++) {
      newUrls.push(URL.createObjectURL(files[i]));
    }

    setImageList(newUrls);
    setActiveImageIndex(0);
    setImageError(false);
  };

  const { symbol } = BUSINESS_CONFIG.currency;
  const currentImage = imageList[activeImageIndex] || product.image;

  return (
    <article
      className="group relative flex flex-row sm:flex-col bg-obsidian-900/90 border border-white/[0.06] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/[0.14] hover:shadow-lg hover:shadow-black/40"
      aria-label={`${product.name} — ${symbol}${displayPrice}`}
    >
      {/* Hidden file input for up to 2 image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        multiple
        className="hidden"
        aria-hidden="true"
      />

      {/* ── Image Area ── */}
      <div className="relative w-[110px] sm:w-full aspect-square sm:aspect-[4/3] bg-obsidian-850 overflow-hidden flex-shrink-0">
        {!imageError && currentImage ? (
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 110px, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            priority={product.isFeatured}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian-850">
            <span className="text-3xl sm:text-4xl opacity-25 select-none" aria-hidden="true">
              {getCategoryEmoji(product.category)}
            </span>
          </div>
        )}

        {/* Subtle dark vignette on top/bottom for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Popular / Featured Badge */}
        {product.isFeatured && (
          <span className="absolute top-2 left-2 bg-amber-500 text-obsidian-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            Popular
          </span>
        )}

        {/* ── Dual Image Indicators (If 2 images available) ── */}
        {imageList.length > 1 && (
          <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-1 z-10">
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
                aria-label={`View photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content Area ── */}
      <div className="flex flex-col flex-1 min-w-0 p-3 sm:p-4 gap-2">
        {/* Name + Description */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-heading text-[14px] sm:text-[15px] font-semibold text-white leading-tight truncate">
              {product.name}
            </h3>
            {imageList.length > 1 && (
              <span className="text-[9px] text-obsidian-500 font-medium tabular-nums hidden sm:inline-flex items-center gap-0.5">
                <ImageIcon className="w-2.5 h-2.5" />
                {activeImageIndex + 1}/{imageList.length}
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-obsidian-400 mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Size Selector */}
        {hasSizes && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1" role="group" aria-label="Select size">
            {product.sizes.map((size) => {
              const isSelected = selectedSize?.id === size.id;
              return (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'h-7 px-2.5 text-[10px] sm:text-[11px] font-semibold rounded-md border transition-all duration-100 cursor-pointer',
                    isSelected
                      ? 'bg-white text-obsidian-950 border-white shadow-sm'
                      : 'bg-transparent text-obsidian-400 border-white/[0.08] hover:border-white/20 active:bg-white/5'
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

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1 border-t border-white/[0.04]">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayPrice}
              initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="font-heading text-base sm:text-lg font-bold text-amber-400 leading-none tabular-nums"
              aria-live="polite"
              aria-label={`Price: ${symbol}${displayPrice}`}
            >
              {symbol}{displayPrice.toLocaleString()}
            </motion.span>
          </AnimatePresence>

          <motion.button
            onClick={handleAddToCart}
            whileTap={prefersReducedMotion ? {} : { scale: 0.94 }}
            className={cn(
              'flex items-center justify-center gap-1 h-8 sm:h-9 px-3 sm:px-3.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-150 cursor-pointer flex-shrink-0',
              added
                ? 'bg-basil-500 text-white'
                : 'bg-flame-600 hover:bg-flame-500 active:bg-flame-700 text-white'
            )}
            aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          >
            {added ? (
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{added ? 'Added' : 'Add'}</span>
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
    <div className="flex items-center gap-0 border border-white/10 rounded-lg overflow-hidden" role="group" aria-label="Adjust quantity">
      <button
        onClick={onDecrease}
        className="w-8 h-8 flex items-center justify-center bg-obsidian-800 hover:bg-obsidian-750 active:bg-obsidian-700 text-white transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3 h-3" aria-hidden="true" />
      </button>
      <span className="w-8 h-8 flex items-center justify-center bg-obsidian-850 text-[13px] font-bold text-white tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center bg-obsidian-800 hover:bg-obsidian-750 active:bg-obsidian-700 text-white transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="w-3 h-3" aria-hidden="true" />
      </button>
    </div>
  );
}
