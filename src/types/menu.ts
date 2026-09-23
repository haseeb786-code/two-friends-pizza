/**
 * Two Friends Pizza - Menu Domain Types
 * Strict data contract for products, categories, variants, and customizations.
 */

export type ProductCategory =
  | 'pizza'
  | 'burger'
  | 'sides'
  | 'drinks'
  | 'desserts';

export interface ProductSizeOption {
  id: string;
  name: string;
  priceModifier: number; // Added to basePrice
  description?: string;
  isDefault?: boolean;
}

export interface ProductVariantOption {
  id: string;
  name: string;
  priceModifier: number; // e.g. Stuffed Crust surcharge
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
  description: string;
  image: string;
  basePrice: number;
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
  displayOrder: number;
}

export interface MenuDataset {
  categories: CategoryMetadata[];
  products: Product[];
}
