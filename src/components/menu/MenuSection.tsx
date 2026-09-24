'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CategoryNav, MenuTabId } from './CategoryNav';
import { MenuCard } from './MenuCard';
import { DealsSection } from './DealsSection';
import { MENU_PRODUCTS } from '@/data/menu';
import { sectionRevealVariants, staggerContainerVariants, productCardVariants } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CATEGORY_ORDER: MenuTabId[] = [
  'pizza', 'pizza-local', 'burger', 'shawarma', 'fries', 'pasta', 'crispy', 'deals',
];

const SECTION_META: Record<MenuTabId, { heading: string; sub: string }> = {
  'pizza':       { heading: 'Signature Pizzas',  sub: 'Our premium range — Crown Crust, Malai Boti and more.' },
  'pizza-local': { heading: 'Somewhat Local',     sub: 'Classic fast food favourites with a local twist.' },
  'burger':      { heading: 'Burger Station',     sub: 'Crispy zingers, cheese burgers, towers, and pizza burgers.' },
  'shawarma':    { heading: 'Shawarma Station',   sub: 'Rolled fresh to order with garlic mayo sauce.' },
  'fries':       { heading: 'Fries Station',      sub: 'Golden, crispy, loaded, and pizza-style — your way.' },
  'pasta':       { heading: 'Pasta Station',      sub: 'Creamy Alfredo and baked crunchy pastas, made fresh.' },
  'crispy':      { heading: 'Some Crispy',        sub: 'Fried chicken pieces, nuggets, hot shots, and wings.' },
  'deals':       { heading: 'Deals & Bundles',    sub: 'Student specials, group feasts, and members-only pricing.' },
};

/**
 * Root Menu Section — Mobile-First with Subtle Luxury Background Depth
 * ───────────────────────────────────────────────────────────────────
 * - Compact section header + sticky category nav + scroll-spy.
 * - Tasteful, ultra-subtle culinary background textures with dark overlays.
 * - 100% text readability preserved.
 * - Mobile grid: 1 column (horizontal cards). sm: 2 cols. lg: 3 cols. xl: 4 cols.
 */
export function MenuSection() {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<MenuTabId>('pizza');

  // ── Scroll-spy ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id.replace('menu-section-', '') as MenuTabId);
          }
        }
      },
      { rootMargin: '-35% 0px -60% 0px', threshold: 0 }
    );
    CATEGORY_ORDER.forEach((id) => {
      const el = document.getElementById(`menu-section-${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // ── Tab click ──
  const handleTabChange = useCallback((id: MenuTabId) => {
    setActiveTab(id);
    const el = document.getElementById(`menu-section-${id}`);
    if (el) {
      const offset = 110; // header 56 + nav ~50 + buffer
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const containerV = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : staggerContainerVariants;

  const cardV = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : productCardVariants;

  const revealV = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : sectionRevealVariants;

  return (
    <section className="relative bg-canvas overflow-hidden" aria-label="Full menu" id="menu">
      {/* ── Tasteful, subtle culinary background texture with deep dark overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-luminosity overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
      </div>
      {/* Subtle radial warmth for restaurant atmosphere — never reduces contrast */}
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/[0.03] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-40 left-[-10%] w-[500px] h-[500px] rounded-full bg-flame-600/[0.025] blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section intro ── */}
        <motion.div
          variants={revealV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="pt-10 sm:pt-14 pb-2"
        >
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-flame-500 font-semibold mb-1.5">
            Two Friends Pizza
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Our Complete Menu
          </h2>
          <p className="text-obsidian-400 mt-1.5 text-[13px] sm:text-sm max-w-md">
            All items and deals priced exactly as on our printed menu card.
          </p>
        </motion.div>

        {/* ── Sticky nav ── */}
        <CategoryNav activeTab={activeTab} onChange={handleTabChange} />

        {/* ── Category Sections ── */}
        <div className="space-y-12 sm:space-y-16 pt-6 sm:pt-8 pb-16 sm:pb-24">

          {(CATEGORY_ORDER.filter(id => id !== 'deals') as Exclude<MenuTabId, 'deals'>[]).map((categoryId) => {
            const products = MENU_PRODUCTS.filter((p) => p.category === categoryId);
            if (products.length === 0) return null;

            const meta = SECTION_META[categoryId];
            const isPizza = categoryId === 'pizza' || categoryId === 'pizza-local';

            return (
              <section
                key={categoryId}
                id={`menu-section-${categoryId}`}
                aria-labelledby={`section-heading-${categoryId}`}
                role="tabpanel"
                className="scroll-mt-32"
              >
                {/* Section header */}
                <motion.div
                  variants={revealV}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  className="mb-4 sm:mb-6"
                >
                  <h2
                    id={`section-heading-${categoryId}`}
                    className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight"
                  >
                    {meta.heading}
                  </h2>
                  <p className="text-obsidian-400 text-[11px] sm:text-xs mt-0.5">{meta.sub}</p>

                  {/* Somewhat Local price banner */}
                  {categoryId === 'pizza-local' && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-lg">
                      <span className="text-[10px] sm:text-[11px] text-amber-400/90 font-medium">
                        Standard Pricing: Regular ₨600 · Medium ₨1,050 · Large ₨1,500 · XL ₨1,700
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Product grid */}
                <motion.div
                  variants={containerV}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                >
                  {products.map((product) => (
                    <motion.div key={product.id} variants={cardV}>
                      <MenuCard product={product} showSizes={isPizza} />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            );
          })}

          {/* ── Deals Section ── */}
          <section
            id="menu-section-deals"
            aria-labelledby="section-heading-deals"
            role="tabpanel"
            className="scroll-mt-32"
          >
            <motion.div
              variants={revealV}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="mb-4 sm:mb-6"
            >
              <h2
                id="section-heading-deals"
                className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight"
              >
                Deals & Bundles
              </h2>
              <p className="text-obsidian-400 text-[11px] sm:text-xs mt-0.5">
                Student specials, group feasts, and members-only combos.
              </p>
            </motion.div>
            <DealsSection />
          </section>
        </div>
      </div>
    </section>
  );
}
