'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, HeartHandshake, PhoneCall, LucideIcon } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Pillar {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  highlight: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Zap,
    badge: 'Super Fast',
    title: 'Lightning Delivery',
    description: 'Free delivery within 5km in Rawat & Chota Mera. Arrives oven-fresh and steaming hot.',
    highlight: 'Free under 5km · ₨100 after',
  },
  {
    icon: ShieldCheck,
    badge: 'Pure Quality',
    title: '100% Real Mozzarella',
    description: 'Generously loaded cheese pull with dough freshly kneaded each morning. No compromises.',
    highlight: 'Daily Fresh Dough',
  },
  {
    icon: HeartHandshake,
    badge: 'Born in Rawat',
    title: 'Dosti Ka Slice',
    description: 'Crafted for friend gatherings, hostel late-nights, and family feasts with generous portions.',
    highlight: '14 Exclusive Combos',
  },
  {
    icon: PhoneCall,
    badge: 'Local Dispatch',
    title: '1-Click WhatsApp & COD',
    description: 'Direct order dispatch to our counter. Cash on Delivery, JazzCash, and EasyPaisa accepted.',
    highlight: 'JazzCash · EasyPaisa · COD',
  },
];

export function TrustPillars() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative z-20 py-8 sm:py-12 bg-obsidian-950/80 border-y border-white/[0.06] backdrop-blur-md"
      aria-label="Two Friends Pizza Quality Pillars"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent p-5 border border-white/[0.08] hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
              >
                {/* Top row: Icon + Badge */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] text-obsidian-300 border border-white/[0.06]">
                    {pillar.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-obsidian-400 leading-relaxed mb-3">
                  {pillar.description}
                </p>

                {/* Bottom Highlight Tag */}
                <div className="inline-flex items-center text-[11px] font-semibold text-amber-400/90 pt-1 border-t border-white/[0.04] w-full">
                  <span>✦ {pillar.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
