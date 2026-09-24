'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Crown, Check, ArrowRight, Camera, Image as ImageIcon } from 'lucide-react';
import { Deal } from '@/types/deals';
import { cn } from '@/lib/utils';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DealCardProps {
  deal: Deal;
}

/**
 * Premium Deal Card — Mobile-First with Dual Image & Upload Support
 * ─────────────────────────────────────────────────────────────────
 * - Curated combo food photography matching exact deal bundles.
 * - Dual image toggle support.
 * - Clean inclusions list with quantities.
 * - Members-only gold accenting without gaudy glow.
 */
export function DealCard({ deal }: DealCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [added, setAdded] = useState(false);
  const isMembersOnly = deal.membersOnly;
  const { symbol } = BUSINESS_CONFIG.currency;

  const defaultImages = deal.images && deal.images.length > 0 
    ? deal.images.slice(0, 2) 
    : [deal.image];

  const [imageList, setImageList] = useState<string[]>(defaultImages);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleGetDeal = useCallback(() => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, []);

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

  const currentImage = imageList[activeImageIndex] || deal.image;

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden',
        isMembersOnly
          ? 'bg-obsidian-900 border-amber-600/30 hover:border-amber-600/50 hover:shadow-lg hover:shadow-amber-950/20'
          : 'bg-obsidian-900/90 border-white/[0.06] hover:border-white/[0.14] hover:shadow-lg hover:shadow-black/40'
      )}
      aria-label={`${deal.name}: ${symbol}${deal.price}`}
    >
      {/* Hidden file input for custom image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        multiple
        className="hidden"
        aria-hidden="true"
      />

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

        {/* Upload Custom Image Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
          title="Upload or change deal photos (up to 2)"
          aria-label="Upload custom deal photos"
        >
          <Camera className="w-3 h-3" />
        </button>

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
            onClick={handleGetDeal}
            whileTap={prefersReducedMotion ? {} : { scale: 0.94 }}
            className={cn(
              'flex items-center gap-1.5 h-9 px-4 rounded-lg text-[12px] font-semibold transition-colors duration-150 cursor-pointer flex-shrink-0',
              added
                ? 'bg-basil-500 text-white'
                : isMembersOnly
                ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-obsidian-950 shadow-sm'
                : 'bg-flame-600 hover:bg-flame-500 active:bg-flame-700 text-white shadow-sm'
            )}
            aria-label={added ? `${deal.name} selected` : `Get ${deal.name}`}
          >
            {added ? (
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{added ? 'Added' : 'Get Deal'}</span>
          </motion.button>
        </div>
      </div>
    </article>
  );
}
