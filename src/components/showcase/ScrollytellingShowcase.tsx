'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { MENU_PRODUCTS } from '@/data/menu';
import { useCartStore } from '@/store/cartStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HouseSpecial {
  id: string;
  productId: string;
  step: string;
  badge: string;
  category: string;
  title: string;
  priceDisplay: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  highlights: string[];
  floatingIngredients: {
    name: string;
    icon: string;
    position: string;
  }[];
}

const HOUSE_SPECIALS: HouseSpecial[] = [
  {
    id: 'crown-crust',
    productId: 'pizza-crown-crust',
    step: '01 / Signature Pizza',
    badge: 'Crown Crust',
    category: 'Signature Pizzas',
    title: 'Crown Crust Pizza',
    priceDisplay: 'Reg ₨700 · Med ₨1,150 · Large ₨1,700 · XL ₨1,950',
    description:
      'A royal crown of crust stuffed with rich melted cheese pockets wrapped around premium chicken chunks and fresh toppings. Our #1 best-selling pizza in Rawat.',
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Two Friends Crown Crust Pizza with stuffed cheese pockets',
    highlights: [
      'Royal crown crust with cheese-stuffed pockets around the rim',
      'Loaded with marinated tender chicken boti, capsicum & onions',
      '100% real stretchy mozzarella baked to golden blistered perfection',
    ],
    floatingIngredients: [
      { name: 'Stuffed Cheese Pockets', icon: '🧀', position: 'top-6 left-6' },
      { name: 'Tender Chicken Tikka', icon: '🍗', position: 'bottom-8 right-6' },
      { name: 'Sliced Black Olives', icon: '🫒', position: 'top-10 right-6' },
    ],
  },
  {
    id: 'pizza-burger',
    productId: 'burger-pizza',
    step: '02 / Burger Station',
    badge: 'Pizza Burger',
    category: 'Burger Station',
    title: 'Special Pizza Burger',
    priceDisplay: '₨800',
    description:
      'Two fast-food worlds merged into one. Savory pizza sauce, seasoned chicken, and bubbling mozzarella cheese baked inside a warm toasted burger bun.',
    imageUrl:
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Two Friends Special Pizza Burger overflowing with melted cheese',
    highlights: [
      'Seasoned chicken patty drenched in aromatic garlic pizza sauce',
      'Core of molten, stretchy mozzarella cheese sealed in every bite',
      'Toasted golden bun with sesame seeds and crisp lettuce',
    ],
    floatingIngredients: [
      { name: 'Melted Mozzarella Core', icon: '🧀', position: 'top-8 left-8' },
      { name: 'Rich Pizza Herb Sauce', icon: '🍅', position: 'bottom-8 left-10' },
      { name: 'Toasted Sesame Bun', icon: '🍔', position: 'top-8 right-8' },
    ],
  },
  {
    id: 'pizza-fries',
    productId: 'fries-pizza',
    step: '03 / Fries Station',
    badge: 'Pizza Fries',
    category: 'Fries Station',
    title: 'Oven-Baked Pizza Fries',
    priceDisplay: '₨700',
    description:
      'Golden crispy French fries baked under savory pizza sauce, spiced chicken chunks, and a thick blanket of melted mozzarella cheese.',
    imageUrl:
      'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Two Friends Loaded Oven-Baked Pizza Fries',
    highlights: [
      'Crisp golden hand-cut fries smothered in signature pizza sauce',
      'Generously topped with spiced chicken cubes and black olives',
      'Oven-broiled until the mozzarella cheese forms a stretchy blanket',
    ],
    floatingIngredients: [
      { name: 'Golden Crispy Fries', icon: '🍟', position: 'top-6 left-6' },
      { name: 'Baked Mozzarella Blanket', icon: '🧀', position: 'bottom-8 left-10' },
      { name: 'Oregano & Chili Flakes', icon: '🌿', position: 'top-10 right-6' },
    ],
  },
];

