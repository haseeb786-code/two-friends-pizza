'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Users, MapPin, Clock, Phone, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function StorySection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative py-16 sm:py-24 bg-obsidian-950/60 overflow-hidden border-t border-white/[0.06]"
      aria-label="About Two Friends Pizza"
      id="about"
    >
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-radial from-amber-600/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Visual Collage with Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85"
                alt="Friends dining together at Two Friends Pizza Rawat"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Floating Story Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15">
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/10">
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-amber-400">100%</span>
                    <span className="text-[10px] sm:text-xs text-obsidian-400 font-medium">Real Mozzarella</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-white">32+</span>
                    <span className="text-[10px] sm:text-xs text-obsidian-400 font-medium">Fresh Items</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-flame-400">14</span>
                    <span className="text-[10px] sm:text-xs text-obsidian-400 font-medium">Dosti Combos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Brand Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-flame-500/10 border border-flame-500/20 text-flame-400 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-flame-400" aria-hidden="true" />
              <span>The Story Behind The Slice</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Crafted in Rawat for <br />
              <span className="text-amber-400">Unforgettable Gatherings</span>
            </h2>

            <p className="text-obsidian-300 text-sm sm:text-base leading-relaxed">
              Two Friends Pizza was founded on a simple belief: the best memories with friends happen around a piping-hot, generously topped pizza. We set out to bring Rawat the crust it truly deserved — crisp on the outside, soft on the inside, and never skimping on real mozzarella cheese.
            </p>

            <p className="text-obsidian-400 text-xs sm:text-sm leading-relaxed">
              Whether you are grabbing a quick student zinger after class, celebrating with our Crown Crust feast, or ordering late-night delivery along Main Chak Belli Road, our kitchen bakes every single order fresh to your name.
            </p>

            {/* Quick Details Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Chak Belli Road, Rawat</h4>
                  <p className="text-[11px] text-obsidian-400 mt-0.5">Al-Haaj Afridi Market, Chota Mera</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Open Daily</h4>
                  <p className="text-[11px] text-obsidian-400 mt-0.5">12:00 PM – Late Night Delivery</p>
                </div>
              </div>
            </div>

            {/* Direct Calling Hotline */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={`tel:${BUSINESS_CONFIG.contact.orderPhone.replace(/-/g, '')}`}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                <Phone className="w-4 h-4" />
                <span>Call to Order: {BUSINESS_CONFIG.contact.orderPhone}</span>
              </a>

              <a
                href={`https://wa.me/92${BUSINESS_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '').slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-colors"
              >
                <span>WhatsApp Dispatch</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
