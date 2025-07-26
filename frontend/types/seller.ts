export interface Seller {
  id: string; // UUID
  business_name: string;
  rating: number;
  total_reviews: number;
  logo_url?: string;
  contact_phone?: string;
  contact_email?: string;
  district?: string;
  province?: string;
}
