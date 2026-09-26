'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Sparkles, CheckCircle2, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { QuantityControl } from '@/components/menu/MenuCard';
import { cartDrawerVariants } from '@/lib/motion';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEffect, useRef, useState } from 'react';
import { CheckoutModal } from './CheckoutModal';
import { MENU_PRODUCTS } from '@/data/menu';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_ADD_IDS = ['fries-regular', 'shawarma-chicken', 'fries-large'];

/**
 * Cart Drawer — Mobile-First with Free Delivery Progress & Quick-Add
 * ─────────────────────────────────────────────────────────────────
 * Mobile: full-width slide-in from right.
 * Desktop: capped at 400px max-width.
 * Top-Up Progress Bar toward ₨1,000 free delivery threshold.
 * Quick-add side suggestions to boost AOV and help users unlock free delivery.
 * Footer always visible with sticky total + CTA.
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const prefersReducedMotion = useReducedMotion();
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    addItem,
    getSubtotal,
    getTotal,
    deliveryFee,
    getItemCount,
  } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const subtotal = getSubtotal();
  const total = getTotal();
  const itemCount = getItemCount();
  const { symbol } = BUSINESS_CONFIG.currency;
  const minDeliveryOrder = BUSINESS_CONFIG.ordering.minOrderAmount; // 1000

  const progressPct = Math.min(100, Math.round((subtotal / minDeliveryOrder) * 100));
  const diffToFree = Math.max(0, minDeliveryOrder - subtotal);

  const quickAddItems = MENU_PRODUCTS.filter((p) => QUICK_ADD_IDS.includes(p.id));

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
      setTimeout(() => closeRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
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
            className="fixed right-0 top-0 h-full w-full sm:max-w-[420px] z-50 flex flex-col bg-obsidian-950 border-l border-white/[0.08] shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 sm:px-5 h-14 border-b border-white/[0.06] flex-shrink-0 bg-obsidian-900/60 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <h2 className="text-[15px] font-bold text-white">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] active:bg-white/[0.1] text-obsidian-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* ── Minimum Order / Free Delivery Progress Bar ── */}
            {items.length > 0 && (
              <div className="px-4 sm:px-5 py-3 border-b border-white/[0.06] bg-obsidian-900/30">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 text-obsidian-300 font-medium">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    {subtotal >= minDeliveryOrder ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> FREE 5km Delivery Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-amber-400">{symbol}{diffToFree.toLocaleString()}</strong> more for FREE delivery
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-mono text-obsidian-400">
                    {progressPct}%
                  </span>
                </div>

                {/* Progress track */}
                <div className="w-full h-2 rounded-full bg-obsidian-800 overflow-hidden relative">
                  <motion.div
                    className={`h-full rounded-full transition-all duration-500 ${
                      subtotal >= minDeliveryOrder
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-amber-500 to-flame-500'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* ── Cart Items List ── */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-2.5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-obsidian-500 mb-2">
                    <ShoppingBag className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <p className="text-white font-semibold text-sm">Your cart is empty</p>
                  <p className="text-obsidian-400 text-xs max-w-xs">
                    Explore our loaded pizzas, burgers, shawarmas, and combo deals on Main Chak Belli Road.
                  </p>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/10 transition-colors"
                      aria-label={item.product.name}
                    >
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-semibold text-white truncate">
                            {item.product.name}
                          </p>
                          {item.isDeal && (
                            <span className="text-[8px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
                              Deal
                            </span>
                          )}
                        </div>
                        {item.selectedSize && (
                          <p className="text-[11px] text-obsidian-400 mt-px">
                            {item.selectedSize.name}
                          </p>
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
                          className="w-7 h-7 flex items-center justify-center rounded-md text-obsidian-500 hover:text-red-400 transition-colors cursor-pointer"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <QuantityControl
                          quantity={item.quantity}
                          onIncrease={() => increaseQuantity(item.id)}
                          onDecrease={() => decreaseQuantity(item.id)}
                        />
                      </div>
                    </article>
                  ))}

                  {/* ── Quick Add / Top-Up Recommendations ── */}
                  {subtotal < minDeliveryOrder && quickAddItems.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <h4 className="text-xs font-semibold text-obsidian-300">
                          Popular Add-Ons to Reach ₨1,000:
                        </h4>
                      </div>
                      <div className="space-y-1.5">
                        {quickAddItems.map((prod) => (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="text-xs font-medium text-white truncate">{prod.name}</p>
                              <p className="text-[11px] text-amber-400 font-bold">
                                {symbol}{prod.basePrice.toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => addItem(prod, undefined, 1)}
                              className="px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Footer ── */}
            {items.length > 0 && (
              <div className="px-4 sm:px-5 py-4 border-t border-white/[0.08] space-y-2 flex-shrink-0 bg-obsidian-900/80 backdrop-blur-md pb-[calc(1rem+var(--safe-bottom))]">
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
                  <span>Total Payable</span>
                  <span className="text-amber-400 tabular-nums">
                    {symbol}{total.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full bg-flame-600 hover:bg-flame-500 active:bg-flame-700 text-white font-semibold h-12 rounded-xl transition-all duration-150 cursor-pointer mt-1 text-[14px] shadow-lg shadow-flame-950/50 flex items-center justify-center gap-2"
                  aria-label={`Proceed to checkout — Total: ${symbol}${total.toLocaleString()}`}
                >
                  <span>Proceed to Checkout</span>
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
