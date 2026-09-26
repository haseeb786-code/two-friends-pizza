'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/types/cart';

interface LastOrderData {
  orderId: string;
  items: CartItem[];
  total: number;
  date: string;
  customerName?: string;
}

export function DostiReorderBanner() {
  const [lastOrder, setLastOrder] = useState<LastOrderData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reordered, setReordered] = useState(false);
  const { reorderItems } = useCartStore();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tf_last_order');
      if (saved) {
        const parsed: LastOrderData = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setLastOrder(parsed);
          setIsVisible(true);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleReorder = () => {
    if (!lastOrder) return;
    reorderItems(lastOrder.items);
    setReordered(true);
    setTimeout(() => {
      setReordered(false);
      setIsVisible(false);
    }, 1800);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !lastOrder) return null;

  const itemsSummary = lastOrder.items
    .slice(0, 2)
    .map((i) => i.product.name)
    .join(', ') + (lastOrder.items.length > 2 ? ` + ${lastOrder.items.length - 2} more` : '');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
        className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 pt-4"
        aria-label="1-Click Dosti Repeat Order"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/80 via-obsidian-900 to-flame-950/80 border border-amber-500/30 p-3 sm:p-4 shadow-xl backdrop-blur-md">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Order info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Dosti 1-Click Re-Order
                  </span>
                  <span className="text-[10px] text-obsidian-400 font-mono">
                    #{lastOrder.orderId}
                  </span>
                </div>
                <p className="text-xs text-white mt-0.5">
                  Welcome back{lastOrder.customerName ? `, ${lastOrder.customerName}` : ''}! Craving your last order?{' '}
                  <span className="text-obsidian-300 font-medium">({itemsSummary})</span> —{' '}
                  <strong className="text-amber-400">₨{lastOrder.total.toLocaleString()}</strong>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={handleReorder}
                disabled={reordered}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-obsidian-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                {reordered ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>1-Click Re-Order</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-obsidian-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
