'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Heart, ArrowUp, Navigation } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/config/business';

export function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanOrderPhone = BUSINESS_CONFIG.contact.orderPhone.replace(/-/g, '');
  const cleanFeedbackPhone = BUSINESS_CONFIG.contact.feedbackPhone.replace(/-/g, '');
  const whatsappUrl = `https://wa.me/92${BUSINESS_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '').slice(1)}`;

  return (
    <footer className="relative bg-obsidian-950 text-white overflow-hidden border-t border-white/[0.08]" aria-label="Site footer">
      {/* ── 1. High-Impact Closing CTA Banner (Inspired by Video 2) ── */}
      <div className="relative border-b border-white/[0.08] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-amber-600/[0.08] via-transparent to-transparent">
        {/* Glowing atmospheric orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-radial from-amber-500/15 via-flame-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <span>🔥 Fast & Fresh in Rawat</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready for the <span className="text-amber-400">Best Slice in Town?</span>
          </h2>

          <p className="text-obsidian-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Order online in seconds or dispatch via WhatsApp. Piping-hot pizzas, juicy burgers, and deals ready for your table.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <a
              href="#menu"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-flame-500 hover:from-amber-400 hover:to-flame-400 text-obsidian-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all duration-200"
            >
              Order From Menu Now
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-xl shadow-[#25D366]/20 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp: {BUSINESS_CONFIG.contact.whatsapp}</span>
            </a>

            <a
              href={`tel:${cleanOrderPhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-medium text-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Hotline</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. Information Columns ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Concept */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-black tracking-tight text-white font-heading">
                Two Friends <span className="text-amber-400">Pizza</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-obsidian-400 leading-relaxed max-w-sm">
              Dosti Ka Slice. Real mozzarella cheese, freshly kneaded dough daily, and generous portions crafted for gatherings, late-night studies, and family celebrations in Rawat.
            </p>

            {/* Delivery Terms */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Delivery Policy</span>
              </div>
              <p className="text-[11px] text-obsidian-300">
                • <strong>Free delivery</strong> within 5km in Rawat & Chota Mera
              </p>
              <p className="text-[11px] text-obsidian-300">
                • ₨100 delivery fee beyond 5km
              </p>
              <p className="text-[11px] text-obsidian-300">
                • Minimum order for delivery: <strong>₨1,000</strong>
              </p>
            </div>
          </div>

          {/* Quick Menu Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-obsidian-300">
              Menu Categories
            </h4>
            <ul className="space-y-2 text-xs text-obsidian-400">
              <li><a href="#menu-section-pizza" className="hover:text-amber-400 transition-colors">Signature Pizzas</a></li>
              <li><a href="#menu-section-pizza-local" className="hover:text-amber-400 transition-colors">Somewhat Local</a></li>
              <li><a href="#menu-section-burger" className="hover:text-amber-400 transition-colors">Burger Station</a></li>
              <li><a href="#menu-section-shawarma" className="hover:text-amber-400 transition-colors">Shawarma Station</a></li>
              <li><a href="#menu-section-fries" className="hover:text-amber-400 transition-colors">Fries Station</a></li>
              <li><a href="#menu-section-pasta" className="hover:text-amber-400 transition-colors">Pasta Station</a></li>
              <li><a href="#menu-section-crispy" className="hover:text-amber-400 transition-colors">Crispy Chicken</a></li>
              <li><a href="#menu-section-deals" className="hover:text-amber-400 transition-colors">Combo Deals</a></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-obsidian-300">
              Contact & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-obsidian-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Opening Hours</p>
                  <p className="text-obsidian-400 text-[11px]">12:00 PM – Late Night (Mon–Sun)</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Order Line / WhatsApp</p>
                  <a href={`tel:${cleanOrderPhone}`} className="text-amber-400 text-[11px] hover:underline">
                    {BUSINESS_CONFIG.contact.orderPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-flame-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Feedback & Owner Channel</p>
                  <a href={`tel:${cleanFeedbackPhone}`} className="text-obsidian-400 text-[11px] hover:underline">
                    {BUSINESS_CONFIG.contact.feedbackPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Directions */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-obsidian-300">
              Find Our Kitchen
            </h4>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
              <div className="flex items-start gap-2 text-xs text-obsidian-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Address</p>
                  <p className="text-[11px] text-obsidian-400 leading-relaxed">
                    {BUSINESS_CONFIG.location.address}
                  </p>
                </div>
              </div>

              <a
                href={BUSINESS_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold hover:underline"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
            </div>

            {/* Payment Methods */}
            <div className="pt-1">
              <p className="text-[11px] font-semibold text-obsidian-400 mb-2">Accepted Payment Methods:</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-white font-medium">Cash on Delivery</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#9A1B2F]/30 border border-[#9A1B2F]/60 text-red-200 font-medium">JazzCash (0331-0479696)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00A859]/30 border border-[#00A859]/60 text-green-200 font-medium">EasyPaisa (0331-0479696)</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── 3. Bottom Bar ── */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-obsidian-500">
          <p>
            © {new Date().getFullYear()} Two Friends Pizza. All rights reserved. Crafted for Rawat with love.
          </p>
          <div className="flex items-center gap-4">
            <span>Dosti Ka Slice</span>
            <span>·</span>
            <Link
              href="/admin"
              className="text-obsidian-500 hover:text-amber-400 transition-colors"
            >
              Kitchen & Order Admin
            </Link>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
