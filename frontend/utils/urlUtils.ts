import { FilterType, ListingsFilters, SortOption } from "@/types/listings";

export const urlUtils = {
  // Parse filters from URL search params
  parseFiltersFromUrl(searchParams: URLSearchParams): ListingsFilters {
    return {
      type: (searchParams.get("type") as FilterType) || "all",
      category: searchParams.get("category") || "all",
      sort: (searchParams.get("sort") as SortOption) || "newest",
    };
  },

  // Build URL from filters
  buildUrlFromFilters(filters: ListingsFilters): string {
    const params = new URLSearchParams();

    if (filters.type !== "all") {
      params.set("type", filters.type);
    }
    if (filters.category !== "all") {
      params.set("category", filters.category);
    }
    if (filters.sort !== "newest") {
      params.set("sort", filters.sort);
    }

    return params.toString()
      ? `/categories/listings?${params.toString()}`
      : "/categories/listings";
  },
};
