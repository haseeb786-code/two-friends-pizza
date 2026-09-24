'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Filter } from 'lucide-react';
import { CategoryNav, MenuTabId } from './CategoryNav';
import { MenuCard } from './MenuCard';
import { DealCard } from './DealCard';
import { DealsSection } from './DealsSection';
import { MENU_PRODUCTS } from '@/data/menu';
import { DEALS } from '@/data/deals';
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

const SUGGESTED_SEARCHES = [
  'Crown Crust', 'Zinger', 'Malai Boti', 'Shawarma', 'Alfredo Pasta', 'Deal 3', 'Fries',
];

export function MenuSection() {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<MenuTabId>('pizza');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Scroll-spy (only when not searching) ──
  useEffect(() => {
    if (searchQuery.trim().length > 0) return;

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
  }, [searchQuery]);

  // ── Tab click ──
  const handleTabChange = useCallback((id: MenuTabId) => {
    setSearchQuery('');
    setActiveTab(id);
    const el = document.getElementById(`menu-section-${id}`);
    if (el) {
      const offset = 110; // header 56 + nav ~50 + buffer
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  // ── Search filtering ──
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return [];
    return MENU_PRODUCTS.filter((product) => {
      const matchName = product.name.toLowerCase().includes(normalizedQuery);
      const matchDesc = product.description.toLowerCase().includes(normalizedQuery);
      const matchCat = product.category.toLowerCase().includes(normalizedQuery);
      const matchSubCat = product.subCategory ? product.subCategory.toLowerCase().includes(normalizedQuery) : false;
      return matchName || matchDesc || matchCat || matchSubCat;
    });
  }, [normalizedQuery]);

  const filteredDeals = useMemo(() => {
    if (!normalizedQuery) return [];
    return DEALS.filter((deal) => {
      const matchName = deal.name.toLowerCase().includes(normalizedQuery);
      const matchDesc = deal.description.toLowerCase().includes(normalizedQuery);
      const matchItems = deal.includes.some((inc) => inc.item.toLowerCase().includes(normalizedQuery));
      return matchName || matchDesc || matchItems;
    });
  }, [normalizedQuery]);

  const totalResultsCount = filteredProducts.length + filteredDeals.length;

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
      {/* ── Tasteful culinary background texture with deep dark overlay ── */}
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
      {/* Subtle radial warmth for restaurant atmosphere */}
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/[0.03] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-40 left-[-10%] w-[500px] h-[500px] rounded-full bg-flame-600/[0.025] blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section intro ── */}
        <motion.div
          variants={revealV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="pt-10 sm:pt-14 pb-4"
        >
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-flame-500 font-semibold mb-1.5">
            Two Friends Pizza · Main Chak Belli Road, Rawat
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Our Complete Menu
              </h2>
              <p className="text-obsidian-400 mt-1.5 text-[13px] sm:text-sm max-w-md">
                32 fast-food favorites & 14 combo deals. Priced exactly as on our printed menu card.
              </p>
            </div>

            {/* Instant Live Search Bar (Video 1 Feature) */}
            <div className="w-full md:w-80 lg:w-96 relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-obsidian-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pizzas, burgers, deals..."
                  className="w-full pl-10 pr-9 py-2.5 bg-obsidian-950/80 border border-white/10 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-obsidian-500 outline-none transition-all shadow-inner focus:ring-1 focus:ring-amber-500/50"
                  aria-label="Search menu items"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-0.5 rounded-full hover:bg-white/10 text-obsidian-400 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick search recommendation tags */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-3.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-obsidian-500 font-medium shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Popular:
            </span>
            {SUGGESTED_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all shrink-0 ${
                  searchQuery.toLowerCase() === term.toLowerCase()
                    ? 'bg-amber-500 text-obsidian-950 font-bold border-amber-500'
                    : 'bg-white/[0.03] text-obsidian-300 hover:text-white border-white/[0.08] hover:border-white/20'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── SEARCH RESULTS VIEW (when search query is present) ── */}
        {normalizedQuery ? (
          <div className="pt-6 pb-20">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  Search Results for <span className="text-amber-400">"{searchQuery}"</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                  {totalResultsCount} found
                </span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-obsidian-400 hover:text-amber-400 underline transition-colors"
              >
                View all categories
              </button>
            </div>

            {totalResultsCount === 0 ? (
              <div className="text-center py-16 px-4 bg-obsidian-950/50 rounded-2xl border border-white/[0.06]">
                <p className="text-base text-white font-semibold mb-1">No items found matching "{searchQuery}"</p>
                <p className="text-xs text-obsidian-400 max-w-sm mx-auto mb-4">
                  Try searching for Crown Crust, Zinger, Shawarma, Pasta, or one of our popular combo deals.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-obsidian-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                >
                  Clear Search & View All Menu
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Matched Products */}
                {filteredProducts.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-obsidian-400 font-semibold mb-4">
                      Menu Items ({filteredProducts.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                      {filteredProducts.map((product) => (
                        <MenuCard
                          key={product.id}
                          product={product}
                          showSizes={product.category === 'pizza' || product.category === 'pizza-local'}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Deals */}
                {filteredDeals.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-obsidian-400 font-semibold mb-4">
                      Combo Deals ({filteredDeals.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                      {filteredDeals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ── STANDARD CATEGORIZED VIEW (Sticky category nav + scroll-spy) ── */
          <>
            {/* Sticky Category Nav */}
            <CategoryNav activeTab={activeTab} onChange={handleTabChange} />

            {/* Category Sections */}
            <div className="space-y-12 sm:space-y-16 pt-6 sm:pt-8 pb-16 sm:pb-24">
              {(CATEGORY_ORDER.filter((id) => id !== 'deals') as Exclude<MenuTabId, 'deals'>[]).map((categoryId) => {
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

              {/* Deals Section */}
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
          </>
        )}
      </div>
    </section>
  );
}
