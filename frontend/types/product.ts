import { Seller } from "./seller";

export interface Product {
  id: string; // UUID
  name: string;
  slug: string;
  sellers: Seller;
  base_price: number;
  discounted_price?: number;
  currency: string;
  location: string;
  district: string;
  province: string;
  type: "product" | "service";
  img_url?: string; // optional: if you're using a primary image field
  reviewSummary: {
    total: number;
    average: string;
  };
  delivery_time_min?: number;
  delivery_time_max?: number;
  description: string;
  short_description?: string;
  features?: string[]; // Optional, unless you're adding this manually
  pricing?: string; // Custom description like "Rs. 1500 per hour"
  serviceTime?: string;
  stock_quantity?: number;
  hasOffer?: boolean;
  offerText?: string;
  isFavorited?: boolean;
}
