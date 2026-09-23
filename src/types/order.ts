/**
 * Two Friends Pizza - Order Architecture Contracts
 * Types and flow specifications only (No execution logic or WhatsApp integration in Part 1).
 */

/**
 * End-to-end user navigation & conversion flow
 */
export type OrderFlowStep =
  | 'HOME'
  | 'MENU'
  | 'PRODUCT'
  | 'ADD_TO_CART'
  | 'CART'
  | 'CHECKOUT'
  | 'CUSTOMER_DETAILS'
  | 'ORDER_SUMMARY'
  | 'ORDER_ON_WHATSAPP';

export type FulfillmentType = 'delivery' | 'pickup';

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface CustomerDetails {
  name: string;
  whatsappNumber: string;
  phoneNumber: string;
  email?: string;
  notes?: string;
}

export interface DeliveryDetails {
  address: string;
  apartmentSuite?: string;
  areaLandmark?: string;
  city?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  deliveryInstructions?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  category: string;
  sizeName?: string;
  variantName?: string;
  addOnNames?: string[];
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  specialInstructions?: string;
}

export interface OrderPricingSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  currency: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  currentStep: OrderFlowStep;
  fulfillmentType: FulfillmentType;
  customer: CustomerDetails;
  delivery?: DeliveryDetails;
  items: OrderItemSnapshot[];
  pricing: OrderPricingSummary;
  createdAt: string; // ISO 8601 string
  updatedAt: string;
  whatsappMessagePayload?: string; // Pre-formatted WhatsApp order message template
}
