'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  User,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Banknote,
  Bike,
  Store,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { BUSINESS_CONFIG } from '@/config/business';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const { items, getSubtotal, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const minOrder = BUSINESS_CONFIG.ordering.minOrderAmount;
  const isBelowMin = subtotal < minOrder;

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [address, setAddress] = useState('');
  const [distanceOption, setDistanceOption] = useState<'within5km' | 'beyond5km'>('within5km');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [instructions, setInstructions] = useState('');

  // Submission State
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  const deliveryFee =
    orderType === 'takeaway'
      ? 0
      : distanceOption === 'beyond5km'
      ? BUSINESS_CONFIG.ordering.delivery.beyondKmFee
      : 0;

  const total = subtotal + deliveryFee;
  const { symbol } = BUSINESS_CONFIG.currency;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your cart is empty. Please add items from the menu first.');
      return;
    }

    if (orderType === 'delivery' && isBelowMin) {
      setErrorMsg(
        `Minimum order amount for delivery is ${symbol}${minOrder.toLocaleString()}. Please add ${symbol}${(minOrder - subtotal).toLocaleString()} more.`
      );
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid phone or WhatsApp number (e.g. 0331-XXXXXXX).');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setErrorMsg('Please enter your delivery address and landmark.');
      return;
    }

    // Format WhatsApp message
    const formattedItems = items
      .map((item, index) => {
        const sizeStr = item.selectedSize ? ` (${item.selectedSize.name})` : '';
        const dealBadge = item.isDeal ? ' [DEAL]' : '';
        const itemLine = `${index + 1}. *${item.product.name}*${sizeStr}${dealBadge} x${item.quantity} — ${symbol}${item.itemTotal.toLocaleString()}`;
        const detailLine =
          item.isDeal && item.specialInstructions ? `   _${item.specialInstructions}_` : '';
        return detailLine ? `${itemLine}\n${detailLine}` : itemLine;
      })
      .join('\n');

    const paymentLabel =
      BUSINESS_CONFIG.ordering.paymentMethods.find((p) => p.id === paymentMethod)?.name ||
      paymentMethod;

    const deliveryNote =
      orderType === 'takeaway'
        ? '🛍️ Takeaway / Pickup'
        : distanceOption === 'within5km'
        ? '🛵 Free Delivery (Within 5km)'
        : `🛵 Delivery: ${symbol}${deliveryFee} (Beyond 5km)`;

    const text =
      `*NEW ORDER — TWO FRIENDS PIZZA* 🍕\n` +
      `---------------------------------\n` +
      `👤 *Customer:* ${name.trim()}\n` +
      `📞 *Phone:* ${phone.trim()}\n` +
      `📦 *Order Type:* ${orderType === 'delivery' ? 'Delivery' : 'Takeaway / Pickup'}\n` +
      (orderType === 'delivery' ? `📍 *Address:* ${address.trim()}\n` : '') +
      `💳 *Payment:* ${paymentLabel}\n` +
      (instructions.trim() ? `📝 *Note:* ${instructions.trim()}\n` : '') +
      `---------------------------------\n` +
      `📋 *Items Ordered:*\n` +
      `${formattedItems}\n` +
      `---------------------------------\n` +
      `💵 *Subtotal:* ${symbol}${subtotal.toLocaleString()}\n` +
      `🛵 *Delivery:* ${deliveryNote}\n` +
      `⭐ *TOTAL PAYABLE:* ${symbol}${total.toLocaleString()}\n` +
      `---------------------------------\n` +
      `_Sent via Two Friends Pizza Website_`;

    const rawPhone = BUSINESS_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
    const intlPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
    const waUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`;

    setGeneratedWhatsAppUrl(waUrl);
    setIsSuccess(true);

    // Open WhatsApp in new tab
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  }

  function handleReset() {
    setIsSuccess(false);
    clearCart();
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-modal-title"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-obsidian-950 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl z-10 my-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-obsidian-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Header */}
                <div>
                  <span className="text-[11px] font-bold text-flame-400 uppercase tracking-widest block">
                    Two Friends Pizza · Checkout
                  </span>
                  <h2
                    id="checkout-modal-title"
                    className="font-heading text-xl sm:text-2xl font-bold text-white mt-0.5"
                  >
                    Customer Details
                  </h2>
                  <p className="text-xs text-obsidian-400 mt-1">
                    Fill in your delivery info to send your order directly to our kitchen.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Minimum Order Warning */}
                {orderType === 'delivery' && isBelowMin && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-300">
                        Minimum Delivery Order: {symbol}{minOrder.toLocaleString()}
                      </p>
                      <p className="text-amber-200/80 mt-0.5">
                        Current subtotal is {symbol}{subtotal.toLocaleString()}. Please add {symbol}
                        {(minOrder - subtotal).toLocaleString()} more for delivery.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Order Type Switcher ── */}
                <div>
                  <label className="text-xs font-semibold text-obsidian-300 block mb-2">
                    Select Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={cn(
                        'flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                        orderType === 'delivery'
                          ? 'bg-white text-obsidian-950 border-white shadow-sm'
                          : 'bg-white/[0.03] text-obsidian-400 border-white/[0.08] hover:border-white/20'
                      )}
                    >
                      <Bike className="w-4 h-4" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={cn(
                        'flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                        orderType === 'takeaway'
                          ? 'bg-white text-obsidian-950 border-white shadow-sm'
                          : 'bg-white/[0.03] text-obsidian-400 border-white/[0.08] hover:border-white/20'
                      )}
                    >
                      <Store className="w-4 h-4" />
                      <span>Takeaway / Pickup</span>
                    </button>
                  </div>
                </div>

                {/* ── Name & Phone ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-obsidian-300 block mb-1.5">
                      Your Name <span className="text-flame-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-obsidian-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ali Khan"
                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-obsidian-300 block mb-1.5">
                      WhatsApp / Phone <span className="text-flame-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-obsidian-500 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0331-XXXXXXX"
                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Delivery Address & Distance ── */}
                {orderType === 'delivery' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-obsidian-300 block mb-1.5">
                        Delivery Address & Landmark <span className="text-flame-400">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-obsidian-500 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="House/Shop #, Street, Landmark, Rawat / Nearby"
                          className="w-full h-11 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Distance Option */}
                    <div>
                      <label className="text-xs font-semibold text-obsidian-300 block mb-1.5">
                        Distance Range from Store
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label
                          className={cn(
                            'flex flex-col p-2.5 rounded-xl border cursor-pointer transition-all',
                            distanceOption === 'within5km'
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                              : 'bg-white/[0.02] border-white/[0.06] text-obsidian-400'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">Within 5 km</span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                              FREE
                            </span>
                          </div>
                          <span className="text-[10px] text-obsidian-500 mt-1">
                            Rawat town & close radius
                          </span>
                          <input
                            type="radio"
                            name="distance"
                            value="within5km"
                            checked={distanceOption === 'within5km'}
                            onChange={() => setDistanceOption('within5km')}
                            className="hidden"
                          />
                        </label>

                        <label
                          className={cn(
                            'flex flex-col p-2.5 rounded-xl border cursor-pointer transition-all',
                            distanceOption === 'beyond5km'
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                              : 'bg-white/[0.02] border-white/[0.06] text-obsidian-400'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">Beyond 5 km</span>
                            <span className="text-[10px] text-obsidian-300 font-bold">
                              +₨100
                            </span>
                          </div>
                          <span className="text-[10px] text-obsidian-500 mt-1">
                            Nearby surrounding areas
                          </span>
                          <input
                            type="radio"
                            name="distance"
                            value="beyond5km"
                            checked={distanceOption === 'beyond5km'}
                            onChange={() => setDistanceOption('beyond5km')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Payment Method ── */}
                <div>
                  <label className="text-xs font-semibold text-obsidian-300 block mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BUSINESS_CONFIG.ordering.paymentMethods.map((pm) => {
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <label
                          key={pm.id}
                          className={cn(
                            'flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all',
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/40'
                              : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15'
                          )}
                        >
                          <div className="mt-0.5">
                            {pm.id === 'cod' ? (
                              <Banknote className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <CreditCard className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white leading-tight">
                              {pm.name}
                            </p>
                            <p className="text-[10px] text-obsidian-400 mt-0.5 leading-snug truncate">
                              {pm.detail}
                            </p>
                          </div>
                          <input
                            type="radio"
                            name="payment"
                            value={pm.id}
                            checked={isSelected}
                            onChange={() => setPaymentMethod(pm.id)}
                            className="hidden"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* ── Special Instructions ── */}
                <div>
                  <label className="text-xs font-semibold text-obsidian-300 block mb-1.5">
                    Special Note / Food Request (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-obsidian-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Extra garlic mayo, less spicy, call when outside"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* ── Price Summary ── */}
                <div className="pt-3 border-t border-white/[0.08] space-y-1.5 text-xs text-obsidian-400">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="text-white font-medium">
                      {symbol}{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-white font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        `${symbol}${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/[0.06]">
                    <span>Total Amount</span>
                    <span className="text-amber-400 text-base">
                      {symbol}{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* ── Submit Action ── */}
                <button
                  type="submit"
                  disabled={orderType === 'delivery' && isBelowMin}
                  className={cn(
                    'w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer',
                    orderType === 'delivery' && isBelowMin
                      ? 'bg-obsidian-800 text-obsidian-500 cursor-not-allowed'
                      : 'bg-flame-600 hover:bg-flame-500 active:bg-flame-700 text-white shadow-lg shadow-flame-950/50'
                  )}
                >
                  <span>Confirm Order via WhatsApp</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* ── Success Screen ── */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">Order Prepared!</h3>
                  <p className="text-xs text-obsidian-400 mt-1 max-w-sm mx-auto">
                    Your order details have been prepared for WhatsApp. If WhatsApp didn't open
                    automatically, click the button below:
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-obsidian-400">Order For:</span>
                    <span className="text-white font-semibold">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-obsidian-400">Phone:</span>
                    <span className="text-white font-semibold">{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-obsidian-400">Total Payable:</span>
                    <span className="text-amber-400 font-bold">
                      {symbol}{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href={generatedWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <span>Open in WhatsApp</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={handleReset}
                    className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-obsidian-300 text-xs font-semibold transition-colors"
                  >
                    Done / Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
