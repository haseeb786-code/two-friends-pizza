/**
 * Two Friends Pizza - Business Configuration Domain Types
 */

export interface OpeningHoursDay {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  tiktok?: string;
}

/**
 * orderPhone: the number shown on "Order Now" CTAs — 0331-0479696
 * feedbackPhone: the separate Feedback / Report channel — 0348-5766881
 * whatsapp: WhatsApp order number (same as orderPhone unless specified otherwise)
 */
export interface RestaurantContact {
  orderPhone: string;
  feedbackPhone: string;
  whatsapp: string;
  email?: string;
}

export interface RestaurantLocation {
  address: string;
  city: string;
  googleMapsUrl: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  contact: RestaurantContact;
  location: RestaurantLocation;
  social: SocialLinks;
  hours: OpeningHoursDay[];
  currency: {
    symbol: string;
    code: string;
    defaultDeliveryFee: number;
  };
}
