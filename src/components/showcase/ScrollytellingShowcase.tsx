'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Check, ArrowRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StoryStage {
  id: string;
  step: string;
  badge: string;
  title: string;
  subtitle: string;
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

const STORY_STAGES: StoryStage[] = [
  {
    id: 'cheese-pull',
    step: '01 / The Melt',
    badge: 'Golden Mozzarella',
    title: 'The Legendary Cheese Pull',
    subtitle: '100% pure mozzarella loaded to the crust edge',
    description:
      'Every Two Friends pizza is blanketed with premium stringy mozzarella that melts into an irresistible, piping-hot cheese pull with every slice you take.',
    imageUrl:
      'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Irresistible stretchy mozzarella cheese pull on hot pizza slice',
    highlights: [
      'Pure stretchy mozzarella — no synthetic blends',
      'Loaded Crown Crust option with cheese-stuffed pockets',
      'Baked piping hot to 400°C for golden bubbly blisters',
    ],
    floatingIngredients: [
      { name: 'Fresh Mozzarella', icon: '🧀', position: 'top-6 left-6' },
      { name: 'Oregano Dust', icon: '🌿', position: 'bottom-10 right-8' },
      { name: 'Crushed Red Pepper', icon: '🌶️', position: 'top-12 right-6' },
    ],
  },
  {
    id: 'fresh-toppings',
    step: '02 / Sourced Fresh',
    badge: 'Real Fast-Food Craft',
    title: 'Explosive Fresh Ingredients',
    subtitle: 'Marinated chicken tikka, crisp vegetables & house sauce',
    description:
      'We never use frozen pre-packaged toppings. Chicken is marinated daily in our signature spicy tikka and fajita spice blends, paired with hand-cut bell peppers and black olives.',
    imageUrl:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Freshly diced chicken, bell peppers, tomatoes and olives on artisan pizza dough',
    highlights: [
      'Locally marinated tender chicken tikka & malai chunks',
      'Fresh crisp green bell peppers, mushrooms & black olives',
      'Slow-simmered garlic herb tomato sauce base',
    ],
    floatingIngredients: [
      { name: 'Marinated Tikka Boti', icon: '🍗', position: 'top-8 left-8' },
      { name: 'Garden Bell Peppers', icon: '🫑', position: 'bottom-8 left-10' },
      { name: 'Sliced Black Olives', icon: '🫒', position: 'top-8 right-8' },
      { name: 'Spicy Jalapeños', icon: '🌶️', position: 'bottom-12 right-8' },
    ],
  },
  {
    id: 'golden-crust',
    step: '03 / Hand-Kneaded',
    badge: 'Crispy & Fluffy',
    title: 'The Stone-Oven Golden Crust',
    subtitle: 'Kneaded fresh every morning in Rawat',
    description:
      'The foundation of every great pizza is the dough. We knead our dough in small batches daily, letting it ferment naturally to achieve that signature light, airy center and crunchy golden rim.',
    imageUrl:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Freshly baked pizza crust straight from the blazing oven',
    highlights: [
      'Daily freshly kneaded dough — never frozen discs',
      'Choice of Pan, Crown Crust, and Kabab Crust styles',
      'Golden olive oil brushed rim with sesame sprinkles',
    ],
    floatingIngredients: [
      { name: 'Fresh Daily Dough', icon: '🥖', position: 'top-6 left-6' },
      { name: '400°C High Heat', icon: '🔥', position: 'bottom-8 left-10' },
      { name: 'Extra Virgin Glaze', icon: '🫒', position: 'top-10 right-6' },
    ],
  },
];

export function ScrollytellingShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = STORY_STAGES[activeStageIndex];

  const handleOrderScroll = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative py-16 sm:py-24 bg-canvas overflow-hidden border-b border-white/[0.06]"
      aria-label="Two Friends Pizza Craft Showcase"
      id="experience"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-radial from-amber-600/10 via-flame-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>The $10K Sensory Experience</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Anatomy of the <span className="text-amber-400">Perfect Slice</span>
          </h2>
          <p className="text-obsidian-300 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            See what makes Two Friends Pizza the most crave-worthy slice in Rawat. Real cheese, fresh daily dough, and unapologetic portions.
          </p>
        </div>

        {/* Stage Selector Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {STORY_STAGES.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-obsidian-950 shadow-lg shadow-amber-500/25 scale-105'
                    : 'bg-white/[0.04] text-obsidian-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
                aria-pressed={isActive}
              >
                <span>{stage.step.split(' / ')[0]}</span>
                <span>·</span>
                <span>{stage.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Stage Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-obsidian-950/70 border border-white/[0.08] rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          {/* Left Column: Visual with Floating Ingredient Badges */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeStage.imageUrl}
                    alt={activeStage.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Hot Steam Wisp Animation above image */}
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

                  {/* Floating Ingredients Badges (Exploding Ingredients Effect from Video 2) */}
                  {!prefersReducedMotion &&
                    activeStage.floatingIngredients.map((item, i) => (
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
                        className={`absolute ${item.position} z-20 flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-xl pointer-events-none`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.name}</span>
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Stage Description & Highlights */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-5"
              >
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                    {activeStage.step}
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1 leading-snug">
                    {activeStage.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-amber-200/90 mt-1">
                    {activeStage.subtitle}
                  </p>
                </div>

                <p className="text-obsidian-300 text-sm leading-relaxed">
                  {activeStage.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5 pt-2">
                  {activeStage.highlights.map((highlight) => (
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

                {/* CTA Action */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={handleOrderScroll}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-flame-500 hover:from-amber-400 hover:to-flame-400 text-obsidian-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-amber-500/20"
                  >
                    <span>Taste This In Our Pizzas</span>
                    <ArrowRight className="w-4 h-4" />
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
