import { Product, ProductSizeOption, ProductVariantOption, ProductAddOnOption } from './menu';

export interface CartCustomizationSelection {
  size?: ProductSizeOption | null;
  variant?: ProductVariantOption | null;
  addOns?: ProductAddOnOption[];
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // Unique hash based on product ID and customization options
  productId: string;
  product: Product;
  selectedSize: ProductSizeOption | null;
  selectedVariant: ProductVariantOption | null;
  selectedAddOns: ProductAddOnOption[];
  quantity: number; // Customer selection (distinct from restaurant inventory)
  unitPrice: number;
  itemTotal: number;
  specialInstructions?: string;
}

export interface CartState {
  items: CartItem[];
  deliveryFee: number;

  // Actions
  addItem: (product: Product, customization?: CartCustomizationSelection, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  setDeliveryFee: (fee: number) => void;

  // Computations
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}
