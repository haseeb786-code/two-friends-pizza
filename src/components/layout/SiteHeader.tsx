'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Phone, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Premium Sticky Header
 * ─────────────────────
 * Mobile-first: Compact 56px height on mobile, 64px on sm+.
 * Brand mark always visible. Cart badge with spring animation.
 * Phone link visible on ≥sm. Hamburger on <md only.
 * Glass-effect bg with subtle border — no heavy blur.
 */
export function SiteHeader() {
  const prefersReducedMotion = useReducedMotion();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { name, contact } = BUSINESS_CONFIG;

  // Track scroll to intensify header bg
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 border-b ${
          scrolled
            ? 'bg-obsidian-950/95 backdrop-blur-lg border-white/[0.08]'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">

          {/* ── Brand ── */}
          <a
            href="#"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg -ml-1 pl-1"
            aria-label={`${name} — Home`}
          >
            <span
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-flame-600 flex items-center justify-center text-white font-black text-xs sm:text-sm select-none shadow-sm"
              aria-hidden="true"
            >
              TFP
            </span>
            <div className="min-w-0">
              <span className="font-heading text-sm sm:text-[15px] font-bold text-white leading-none block truncate">
                {name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-400/80 font-medium tracking-wider uppercase block mt-px">
                {BUSINESS_CONFIG.tagline}
              </span>
            </div>
          </a>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Site navigation">
            {[
              { label: 'Menu', href: '#menu' },
              { label: 'Deals', href: '#menu-section-deals' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-[13px] text-obsidian-400 hover:text-white rounded-lg transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Phone link — hidden on mobile */}
            <a
              href={`tel:${contact.orderPhone.replace(/-/g, '')}`}
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 text-[11px] font-semibold text-obsidian-400 hover:text-white border border-white/[0.08] hover:border-white/[0.15] rounded-lg transition-all duration-150"
              aria-label={`Call to order: ${contact.orderPhone}`}
            >
              <Phone className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              <span className="hidden lg:inline">{contact.orderPhone}</span>
              <span className="lg:hidden">Order</span>
            </a>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-flame-600 hover:bg-flame-500 active:bg-flame-700 text-white transition-colors duration-150 cursor-pointer"
              aria-label={`Open cart${itemCount > 0 ? ` — ${itemCount} item${itemCount !== 1 ? 's' : ''}` : ''}`}
            >
              <ShoppingBag className="w-[18px] h-[18px]" aria-hidden="true" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 22 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-amber-500 text-obsidian-950 text-[10px] font-black flex items-center justify-center px-1 leading-none"
                    aria-hidden="true"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.06] active:bg-white/[0.12] text-obsidian-300 transition-colors duration-150 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? (
                <X className="w-[18px] h-[18px]" aria-hidden="true" />
              ) : (
                <Menu className="w-[18px] h-[18px]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden border-t border-white/[0.06] bg-obsidian-950/98 backdrop-blur-lg"
              aria-label="Mobile navigation"
            >
              <div className="px-4 py-2 space-y-0.5">
                {[
                  { label: 'Menu', href: '#menu' },
                  { label: 'Deals', href: '#menu-section-deals' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-[14px] text-obsidian-300 active:text-white active:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={`tel:${contact.orderPhone.replace(/-/g, '')}`}
                  className="flex items-center gap-2 px-3 py-2.5 text-[14px] font-semibold text-flame-400"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  Order Now: {contact.orderPhone}
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
