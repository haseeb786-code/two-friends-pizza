'use client';

import { useState } from 'react';
import { ShoppingBag, Phone, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Sticky Site Header
 * - Logo / brand name
 * - Order Now phone link (orderPhone)
 * - Cart icon with live item count badge
 * - CartDrawer integration
 * - Responsive: hamburger on mobile (nav only — no page routing yet)
 */
export function SiteHeader() {
  const prefersReducedMotion = useReducedMotion();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  const { name, contact } = BUSINESS_CONFIG;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-obsidian-950/90 backdrop-blur-md border-b border-white/[0.07]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-[4.5rem] flex items-center justify-between gap-4">

          {/* Brand */}
          <a
            href="#"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
            aria-label={`${name} — Home`}
          >
            <span
              className="w-9 h-9 rounded-xl bg-flame-600 flex items-center justify-center text-white font-black text-sm select-none"
              aria-hidden="true"
            >
              TFP
            </span>
            <div className="hidden sm:block">
              <span className="font-heading text-base font-bold text-white leading-tight block">
                {name}
              </span>
              <span className="text-[10px] text-amber-400 font-medium tracking-wide">
                {BUSINESS_CONFIG.tagline}
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Site navigation">
            {[
              { label: 'Menu', href: '#menu' },
              { label: 'Deals', href: '#menu-section-deals' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm text-obsidian-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Order Now phone link */}
            <a
              href={`tel:${contact.orderPhone.replace(/-/g, '')}`}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-obsidian-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all"
              aria-label={`Call to order: ${contact.orderPhone}`}
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              {contact.orderPhone}
            </a>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-flame-600 hover:bg-flame-500 text-white transition-colors cursor-pointer"
              aria-label={`Open cart${itemCount > 0 ? ` — ${itemCount} item${itemCount !== 1 ? 's' : ''}` : ''}`}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-obsidian-950 text-[10px] font-black flex items-center justify-center"
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
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-white transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="md:hidden overflow-hidden border-t border-white/[0.07] bg-obsidian-950/98"
              aria-label="Mobile navigation"
            >
              <div className="px-4 py-3 space-y-1">
                {[
                  { label: 'Menu', href: '#menu' },
                  { label: 'Deals', href: '#menu-section-deals' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-obsidian-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={`tel:${contact.orderPhone.replace(/-/g, '')}`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-flame-400 hover:text-flame-300 transition-colors"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  Order: {contact.orderPhone}
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer (portal-style — outside header) */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
