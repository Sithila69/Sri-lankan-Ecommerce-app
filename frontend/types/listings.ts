export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Re-export the main Listing interface
export { Listing } from "./listing";

export type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "popular";
export type FilterType = "all" | "products" | "services";

export interface ListingsFilters {
  type: FilterType;
  category: string;
  sort: SortOption;
}

export interface CategoriesData {
  productCategories: Category[];
  serviceCategories: Category[];
}

export interface ListingsApiResponse {
  products?: Listing[];
  services?: Listing[];
}
