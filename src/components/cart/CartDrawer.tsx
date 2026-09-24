'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { QuantityControl } from '@/components/menu/MenuCard';
import { cartDrawerVariants } from '@/lib/motion';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEffect, useRef, useState } from 'react';
import { CheckoutModal } from './CheckoutModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Cart Drawer — Mobile-First
 * ──────────────────────────
 * Mobile: full-width slide-in from right.
 * Desktop: capped at 400px max-width.
 * Footer always visible with sticky total + CTA.
 * Safe area padding for notched phones.
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const prefersReducedMotion = useReducedMotion();
  const { items, increaseQuantity, decreaseQuantity, removeItem, getSubtotal, getTotal, deliveryFee, getItemCount } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const subtotal = getSubtotal();
  const total = getTotal();
  const itemCount = getItemCount();
  const { symbol } = BUSINESS_CONFIG.currency;

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the close button when drawer opens
      setTimeout(() => closeRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const drawerV = prefersReducedMotion
    ? { closed: { opacity: 0 }, open: { opacity: 1 } }
    : cartDrawerVariants;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            variants={drawerV}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 h-full w-full sm:max-w-[400px] z-50 flex flex-col bg-obsidian-950 border-l border-white/[0.06]"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 sm:px-5 h-14 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-obsidian-400" aria-hidden="true" />
                <h2 className="text-[15px] font-bold text-white">Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-white/10 text-obsidian-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] active:bg-white/[0.1] text-obsidian-400 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* ── Items ── */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
                  <ShoppingBag className="w-8 h-8 text-obsidian-800" aria-hidden="true" />
                  <p className="text-obsidian-500 text-[13px]">Your cart is empty</p>
                  <p className="text-obsidian-700 text-[11px]">Add items from the menu</p>
                </div>
              ) : (
                items.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                    aria-label={item.product.name}
                  >
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-semibold text-white truncate">{item.product.name}</p>
                        {item.isDeal && (
                          <span className="text-[8px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
                            Deal
                          </span>
                        )}
                      </div>
                      {item.selectedSize && (
                        <p className="text-[11px] text-obsidian-500 mt-px">{item.selectedSize.name}</p>
                      )}
                      {item.isDeal && item.specialInstructions && (
                        <p className="text-[10px] text-obsidian-400 mt-0.5 truncate leading-tight">
                          {item.specialInstructions}
                        </p>
                      )}
                      <p className="text-[13px] font-bold text-amber-400 mt-1 tabular-nums">
                        {symbol}{item.itemTotal.toLocaleString()}
                      </p>
                    </div>
                    {/* Controls */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-obsidian-600 active:text-flame-400 transition-colors cursor-pointer"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <QuantityControl
                        quantity={item.quantity}
                        onIncrease={() => increaseQuantity(item.id)}
                        onDecrease={() => decreaseQuantity(item.id)}
                      />
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* ── Footer ── */}
            {items.length > 0 && (
              <div className="px-4 sm:px-5 py-4 border-t border-white/[0.06] space-y-2 flex-shrink-0 pb-[calc(1rem+var(--safe-bottom))]">
                <div className="flex justify-between text-[13px] text-obsidian-400">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{symbol}{subtotal.toLocaleString()}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[13px] text-obsidian-400">
                    <span>Delivery</span>
                    <span className="tabular-nums">{symbol}{deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[15px] font-bold text-white pt-2 border-t border-white/[0.06]">
                  <span>Total</span>
                  <span className="text-amber-400 tabular-nums">{symbol}{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full bg-flame-600 hover:bg-flame-500 active:bg-flame-700 text-white font-semibold h-12 rounded-xl transition-colors duration-150 cursor-pointer mt-1 text-[14px]"
                  aria-label={`Proceed to checkout — Total: ${symbol}${total.toLocaleString()}`}
                >
                  Proceed to Order
                </button>
              </div>
            )}
          </motion.div>

          {/* Customer Details Checkout Modal */}
          <CheckoutModal
            isOpen={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
