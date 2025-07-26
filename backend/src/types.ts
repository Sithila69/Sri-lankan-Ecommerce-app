export interface ListingFilters {
  category_id?: number;
  district?: string;
  province?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  status?: string;
  featured?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
