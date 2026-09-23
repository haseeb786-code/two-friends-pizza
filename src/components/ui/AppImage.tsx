'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export interface AppImageProps extends Omit<ImageProps, 'alt'> {
  alt: string; // Strictly required for WCAG accessibility
  fallbackSrc?: string;
  containerClassName?: string;
}

/**
 * Accessible, Performance-Optimized Image Component
 * 
 * - Built on next/image for automatic WebP/AVIF generation, sizing, and lazy loading
 * - Smooth skeleton loading state to eliminate Cumulative Layout Shift (CLS)
 * - Graceful fallback on broken asset links
 * - Mobile-first responsive sizing defaults
 */
export function AppImage({
  src,
  alt,
  fallbackSrc = '/placeholder-food.jpg',
  className,
  containerClassName,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...rest
}: AppImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-obsidian-900',
        containerClassName
      )}
    >
      {/* Skeleton shimmer while image is loading */}
      {isLoading && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900"
        />
      )}

      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        priority={priority}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        {...rest}
      />
    </div>
  );
}
