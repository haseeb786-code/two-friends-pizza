import { Deal } from '@/types/deals';

/**
 * Two Friends Pizza — All Deals
 *
 * ALL prices owner-verified against printed menu card. Do not recalculate or alter.
 */

export const DEALS: Deal[] = [

  // ══════════════════════════════════════════════
  // STUDENT DEALS
  // ══════════════════════════════════════════════

  {
    id: 'deal-a1',
    name: 'Deal A1',
    slug: 'deal-a1',
    description: 'Burger + Shawarma + Drink. The perfect student lunch.',
    includes: [
      { qty: 1, item: 'Zinger Burger' },
      { qty: 1, item: 'Chicken Shawarma' },
      { qty: 1, item: 'Drink', detail: '350ml' },
    ],
    price: 630,
    category: 'student',
    membersOnly: false,
    isFeatured: true,
    displayOrder: 1,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1648896172605-728b7e231165?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-a2',
    name: 'Deal A2',
    slug: 'deal-a2',
    description: 'Double zinger combo — more burger, one drink.',
    includes: [
      { qty: 2, item: 'Zinger Burger' },
      { qty: 1, item: 'Drink', detail: '350ml' },
    ],
    price: 750,
    category: 'student',
    membersOnly: false,
    isFeatured: false,
    displayOrder: 2,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-a3',
    name: 'Deal A3',
    slug: 'deal-a3',
    description: 'Burger + Crispy + Drink. The ultimate student trio.',
    includes: [
      { qty: 1, item: 'Zinger Burger' },
      { qty: 1, item: 'Chicken Piece' },
      { qty: 1, item: 'Drink', detail: '350ml' },
    ],
    price: 630,
    category: 'student',
    membersOnly: false,
    isFeatured: false,
    displayOrder: 3,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // ══════════════════════════════════════════════
  // OCCASION / GROUP DEALS
  // ══════════════════════════════════════════════

  {
    id: 'deal-friend-special',
    name: 'Friend Special Deal',
    slug: 'friend-special-deal',
    description: 'Made for friends — one large pizza, crispy bites and family fries.',
    includes: [
      { qty: 1, item: 'Large Pizza' },
      { qty: 3, item: 'Chicken Piece' },
      { qty: 1, item: 'Family Fries' },
      { qty: 6, item: 'Hot Shots' },
      { qty: 1, item: 'Drink', detail: '1.5L' },
    ],
    price: 3000,
    category: 'occasion',
    membersOnly: false,
    isFeatured: true,
    displayOrder: 10,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-birthday',
    name: 'Birthday Deal',
    slug: 'birthday-deal',
    description: 'Celebrate in style — three large pizzas, cake and drinks for your crew.',
    includes: [
      { qty: 3, item: 'Large Pizza' },
      { qty: 1, item: 'Family Fries' },
      { qty: 1, item: 'Cake', detail: '2lb' },
      { qty: 2, item: 'Drink', detail: '1.5L each' },
    ],
    price: 6500,
    category: 'occasion',
    membersOnly: false,
    isFeatured: true,
    displayOrder: 11,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-party',
    name: 'Party Deal',
    slug: 'party-deal',
    description: 'Go big — three large pizzas, crispy chicken and drinks for the whole party.',
    includes: [
      { qty: 3, item: 'Large Pizza' },
      { qty: 6, item: 'Chicken Piece' },
      { qty: 2, item: 'Drink', detail: '1.5L each' },
    ],
    price: 6000,
    category: 'occasion',
    membersOnly: false,
    isFeatured: false,
    displayOrder: 12,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-7',
    name: 'Deal-7',
    slug: 'deal-7',
    description: 'Three large pizzas with family fries and drinks — value for the whole table.',
    includes: [
      { qty: 3, item: 'Large Pizza' },
      { qty: 1, item: 'Family Fries' },
      { qty: 2, item: 'Drink', detail: '1.5L each' },
    ],
    price: 4500,
    category: 'occasion',
    membersOnly: false,
    isFeatured: false,
    displayOrder: 13,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-8',
    name: 'Deal-8',
    slug: 'deal-8',
    description: 'Five zingers and a large drink — the zinger lover\'s dream.',
    includes: [
      { qty: 5, item: 'Zinger Burger' },
      { qty: 1, item: 'Drink', detail: '1.5L' },
    ],
    price: 1900,
    category: 'occasion',
    membersOnly: false,
    isFeatured: false,
    displayOrder: 14,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // ══════════════════════════════════════════════
  // MEMBERS-ONLY DEALS — "Already Discounted"
  // All marked membersOnly: true
  // ══════════════════════════════════════════════

  {
    id: 'deal-1',
    name: 'Deal-1',
    slug: 'deal-1',
    description: 'Pizza + double burgers + drink. Already our best price.',
    includes: [
      { qty: 1, item: 'Regular Pizza', detail: 'any flavour' },
      { qty: 2, item: 'Zinger Burger' },
      { qty: 1, item: 'Drink', detail: '350ml' },
    ],
    price: 1000,
    category: 'members-only',
    membersOnly: true,
    isFeatured: false,
    displayOrder: 20,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-2',
    name: 'Deal-2',
    slug: 'deal-2',
    description: 'Pizza + shawarma + drink. A balanced combo.',
    includes: [
      { qty: 1, item: 'Regular Pizza', detail: 'any flavour' },
      { qty: 1, item: 'Chicken Shawarma' },
      { qty: 1, item: 'Drink', detail: '350ml' },
    ],
    price: 880,
    category: 'members-only',
    membersOnly: true,
    isFeatured: false,
    displayOrder: 21,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1648896172605-728b7e231165?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-3',
    name: 'Deal-3',
    slug: 'deal-3',
    description: 'Pizza + fries + drink. A simple, satisfying meal.',
    includes: [
      { qty: 1, item: 'Regular Pizza', detail: 'any flavour' },
      { qty: 1, item: 'Regular Fries' },
      { qty: 1, item: 'Drink', detail: '350ml' },
    ],
    price: 850,
    category: 'members-only',
    membersOnly: true,
    isFeatured: false,
    displayOrder: 22,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-4',
    name: 'Deal-4',
    slug: 'deal-4',
    description: 'Two large pizzas + hot shots + large drink. Group value.',
    includes: [
      { qty: 2, item: 'Large Pizza' },
      { qty: 10, item: 'Hot Shots' },
      { qty: 1, item: 'Drink', detail: '1.5L' },
    ],
    price: 3700,
    category: 'members-only',
    membersOnly: true,
    isFeatured: false,
    displayOrder: 23,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-5',
    name: 'Deal-5',
    slug: 'deal-5',
    description: 'Three zingers + medium pizza + large drink.',
    includes: [
      { qty: 3, item: 'Zinger Burger' },
      { qty: 1, item: 'Medium Pizza' },
      { qty: 1, item: 'Drink', detail: '1.5L' },
    ],
    price: 2250,
    category: 'members-only',
    membersOnly: true,
    isFeatured: false,
    displayOrder: 24,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'deal-6',
    name: 'Deal-6',
    slug: 'deal-6',
    description: 'One large pizza + four zingers + large drink. The flagship deal.',
    includes: [
      { qty: 1, item: 'Large Pizza' },
      { qty: 4, item: 'Zinger Burger' },
      { qty: 1, item: 'Drink', detail: '1.5L' },
    ],
    price: 3000,
    category: 'members-only',
    membersOnly: true,
    isFeatured: true,
    displayOrder: 25,
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

/** Grouped helpers for section rendering */
export const STUDENT_DEALS = DEALS.filter((d) => d.category === 'student');
export const OCCASION_DEALS = DEALS.filter((d) => d.category === 'occasion');
export const MEMBERS_DEALS = DEALS.filter((d) => d.category === 'members-only');