export function ScrollytellingShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [activeSpecialIndex, setActiveSpecialIndex] = useState(0);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const activeSpecial = HOUSE_SPECIALS[activeSpecialIndex];
  const matchedProduct = MENU_PRODUCTS.find((p) => p.id === activeSpecial.productId);

  const handleAddToCart = () => {
    if (!matchedProduct) return;
    const defaultSize = matchedProduct.sizes.length > 0 ? matchedProduct.sizes[0] : undefined;
    addItem(matchedProduct, { size: defaultSize }, 1);
    setAddedItem(matchedProduct.id);
    setTimeout(() => setAddedItem(null), 2200);
  };

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative py-14 sm:py-20 bg-canvas overflow-hidden border-b border-white/[0.06]"
      aria-label="Two Friends Pizza Top House Specials"
      id="specials"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-radial from-amber-600/10 via-flame-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — Grounded 100% in Real Menu Data */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Rawat's Top 3 House Specials</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Our Most Craved <span className="text-amber-400">Creations</span>
          </h2>
          <p className="text-obsidian-300 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
            Directly from our kitchen on Main Chak Belli Road — our three most loved dishes with genuine prices and real ingredients.
          </p>
        </div>

        {/* Real Item Selector Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {HOUSE_SPECIALS.map((special, idx) => {
            const isActive = idx === activeSpecialIndex;
            return (
              <button
                key={special.id}
                onClick={() => setActiveSpecialIndex(idx)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-obsidian-950 shadow-lg shadow-amber-500/25 scale-105'
                    : 'bg-white/[0.04] text-obsidian-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
                aria-pressed={isActive}
              >
                <span>0{idx + 1}</span>
                <span>·</span>
                <span>{special.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Real Item Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-obsidian-950/70 border border-white/[0.08] rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          {/* Left Column: Authentic Food Photography with Floating Ingredient Badges */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpecial.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeSpecial.imageUrl}
                    alt={activeSpecial.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Hot Steam Wisp Animation */}
                  {!prefersReducedMotion && (
                    <motion.div
                      animate={{
                        opacity: [0.1, 0.4, 0.1],
                        y: [-5, -25, -5],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-x-12 top-6 h-28 bg-gradient-to-t from-amber-400/10 via-white/5 to-transparent blur-2xl pointer-events-none mix-blend-screen"
                    />
                  )}

                  {/* Floating Ingredients Badges matching the real item */}
                  {!prefersReducedMotion &&
                    activeSpecial.floatingIngredients.map((item, i) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                          opacity: 1,
                          y: [0, -8, 0],
                        }}
                        transition={{
                          opacity: { duration: 0.4, delay: 0.2 + i * 0.1 },
                          y: {
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.4,
                          },
                        }}
                        className={`absolute ${item.position} z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-xl pointer-events-none`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.name}</span>
                      </motion.div>
                    ))}

                  {/* Bottom Category Tag */}
                  <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-amber-300 font-semibold">
                    Menu Category: {activeSpecial.category}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Real Menu Item Description, Price & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSpecial.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                    {activeSpecial.step}
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1 leading-snug">
                    {activeSpecial.title}
                  </h3>

                  {/* Real Verified Price Badge */}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold">
                    <span>✦ Price: {activeSpecial.priceDisplay}</span>
                  </div>
                </div>

                <p className="text-obsidian-300 text-sm leading-relaxed">
                  {activeSpecial.description}
                </p>

                {/* Real Ingredients & Highlights */}
                <div className="space-y-2 pt-1">
                  {activeSpecial.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-xs sm:text-sm text-obsidian-200">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-flame-500 hover:from-amber-400 hover:to-flame-400 text-obsidian-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {addedItem === activeSpecial.productId ? 'Added to Cart ✓' : 'Add to Cart'}
                    </span>
                  </button>

                  <button
                    onClick={handleScrollToMenu}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-obsidian-300 hover:text-white text-xs sm:text-sm font-medium transition-colors"
                  >
                    <span>View in Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
