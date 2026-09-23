import { MenuDataset, CategoryMetadata, Product } from '@/types/menu';

/**
 * Standard categories configuration for Two Friends Pizza.
 */
export const MENU_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'pizza',
    label: 'Pizzas',
    description: 'Freshly baked artisanal pizzas with hand-stretched dough and premium toppings.',
    displayOrder: 1,
  },
  {
    id: 'burger',
    label: 'Burgers',
    description: 'Juicy, flame-grilled craft burgers prepared with signature sauces.',
    displayOrder: 2,
  },
  {
    id: 'sides',
    label: 'Sides & Appetizers',
    description: 'Crispy finger foods, wings, and savory sides.',
    displayOrder: 3,
  },
  {
    id: 'drinks',
    label: 'Beverages',
    description: 'Chilled soft drinks and refreshments.',
    displayOrder: 4,
  },
  {
    id: 'desserts',
    label: 'Desserts',
    description: 'Sweet treats to complete your meal.',
    displayOrder: 5,
  },
];

/**
 * Empty menu product repository.
 * Real menu products, authentic pricing, and imagery will be populated in subsequent phases.
 * DO NOT hard-code products in UI components.
 */
export const MENU_PRODUCTS: Product[] = [];

/**
 * Menu dataset contract export.
 */
export const menuDataset: MenuDataset = {
  categories: MENU_CATEGORIES,
  products: MENU_PRODUCTS,
};
