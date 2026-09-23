import { BusinessConfig } from '@/types/business';

/**
 * Two Friends Pizza — Real Business Configuration
 *
 * Data confirmed directly by owner against printed menu card and signage.
 * DO NOT alter any value without owner confirmation.
 *
 * Placeholders still pending from owner:
 *  - Instagram URL
 *  - Facebook URL
 *  - Google Maps URL
 *  - Opening hours
 */
export const BUSINESS_CONFIG: BusinessConfig = {
  name: 'Two Friends Pizza',
  tagline: 'Dosti Ka Slice',

  contact: {
    /** Primary order line — used in all "Order Now" CTAs */
    orderPhone: '0331-0479696',
    /** Separate feedback / report channel */
    feedbackPhone: '0348-5766881',
    /** WhatsApp number for order placement — same as orderPhone */
    whatsapp: '0331-0479696',
  },

  location: {
    address: 'Al-Haaj Afridi Market, Chota Mera, Main Chak Belli Road Rawat',
    city: 'Rawat',
    /** Placeholder — Google Maps pin URL pending from owner */
    googleMapsUrl: 'https://maps.google.com/?q=Two+Friends+Pizza+Rawat',
  },

  social: {
    /** Placeholder — Instagram URL pending from owner */
    instagram: 'https://instagram.com/twofriendspizza',
    /** Placeholder — Facebook URL pending from owner */
    facebook: 'https://facebook.com/twofriendspizza',
  },

  /** Placeholder — opening hours pending from owner */
  hours: [
    { day: 'Monday',    open: '12:00 PM', close: '11:00 PM', isOpen: true },
    { day: 'Tuesday',   open: '12:00 PM', close: '11:00 PM', isOpen: true },
    { day: 'Wednesday', open: '12:00 PM', close: '11:00 PM', isOpen: true },
    { day: 'Thursday',  open: '12:00 PM', close: '11:00 PM', isOpen: true },
    { day: 'Friday',    open: '12:00 PM', close: '12:00 AM', isOpen: true },
    { day: 'Saturday',  open: '12:00 PM', close: '12:00 AM', isOpen: true },
    { day: 'Sunday',    open: '12:00 PM', close: '11:00 PM', isOpen: true },
  ],

  currency: {
    symbol: '₨',
    code: 'PKR',
    defaultDeliveryFee: 0,
  },
};
