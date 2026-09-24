'use client';

import { useState, useCallback, useEffect } from 'react';
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
  'pizza-local': { heading: 'Somewhat Local',     sub: 'Classic favourites with a local twist.' },
  'burger':      { heading: 'Burger Station',     sub: 'Flame-grilled, stacked with signature sauces.' },
  'shawarma':    { heading: 'Shawarma Station',   sub: 'Rolled fresh to order.' },
  'fries':       { heading: 'Fries Station',      sub: 'Golden, crispy, loaded — your way.' },
  'pasta':       { heading: 'Pasta Station',      sub: 'Creamy and crunchy, made fresh.' },
  'crispy':      { heading: 'Some Crispy',        sub: 'Pieces, nuggets, hot shots, wings.' },
  'deals':       { heading: 'Deals & Bundles',    sub: 'Student deals, group feasts, members-only pricing.' },
};

/**
 * Root Menu Section — Mobile-First
 * ────────────────────────────────
 * Compact section header + sticky category nav + scroll-spy.
 * Mobile grid: 1 column (horizontal cards). sm: 2 cols. lg: 3 cols. xl: 4 cols.
 * Each section separated by clean dividers, not heavy whitespace.
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
    <section className="bg-canvas" aria-label="Full menu" id="menu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section intro ── */}
        <motion.div
          variants={revealV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="pt-10 sm:pt-14 pb-2"
        >
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-flame-500 font-semibold mb-1.5">
            Our Menu
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Everything on the board.
          </h2>
          <p className="text-obsidian-500 mt-1.5 text-[13px] sm:text-sm max-w-md">
            Priced exactly as on our menu card. No surprises.
          </p>
        </motion.div>

        {/* ── Sticky nav ── */}
        <CategoryNav activeTab={activeTab} onChange={handleTabChange} />

        {/* ── Category Sections ── */}
        <div className="space-y-10 sm:space-y-14 pt-6 sm:pt-8 pb-16 sm:pb-24">

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
                    className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-white"
                  >
                    {meta.heading}
                  </h2>
                  <p className="text-obsidian-500 text-[11px] sm:text-xs mt-0.5">{meta.sub}</p>

                  {/* Somewhat Local price banner */}
                  {categoryId === 'pizza-local' && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-lg">
                      <span className="text-[10px] sm:text-[11px] text-obsidian-400 font-medium">
                        All: Reg ₨600 · Med ₨1,050 · Large ₨1,500 · XL ₨1,700
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
                className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-white"
              >
                Deals & Bundles
              </h2>
              <p className="text-obsidian-500 text-[11px] sm:text-xs mt-0.5">
                Student specials, group celebrations, members-only pricing.
              </p>
            </motion.div>
            <DealsSection />
          </section>
        </div>
      </div>
    </section>
  );
}
