import { Deal } from '@/types/deals';

/**
 * Two Friends Pizza — All Deals
 *
 * ALL prices owner-verified against printed menu card. Do not recalculate or alter.
 *
 * Assumptions (documented):
 *  - "Regular Pizza" in Deal-1/2/3 refers to any Regular-size pizza (any flavour).
 *    No specific flavour is specified in the provided data.
 *  - "Drink (350ml)" / "Drink (1.5L)" are deal inclusions only — not orderable
 *    as standalone products in this phase.
 *  - Members-Only deals (Deal-1 through Deal-6) carry membersOnly: true.
 *    No login gate is implemented at this phase — marketing label only.
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
    image: '/images/deals/deal-a1.jpg',
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
    image: '/images/deals/deal-a2.jpg',
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
    image: '/images/deals/deal-a3.jpg',
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
    image: '/images/deals/deal-friend-special.jpg',
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
    image: '/images/deals/deal-birthday.jpg',
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
    image: '/images/deals/deal-party.jpg',
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
    image: '/images/deals/deal-7.jpg',
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
    image: '/images/deals/deal-8.jpg',
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
    image: '/images/deals/deal-1.jpg',
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
    image: '/images/deals/deal-2.jpg',
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
    image: '/images/deals/deal-3.jpg',
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
    image: '/images/deals/deal-4.jpg',
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
    image: '/images/deals/deal-5.jpg',
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
    image: '/images/deals/deal-6.jpg',
  },
];

/** Grouped helpers for section rendering */
export const STUDENT_DEALS = DEALS.filter((d) => d.category === 'student');
export const OCCASION_DEALS = DEALS.filter((d) => d.category === 'occasion');
export const MEMBERS_DEALS = DEALS.filter((d) => d.category === 'members-only');
