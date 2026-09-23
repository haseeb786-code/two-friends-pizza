'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CategoryNav, MenuTabId } from './CategoryNav';
import { MenuCard } from './MenuCard';
import { DealsSection } from './DealsSection';
import { MENU_PRODUCTS, MENU_CATEGORIES } from '@/data/menu';
import { sectionRevealVariants, staggerContainerVariants, productCardVariants } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CATEGORY_ORDER: MenuTabId[] = [
  'pizza', 'pizza-local', 'burger', 'shawarma', 'fries', 'pasta', 'crispy', 'deals',
];

const SECTION_META: Record<MenuTabId, { heading: string; sub: string; emoji: string }> = {
  'pizza':       { heading: 'Signature Pizzas',       sub: 'Our premium range — Crown Crust, Malai Boti and more.', emoji: '🍕' },
  'pizza-local': { heading: 'Somewhat Local',          sub: 'Classic wood-fired favourites with a local twist.', emoji: '🔥' },
  'burger':      { heading: 'Burger Station',          sub: 'Flame-grilled burgers stacked with signature sauces.', emoji: '🍔' },
  'shawarma':    { heading: 'Shawarma Station',        sub: 'Rolled fresh to order. Warm bread, bold flavours.', emoji: '🌯' },
  'fries':       { heading: 'Fries Station',           sub: 'Golden, crispy and loaded — your way.', emoji: '🍟' },
  'pasta':       { heading: 'Pasta Station',           sub: 'Creamy and crunchy pastas made fresh daily.', emoji: '🍝' },
  'crispy':      { heading: 'Some Crispy',             sub: 'Pieces, nuggets, hot shots and wings. Always crispy.', emoji: '🍗' },
  'deals':       { heading: 'Deals & Bundles',         sub: 'Student deals, group feasts and members-only pricing.', emoji: '🎁' },
};

/**
 * Root Menu Section
 * ─────────────────
 * - Sticky category nav for tab-driven navigation
 * - Scroll-spy: highlights active tab as user scrolls through sections
 * - Each category section reveals on viewport entry (Framer Motion)
 * - All 7 food categories + Deals sub-section rendered in order
 * - Respects prefers-reduced-motion
 */
export function MenuSection() {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<MenuTabId>('pizza');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // ── Scroll-spy: update active tab as sections cross viewport ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id.replace('menu-section-', '') as MenuTabId);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    CATEGORY_ORDER.forEach((id) => {
      const el = document.getElementById(`menu-section-${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // ── Tab click: scroll to section ──
  const handleTabChange = useCallback((id: MenuTabId) => {
    setActiveTab(id);
    const el = document.getElementById(`menu-section-${id}`);
    if (el) {
      const offset = 120; // account for sticky header + nav
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : staggerContainerVariants;

  const cardVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : productCardVariants;

  const revealVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : sectionRevealVariants;

  return (
    <section
      className="bg-canvas min-h-screen"
      aria-label="Full menu"
      id="menu"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Section headline */}
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="pt-16 pb-4"
        >
          <p className="text-xs uppercase tracking-widest text-flame-400 font-semibold mb-2">Our Menu</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white">
            Everything on<br />
            <span className="text-amber-400">the board.</span>
          </h2>
          <p className="text-obsidian-400 mt-3 max-w-[480px] text-sm sm:text-base">
            Wood-fired pizzas, zingers, shawarmas and more —<br className="hidden sm:block" /> all priced exactly as on our menu card.
          </p>
        </motion.div>

        {/* Sticky category nav */}
        <CategoryNav activeTab={activeTab} onChange={handleTabChange} />

        {/* Category Sections */}
        <div className="space-y-20 pt-12 pb-24">

          {/* ── Render all food category sections ── */}
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
                aria-label={meta.heading}
              >
                <motion.div
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl" aria-hidden="true">{meta.emoji}</span>
                    <h2
                      id={`section-heading-${categoryId}`}
                      className="font-heading text-2xl sm:text-3xl font-bold text-white"
                    >
                      {meta.heading}
                    </h2>
                  </div>
                  <p className="text-obsidian-400 text-sm">{meta.sub}</p>
                  {categoryId === 'pizza-local' && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-flame-900/30 border border-flame-600/30 px-3 py-1.5 rounded-xl">
                      <span className="text-xs text-flame-300 font-medium">
                        All sizes: Regular ₨600 · Medium ₨1050 · Large ₨1500 · XL ₨1700
                      </span>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {products.map((product) => (
                    <motion.div key={product.id} variants={cardVariants}>
                      <MenuCard
                        product={product}
                        showSizes={isPizza}
                      />
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
            aria-label="Deals and bundles"
          >
            <motion.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl" aria-hidden="true">🎁</span>
                <h2
                  id="section-heading-deals"
                  className="font-heading text-2xl sm:text-3xl font-bold text-white"
                >
                  Deals & Bundles
                </h2>
              </div>
              <p className="text-obsidian-400 text-sm">
                Student specials, group celebrations and already-discounted member bundles.
              </p>
            </motion.div>
            <DealsSection />
          </section>
        </div>
      </div>
    </section>
  );
}
