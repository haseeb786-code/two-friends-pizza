'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartState, CartItem, CartCustomizationSelection } from '@/types/cart';
import { Product } from '@/types/menu';
import { Deal } from '@/types/deals';

/**
 * Computes single item unit price.
 * For products with sizes: uses the explicit size.price directly.
 * For products without sizes (burgers, shawarma, etc.): uses product.basePrice.
 */
function calculateUnitPrice(
  product: Product,
  customization?: CartCustomizationSelection
): number {
  if (customization?.size) {
    let price = customization.size.price;
    if (customization.variant) {
      price += customization.variant.priceModifier;
    }
    if (customization.addOns && customization.addOns.length > 0) {
      price += customization.addOns.reduce((sum, addon) => sum + addon.price, 0);
    }
    return price;
  }

  let price = product.basePrice;
  if (customization?.variant) {
    price += customization.variant.priceModifier;
  }
  if (customization?.addOns && customization.addOns.length > 0) {
    price += customization.addOns.reduce((sum, addon) => sum + addon.price, 0);
  }
  return price;
}

/**
 * Generates a unique key for cart items based on selected options
 * to group identical customizations together.
 */
function generateCartItemId(
  productId: string,
  customization?: CartCustomizationSelection
): string {
  const sizeKey = customization?.size?.id || 'no-size';
  const variantKey = customization?.variant?.id || 'no-variant';
  const addOnsKey = customization?.addOns
    ? customization.addOns.map((a) => a.id).sort().join(',')
    : 'none';
  const instructionsKey = customization?.specialInstructions?.trim() || '';
  return `${productId}::${sizeKey}::${variantKey}::${addOnsKey}::${instructionsKey}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryFee: 0,

      // Standard Product Add (Pizzas, Burgers, Fries, etc.)
      addItem: (product: Product, customization?: CartCustomizationSelection, quantity = 1) => {
        if (!product.isAvailable) {
          console.warn(`Product "${product.name}" is currently unavailable.`);
          return;
        }
        if (quantity <= 0) return;

        const unitPrice = calculateUnitPrice(product, customization);
        const cartItemId = generateCartItemId(product.id, customization);

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === cartItemId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQuantity = currentItem.quantity + quantity;
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQuantity,
              itemTotal: unitPrice * newQuantity,
            };
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            product,
            selectedSize: customization?.size || null,
            selectedVariant: customization?.variant || null,
            selectedAddOns: customization?.addOns || [],
            quantity,
            unitPrice,
            itemTotal: unitPrice * quantity,
            specialInstructions: customization?.specialInstructions,
            isDeal: false,
          };
          return { items: [...state.items, newItem] };
        });
      },

      // Complete Deal Add (Student, Occasion, Members Deals)
      addDeal: (deal: Deal, quantity = 1) => {
        if (quantity <= 0) return;
        const cartItemId = `deal::${deal.id}`;
        const unitPrice = deal.price;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === cartItemId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQuantity = currentItem.quantity + quantity;
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQuantity,
              itemTotal: unitPrice * newQuantity,
            };
            return { items: updatedItems };
          }

          const dealProduct: Product = {
            id: deal.id,
            name: deal.name,
            slug: deal.slug,
            category: 'deals' as any,
            description: deal.includes
              .map((inc) => `${inc.qty}× ${inc.item}${inc.detail ? ` (${inc.detail})` : ''}`)
              .join(' + '),
            image: deal.image,
            images: deal.images,
            basePrice: deal.price,
            sizes: [],
            variants: [],
            addOns: [],
            isAvailable: true,
            isFeatured: deal.isFeatured,
            displayOrder: deal.displayOrder,
          };

          const newItem: CartItem = {
            id: cartItemId,
            productId: deal.id,
            product: dealProduct,
            selectedSize: null,
            selectedVariant: null,
            selectedAddOns: [],
            quantity,
            unitPrice,
            itemTotal: unitPrice * quantity,
            specialInstructions: deal.description,
            isDeal: true,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (cartItemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      increaseQuantity: (cartItemId: string) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === cartItemId) {
              const nextQty = item.quantity + 1;
              return { ...item, quantity: nextQty, itemTotal: item.unitPrice * nextQty };
            }
            return item;
          }),
        }));
      },

      decreaseQuantity: (cartItemId: string) => {
        set((state) => {
          const targetItem = state.items.find((item) => item.id === cartItemId);
          if (!targetItem) return state;
          if (targetItem.quantity <= 1) {
            return { items: state.items.filter((item) => item.id !== cartItemId) };
          }
          return {
            items: state.items.map((item) => {
              if (item.id === cartItemId) {
                const nextQty = item.quantity - 1;
                return { ...item, quantity: nextQty, itemTotal: item.unitPrice * nextQty };
              }
              return item;
            }),
          };
        });
      },

      updateQuantity: (cartItemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === cartItemId) {
              return { ...item, quantity: newQuantity, itemTotal: item.unitPrice * newQuantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      setDeliveryFee: (fee: number) => set({ deliveryFee: Math.max(0, fee) }),

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.itemTotal, 0),

      getTotal: () => get().getSubtotal() + get().deliveryFee,

      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'tfp-cart-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
