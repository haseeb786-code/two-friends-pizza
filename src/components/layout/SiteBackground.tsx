import React from 'react';
import Image from 'next/image';

/**
 * SiteBackground — Tasteful, Subtle Food & Restaurant Visual Depth
 * ────────────────────────────────────────────────────────────────
 * - Fixed background layer spanning the entire application.
 * - Extremely subtle culinary restaurant atmosphere (dark slate, soft flour dust, ambient hearth warmth).
 * - Layered with deep obsidian masks and radial vignettes.
 * - Opacity strictly controlled between 3% - 4.5% to guarantee 100% text readability.
 * - Zero visual distraction or competition with the main content.
 */
export function SiteBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── Base Deep Canvas ── */}
      <div className="absolute inset-0 bg-canvas" />

      {/* ── Layer 1: Very subtle restaurant & culinary photographic depth ── */}
      <div className="absolute inset-0 opacity-[0.038] mix-blend-luminosity">
        <Image
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter blur-[1px]"
        />
      </div>

      {/* ── Layer 2: Subtle culinary flour/slate grain overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.15) 1.5px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ── Layer 3: Warm Ambient Hearth Glow (Corners & Edges) ── */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-amber-500/[0.035] blur-[150px]" />
      <div className="absolute top-[45%] -left-32 w-[550px] h-[550px] rounded-full bg-flame-600/[0.025] blur-[160px]" />
      <div className="absolute -bottom-32 right-[10%] w-[600px] h-[600px] rounded-full bg-amber-600/[0.03] blur-[150px]" />

      {/* ── Layer 4: Deep Radial Vignette Mask (guarantees text contrast) ── */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-obsidian-950/60 to-obsidian-950" />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/40 via-transparent to-obsidian-950/80" />
    </div>
  );
}
