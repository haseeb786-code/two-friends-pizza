import { create } from 'zustand';
import { CartState, CartItem, CartCustomizationSelection } from '@/types/cart';
import { Product } from '@/types/menu';

/**
 * Computes single item unit price including chosen size modifier, variant modifier, and add-ons.
 */
function calculateUnitPrice(
  product: Product,
  customization?: CartCustomizationSelection
): number {
  let price = product.basePrice;

  if (customization?.size) {
    price += customization.size.priceModifier;
  }

  if (customization?.variant) {
    price += customization.variant.priceModifier;
  }

  if (customization?.addOns && customization.addOns.length > 0) {
    const addOnsTotal = customization.addOns.reduce(
      (sum, item) => sum + item.price,
      0
    );
    price += addOnsTotal;
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
  const sizeKey = customization?.size?.id || 'default-size';
  const variantKey = customization?.variant?.id || 'default-variant';
  const addOnsKey = customization?.addOns
    ? customization.addOns
        .map((a) => a.id)
        .sort()
        .join(',')
    : 'none';
  const instructionsKey = customization?.specialInstructions?.trim() || '';

  return `${productId}::${sizeKey}::${variantKey}::${addOnsKey}::${instructionsKey}`;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  deliveryFee: 0,

  addItem: (product: Product, customization?: CartCustomizationSelection, quantity = 1) => {
    // Check product availability
    if (!product.isAvailable) {
      console.warn(`Product ${product.name} is currently unavailable.`);
      return;
    }

    if (quantity <= 0) return;

    const unitPrice = calculateUnitPrice(product, customization);
    const cartItemId = generateCartItemId(product.id, customization);

    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === cartItemId);

      if (existingIndex > -1) {
        // Increment quantity of existing customized item
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

      // Add new cart item entry
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
          return {
            ...item,
            quantity: nextQty,
            itemTotal: item.unitPrice * nextQty,
          };
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
        // Remove completely when decreasing past 1
        return {
          items: state.items.filter((item) => item.id !== cartItemId),
        };
      }

      return {
        items: state.items.map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity - 1;
            return {
              ...item,
              quantity: nextQty,
              itemTotal: item.unitPrice * nextQty,
            };
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
          return {
            ...item,
            quantity: newQuantity,
            itemTotal: item.unitPrice * newQuantity,
          };
        }
        return item;
      }),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  setDeliveryFee: (fee: number) => {
    set({ deliveryFee: Math.max(0, fee) });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.itemTotal, 0);
  },

  getTotal: () => {
    return get().getSubtotal() + get().deliveryFee;
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
