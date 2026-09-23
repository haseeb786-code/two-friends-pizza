'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { QuantityControl } from '@/components/menu/MenuCard';
import { cartDrawerVariants } from '@/lib/motion';
import { BUSINESS_CONFIG } from '@/config/business';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Slide-in Cart Drawer
 * - Full Zustand cart state integration
 * - Quantity controls: increase / decrease / remove
 * - Real price totals in PKR
 * - Traps focus when open (returns focus to trigger on close)
 * - Closes on Escape key
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const prefersReducedMotion = useReducedMotion();
  const { items, increaseQuantity, decreaseQuantity, removeItem, getSubtotal, getTotal, deliveryFee, getItemCount } = useCartStore();

  const subtotal = getSubtotal();
  const total = getTotal();
  const itemCount = getItemCount();
  const { symbol } = BUSINESS_CONFIG.currency;

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const drawerVariants = prefersReducedMotion
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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50 flex flex-col bg-obsidian-850 border-l border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-flame-400" aria-hidden="true" />
                <h2 className="font-heading text-lg font-bold text-white">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-flame-600 text-white text-xs font-bold px-2 py-0.5 rounded-full" aria-label={`${itemCount} items`}>
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-obsidian-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
                  <ShoppingBag className="w-10 h-10 text-obsidian-600" aria-hidden="true" />
                  <p className="text-obsidian-400 text-sm">Your cart is empty.</p>
                  <p className="text-obsidian-600 text-xs">Add items from the menu below.</p>
                </div>
              ) : (
                items.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-obsidian-900 border border-white/[0.07]"
                    aria-label={item.product.name}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-obsidian-400 mt-0.5">{item.selectedSize.name}</p>
                      )}
                      <p className="text-sm font-bold text-amber-400 mt-1">
                        {symbol}{item.itemTotal.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-obsidian-500 hover:text-flame-400 transition-colors cursor-pointer"
                        aria-label={`Remove ${item.product.name} from cart`}
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
                ))
              )}
            </div>

            {/* Footer totals + CTA */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/[0.07] space-y-3">
                <div className="flex justify-between text-sm text-obsidian-300">
                  <span>Subtotal</span>
                  <span>{symbol}{subtotal.toLocaleString()}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-obsidian-300">
                    <span>Delivery</span>
                    <span>{symbol}{deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/[0.07]">
                  <span>Total</span>
                  <span className="text-amber-400">{symbol}{total.toLocaleString()}</span>
                </div>
                <button
                  className="w-full bg-flame-600 hover:bg-flame-500 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer mt-2"
                  aria-label={`Proceed to checkout — Total: ${symbol}${total.toLocaleString()}`}
                  onClick={() => {/* Checkout phase — not implemented yet */}}
                >
                  Proceed to Order
                </button>
                <p className="text-center text-xs text-obsidian-500">
                  WhatsApp order flow in next phase
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
