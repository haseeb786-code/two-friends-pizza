/**
 * Two Friends Pizza - Menu Domain Types
 * Strict data contract for products, categories, variants, and customizations.
 *
 * Category taxonomy:
 *   pizza        — Signature / Special pizzas (Crown Crust, Malai Boti, etc.)
 *   pizza-local  — "Somewhat Local" sub-category (Chicken Tikka, Fajita, etc.)
 *   burger       — Burger Station
 *   shawarma     — Shawarma Station
 *   fries        — Fries Station
 *   pasta        — Pasta Station
 *   crispy       — "Some Crispy" items
 */

export type ProductCategory =
  | 'pizza'
  | 'pizza-local'
  | 'burger'
  | 'shawarma'
  | 'fries'
  | 'pasta'
  | 'crispy';

/**
 * For pizzas: each size has an explicit price (not a modifier on a base price).
 * basePrice is the Reg price; sizes carry direct prices for Med/Large/XL.
 */
export interface ProductSizeOption {
  id: string;    // 'reg' | 'med' | 'large' | 'xl'
  name: string;  // 'Regular' | 'Medium' | 'Large' | 'XL'
  price: number; // Direct price for this size
  isDefault?: boolean;
}

export interface ProductVariantOption {
  id: string;
  name: string;
  priceModifier: number; // e.g. stuffed crust surcharge
  isDefault?: boolean;
}

export interface ProductAddOnOption {
  id: string;
  name: string;
  price: number;
  category?: 'cheese' | 'meat' | 'veggie' | 'sauce' | 'extra';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  /** Sub-grouping label within a category — used for "Somewhat Local" vs specials */
  subCategory?: string;
  description: string;
  /** Primary image URL */
  image: string;
  /** Optional array of up to 2 images for multi-angle/dual presentation */
  images?: string[];
  /**
   * For single-price items (burgers, shawarma, fries, etc.) this is the price.
   * For pizzas, use sizes[] with direct prices per size; basePrice = Reg price.
   */
  basePrice: number;
  /** Size options with explicit prices per size (not modifiers) */
  sizes: ProductSizeOption[];
  variants: ProductVariantOption[];
  addOns: ProductAddOnOption[];
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export interface CategoryMetadata {
  id: ProductCategory;
  label: string;
  description: string;
  emoji: string;
  displayOrder: number;
}

export interface MenuDataset {
  categories: CategoryMetadata[];
  products: Product[];
}
