import { Seller } from "./seller";

export interface Listing {
  id: string;
  name: string;
  slug: string;
  seller: Seller;
  base_price: number;
  discounted_price?: number;
  currency: string;
  location: string;
  district: string;
  province: string;
  listing_type: "product" | "service";
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  img_url?: string;
  primary_image?: {
    url: string;
    alt_text: string;
  };
  reviewSummary: {
    total: number;
    average: string;
  };
  time_info?: {
    min: number;
    max: number;
    unit: string;
  };
  description: string;
  short_description?: string;
  features?: string[];
  pricing?: string; // Custom description like "Rs. 1500 per hour"
  serviceTime?: string;
  // Updated availability info to handle both products and services
  availability_info?: {
    type: "product" | "service";

    // Product-specific
    quantity?: number;
    available?: boolean;

    // Service-specific
    availability?: "on_demand" | "scheduled" | "unavailable";
    service_type?: "on_site" | "remote" | "hybrid";
  };

  created_at: string;
  updated_at: string;
  views_count: number;

  // Deprecated - keeping for backward compatibility
  stock_info?: {
    quantity: number;
    available: boolean;
  };
  hasOffer?: boolean;
  offerText?: string;
  isFavorited?: boolean;
}

export interface DetailedListing
  extends Omit<Listing, "seller" | "reviewSummary" | "time_info"> {
  seller_id: string;
  category_id: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  status: string;
  featured: boolean;
  views_count: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  images: {
    id: string;
    image_url: string;
    alt_text: string;
    caption: string | null;
    thumbnail_url: string | null;
    medium_url: string | null;
    large_url: string | null;
    display_order: number;
    is_primary: boolean;
    file_size: bigint;
  }[];
  sellers: Seller & {
    business_type: string;
    contact_email: string | null;
    contact_phone: string | null;
    whatsapp_number: string | null;
  };
  products: {
    id: string;
    sku: string;
    weight: number | null;
    demensions: string;
    delivery_cost: number | null;
    delivery_time_max: number | null;
    delivery_time_min: number | null;
    shipping_required: boolean;
    delivery_available: boolean;
  };
  services: {
    id: string;
    travel_cost: number | null;
    service_type: "on_site" | "remote" | "hybrid";
    travel_required: boolean;
    service_radius_km: number;
    completion_time_max: number;
    completion_time_min: number;
    advance_booking_days: number | null;
    completion_time_unit: string;
    minimum_order_amount: number | null;
    availability_schedule: any | null; // TODO: create a proper type for this
    service_pricing_type_id: number | null;
    advance_booking_required: boolean;
    estimated_duration_hours: number;
  }[];
  review_summary: {
    total: number;
    average: number;
    distribution: {
      rating: number;
      count: number;
    }[];
  };
  reviews: any[];
}
