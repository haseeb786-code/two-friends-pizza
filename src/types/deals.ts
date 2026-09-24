/**
 * Two Friends Pizza — Deals Domain Types
 *
 * Deals are NOT regular products — they are bundled combinations.
 * They have their own type separate from Product so the UI can:
 *  - Render an "includes" list
 *  - Show the bundled price prominently
 *  - Badge members-only deals with a distinct visual treatment
 */

export type DealCategory = 'student' | 'occasion' | 'members-only';

/**
 * A single inclusion line within a deal.
 * qty: how many of that item
 * item: human-readable name exactly as on the menu
 * detail: optional size/weight clarification (e.g. "350ml", "1.5L", "2lb")
 */
export interface DealInclusion {
  qty: number;
  item: string;
  detail?: string;
}

export interface Deal {
  id: string;
  name: string;
  slug: string;
  /** Human-readable summary line shown beneath the deal title */
  description: string;
  includes: DealInclusion[];
  price: number;
  category: DealCategory;
  /**
   * Members-Only deals are visually distinguished in the UI.
   * No login gate is implemented at this phase — marketing label only.
   */
  membersOnly: boolean;
  isFeatured: boolean;
  displayOrder: number;
  image: string;
  images?: string[];
}
