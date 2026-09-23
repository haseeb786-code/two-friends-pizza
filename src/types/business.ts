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

export interface RestaurantContact {
  phone: string;
  whatsapp: string;
  email: string;
}

export interface RestaurantLocation {
  address: string;
  city: string;
  googleMapsUrl: string;
  coordinates: {
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
