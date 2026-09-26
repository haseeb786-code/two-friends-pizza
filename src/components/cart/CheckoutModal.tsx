'use client';

import React, { useState, useEffect } from 'react';
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
  Tag,
  Loader2,
  Check,
  Building,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { BUSINESS_CONFIG } from '@/config/business';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RAWAT_SECTORS = [
  'Main Chak Belli Road',
  'Rawat Bazaar & Main Chowk',
  'Chota Mera (Store Radius)',
  'Al-Haaj Afridi Market Area',
  'GT Road Corridor / Rawat Bus Stand',
  'DHA Phase 4 / Sector M & Surrounding',
  'Bahria Town Phase 8 Extension',
  'Mohra Chhachh & New Metro',
  'Other (Specify in Address)',
];

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
  const [sector, setSector] = useState(RAWAT_SECTORS[0]);
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [distanceOption, setDistanceOption] = useState<'within5km' | 'beyond5km'>('within5km');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [instructions, setInstructions] = useState('');

  // Coupon / Promo Code State
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType: string;
    discountValue: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  // Pre-fill returning customer details from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tf_customer_info');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.name) setName(parsed.name);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.sector && RAWAT_SECTORS.includes(parsed.sector)) setSector(parsed.sector);
          if (parsed.address) setAddress(parsed.address);
          if (parsed.landmark) setLandmark(parsed.landmark);
        }
      } catch (e) {
        // Ignore JSON error
      }
    }
  }, []);

  const deliveryFee =
    orderType === 'takeaway'
      ? 0
      : distanceOption === 'beyond5km'
      ? BUSINESS_CONFIG.ordering.delivery.beyondKmFee
      : 0;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);
  const { symbol } = BUSINESS_CONFIG.currency;

  // Validate and apply promo code
  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate',
          code: couponInput.trim(),
          subtotal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponSuccess(`Code ${data.coupon.code} applied! -${symbol}${data.coupon.discountAmount.toLocaleString()}`);
      }
    } catch (err) {
      setCouponError('Could not validate coupon. Check connection.');
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  }

  async function handleSubmit(e: React.FormEvent) {
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
      setErrorMsg('Please enter your delivery street/house address.');
      return;
    }

    setIsSubmitting(true);

    let assignedOrderId = `TF-${Math.floor(1000 + Math.random() * 9000)}`;

    // Prepare payload for permanent DB persistence
    const orderPayload = {
      customer_name: name.trim(),
      phone: phone.trim(),
      order_type: orderType,
      address: address.trim(),
      sector: sector,
      landmark: landmark.trim(),
      payment_method: paymentMethod,
      subtotal,
      delivery_fee: deliveryFee,
      discount: discountAmount,
      total,
      notes: instructions.trim(),
      coupon_code: appliedCoupon ? appliedCoupon.code : '',
      items: items.map((item) => ({
        id: item.productId,
        name: item.product.name,
        size: item.selectedSize?.name || null,
        isDeal: item.isDeal,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        itemTotal: item.itemTotal,
        instructions: item.specialInstructions || null,
      })),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const resData = await res.json();
      if (res.ok && resData.orderId) {
        assignedOrderId = resData.orderId;
      }
    } catch (err) {
      console.warn('Order DB sync offline, proceeding with client order ID', err);
    }

    setCreatedOrderId(assignedOrderId);

    // Save customer details in localStorage for future 1-click checkout
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'tf_customer_info',
          JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            sector,
            address: address.trim(),
            landmark: landmark.trim(),
          })
        );

        localStorage.setItem(
          'tf_last_order',
          JSON.stringify({
            orderId: assignedOrderId,
            items,
            total,
            date: new Date().toISOString(),
            customerName: name.trim(),
          })
        );
      } catch (e) {
        // ignore
      }
    }

    // Format WhatsApp message with permanent Order ID and Rawat landmark
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
        ? '🛍️ Takeaway / Pickup at Store'
        : distanceOption === 'within5km'
        ? '🛵 Free Delivery (Within 5km)'
        : `🛵 Delivery: ${symbol}${deliveryFee} (Beyond 5km)`;

    const text =
      `*NEW ORDER #${assignedOrderId} — TWO FRIENDS PIZZA* 🍕\n` +
      `---------------------------------\n` +
      `🆔 *Order ID:* #${assignedOrderId}\n` +
      `👤 *Customer:* ${name.trim()}\n` +
      `📞 *Phone:* ${phone.trim()}\n` +
      `📦 *Order Type:* ${orderType === 'delivery' ? 'Delivery' : 'Takeaway / Pickup'}\n` +
      `📍 *Area/Sector:* ${sector}\n` +
      (orderType === 'delivery' ? `🏠 *Address:* ${address.trim()}\n` : '') +
      (landmark.trim() ? `🏛️ *Landmark:* ${landmark.trim()}\n` : '') +
      `💳 *Payment:* ${paymentLabel}\n` +
      (appliedCoupon ? `🎟️ *Promo Code:* ${appliedCoupon.code} (-${symbol}${appliedCoupon.discountAmount.toLocaleString()})\n` : '') +
      (instructions.trim() ? `📝 *Note:* ${instructions.trim()}\n` : '') +
      `---------------------------------\n` +
      `📋 *Items Ordered:*\n` +
      `${formattedItems}\n` +
      `---------------------------------\n` +
      `💵 *Subtotal:* ${symbol}${subtotal.toLocaleString()}\n` +
      (appliedCoupon ? `🎟️ *Discount:* -${symbol}${discountAmount.toLocaleString()}\n` : '') +
      `🛵 *Delivery:* ${deliveryNote}\n` +
      `⭐ *TOTAL PAYABLE:* ${symbol}${total.toLocaleString()}\n` +
      `---------------------------------\n` +
      `_Sent via Two Friends Pizza Website — Verified Live Kitchen Order_`;

    const rawPhone = BUSINESS_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
    const intlPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
    const waUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`;

    setGeneratedWhatsAppUrl(waUrl);
    setIsSubmitting(false);
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
            className="relative w-full max-w-lg bg-obsidian-950 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl z-10 my-auto max-h-[92vh] overflow-y-auto"
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header */}
                <div>
                  <span className="text-[11px] font-bold text-flame-400 uppercase tracking-widest block">
                    Two Friends Pizza · Checkout
                  </span>
                  <h2
                    id="checkout-modal-title"
                    className="font-heading text-xl sm:text-2xl font-bold text-white mt-0.5"
                  >
                    Delivery & Customer Details
                  </h2>
                  <p className="text-xs text-obsidian-400 mt-0.5">
                    Fast WhatsApp dispatch & live kitchen sync for Rawat & nearby areas.
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
                  <label className="text-xs font-semibold text-obsidian-300 block mb-1.5">
                    Select Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={cn(
                        'flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
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
                        'flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
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
                    <label className="text-xs font-semibold text-obsidian-300 block mb-1">
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
                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-obsidian-300 block mb-1">
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
                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Rawat Delivery Details ── */}
                {orderType === 'delivery' && (
                  <div className="space-y-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    {/* Area / Sector Select */}
                    <div>
                      <label className="text-xs font-semibold text-obsidian-300 block mb-1">
                        Sector / Area in Rawat <span className="text-flame-400">*</span>
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-obsidian-500 absolute left-3 top-3" />
                        <select
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          className="w-full h-10 pl-9 pr-8 rounded-xl bg-obsidian-900 border border-white/[0.1] text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer appearance-none"
                        >
                          {RAWAT_SECTORS.map((sec) => (
                            <option key={sec} value={sec} className="bg-obsidian-900 text-white">
                              {sec}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="text-xs font-semibold text-obsidian-300 block mb-1">
                        Street Address / House / Shop # <span className="text-flame-400">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-obsidian-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. House 14, Street 2, Main Chak Belli Road"
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Landmark (Rawat specific) */}
                    <div>
                      <label className="text-xs font-semibold text-obsidian-300 block mb-1">
                        Nearest Landmark (Crucial for Rider)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Madina Masjid, Afridi Market, PSO Pump"
                        className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    {/* Distance Option */}
                    <div>
                      <label className="text-xs font-semibold text-obsidian-300 block mb-1">
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
                          <span className="text-[10px] text-obsidian-500 mt-0.5">
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
                          <span className="text-[10px] text-obsidian-500 mt-0.5">
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

                {/* ── Promo Code / Coupon Section ── */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-obsidian-300 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Have a Promo Code? (Try DOSTI100)</span>
                    </label>
                    {appliedCoupon && (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[10px] text-red-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter Promo Code"
                        className="flex-1 h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-white uppercase placeholder:normal-case placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-obsidian-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        Code {appliedCoupon.code} applied
                      </span>
                      <span className="font-bold">-{symbol}{appliedCoupon.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-red-400 mt-1">{couponError}</p>
                  )}
                  {couponSuccess && !couponError && (
                    <p className="text-[11px] text-emerald-400 mt-1">{couponSuccess}</p>
                  )}
                </div>

                {/* ── Payment Method ── */}
                <div>
                  <label className="text-xs font-semibold text-obsidian-300 block mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BUSINESS_CONFIG.ordering.paymentMethods.map((pm) => {
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <label
                          key={pm.id}
                          className={cn(
                            'flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all',
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
                  <label className="text-xs font-semibold text-obsidian-300 block mb-1">
                    Special Note / Food Request (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-obsidian-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Extra garlic mayo, less spicy, call upon arrival"
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* ── Price Summary ── */}
                <div className="pt-2 border-t border-white/[0.08] space-y-1 text-xs text-obsidian-400">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="text-white font-medium">
                      {symbol}{subtotal.toLocaleString()}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Promo Discount ({appliedCoupon.code})</span>
                      <span>-{symbol}{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
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
                  <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-white/[0.06]">
                    <span>Total Amount</span>
                    <span className="text-amber-400 text-base">
                      {symbol}{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* ── Submit Action ── */}
                <button
                  type="submit"
                  disabled={isSubmitting || (orderType === 'delivery' && isBelowMin)}
                  className={cn(
                    'w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer',
                    orderType === 'delivery' && isBelowMin
                      ? 'bg-obsidian-800 text-obsidian-500 cursor-not-allowed'
                      : 'bg-flame-600 hover:bg-flame-500 active:bg-flame-700 text-white shadow-lg shadow-flame-950/50'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing Kitchen & Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Order via WhatsApp</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ── Success Screen ── */
              <div className="text-center py-5 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                    Order Synchronized: #{createdOrderId}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white mt-1">Kitchen Dispatch Ready!</h3>
                  <p className="text-xs text-obsidian-400 mt-1 max-w-sm mx-auto">
                    Your order #{createdOrderId} has been logged in our kitchen system and prepared for WhatsApp dispatch.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-obsidian-400">Order ID:</span>
                    <span className="text-amber-400 font-mono font-bold">#{createdOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-obsidian-400">Customer:</span>
                    <span className="text-white font-semibold">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-obsidian-400">Area:</span>
                    <span className="text-white font-semibold">{sector}</span>
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
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <span>Open in WhatsApp</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={handleReset}
                    className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-obsidian-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Done / Close & Clear Cart
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
