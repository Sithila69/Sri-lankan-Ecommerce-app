import { getBaseURL } from "@/utils/getBaseURL";
import {
  CategoriesData,
  Listing,
  ListingsFilters,
  ListingsApiResponse,
  SortOption,
} from "@/types/listings";

export const listingsApi = {
  // Fetch categories
  async fetchCategories(): Promise<CategoriesData> {
    const [productResponse, serviceResponse] = await Promise.all([
      fetch(`${getBaseURL()}/categories/type/product`),
      fetch(`${getBaseURL()}/categories/type/service`),
    ]);

    const productData = await productResponse.json();
    const serviceData = await serviceResponse.json();

    return {
      productCategories: productData.categories || [],
      serviceCategories: serviceData.categories || [],
    };
  },

  // Build sort parameter for API
  buildSortParam(sortBy: SortOption): string {
    switch (sortBy) {
      case "oldest":
        return "&sort=created_at&order=asc";
      case "price-low":
        return "&sort=base_price&order=asc";
      case "price-high":
        return "&sort=base_price&order=desc";
      case "popular":
        return "&sort=views_count&order=desc";
      default: // newest
        return "&sort=created_at&order=desc";
    }
  },

  // Fetch products
  async fetchProducts(category: string, sortParam: string): Promise<Listing[]> {
    try {
      const response = await fetch(
        `${getBaseURL()}/products/category/${category}?limit=100${sortParam}`
      );
      const data = await response.json();
      return (data.products || []).map((item: any) => ({
        ...item,
        listing_type: "product" as const,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Fetch services
  async fetchServices(category: string, sortParam: string): Promise<Listing[]> {
    try {
      const response = await fetch(
        `${getBaseURL()}/services/category/${category}?limit=100${sortParam}`
      );
      const data = await response.json();
      return (data.services || []).map((item: any) => ({
        ...item,
        listing_type: "service" as const,
      }));
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  },

  // Sort listings
  sortListings(listings: Listing[], sortBy: SortOption): Listing[] {
    const sorted = [...listings];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "price-low":
        return sorted.sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.base_price || 0) - (a.base_price || 0));
      case "popular":
        return sorted.sort(
          (a, b) => (b.views_count || 0) - (a.views_count || 0)
        );
      default:
        return sorted;
    }
  },

  // Fetch all listings based on filters
  async fetchListings(filters: ListingsFilters): Promise<Listing[]> {
    const { type, category, sort } = filters;
    const sortParam = this.buildSortParam(sort);
    let allListings: Listing[] = [];

    // Fetch products if needed
    if (type === "all" || type === "products") {
      const products = await this.fetchProducts(category, sortParam);
      allListings = [...allListings, ...products];
    }

    // Fetch services if needed
    if (type === "all" || type === "services") {
      const services = await this.fetchServices(category, sortParam);
      allListings = [...allListings, ...services];
    }

    // Sort combined results if needed (for "all" type)
    if (type === "all") {
      allListings = this.sortListings(allListings, sort);
    }

    return allListings;
  },
};
