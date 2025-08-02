// Utility functions for generating dynamic routes

export interface ListingRoute {
  listing_type: "product" | "service";
  slug: string;
  category?: string;
}

// Category mapping for URL generation
export const categoryMapping: Record<string, string> = {
  "fashion-clothing": "fashion-clothing",
  electronics: "electronics",
  "home-garden": "home-garden",
  "sports-outdoors": "sports-outdoors",
  "health-beauty": "health-beauty",
  "books-media": "books-media",
  automotive: "automotive",
  "food-beverages": "food-beverages",
  all: "all",
};

// Generate listing URL based on type, category and slug
export const getListingUrl = (
  listing: ListingRoute & { category?: string }
) => {
  const pluralType =
    listing.listing_type === "product" ? "products" : "services";
  const category = listing.category || "all";
  return `/categories/${pluralType}/${category}/${listing.slug}`;
};

// Generate listing URL by type, category and slug separately
export const getListingUrlByType = (
  type: "product" | "service",
  category: string,
  slug: string
) => {
  const pluralType = type === "product" ? "products" : "services";
  return `/categories/${pluralType}/${category}/${slug}`;
};

// Generate category page URLs
export const getCategoryUrl = (
  type: "product" | "service",
  category?: string
) => {
  const pluralType = type === "product" ? "products" : "services";
  if (category && category !== "all") {
    return `/categories/${pluralType}/${category}`;
  }
  return `/categories/${pluralType}`;
};

// Generate category page URLs (legacy query param version)
export const getCategoryUrlWithQuery = (
  type: "product" | "service",
  category?: string
) => {
  const pluralType = type === "product" ? "products" : "services";
  if (category && category !== "all") {
    return `/categories/${pluralType}?category=${category}`;
  }
  return `/categories/${pluralType}`;
};

// Generate breadcrumb data for listings
export const getListingBreadcrumb = (
  type: "product" | "service",
  category: string,
  name: string
) => {
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const pluralType = type === "product" ? "products" : "services";
  const categoryLabel = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: `${typeLabel}s`, href: `/categories/${pluralType}` },
    { label: categoryLabel, href: `/categories/${pluralType}/${category}` },
    { label: name, href: "#" },
  ];
};

// Validate route type
export const isValidListingType = (
  type: string
): type is "product" | "service" => {
  return ["product", "service"].includes(type);
};

// Validate plural route type
export const isValidPluralListingType = (
  type: string
): type is "products" | "services" => {
  return ["products", "services"].includes(type);
};

// Get display name for listing type
export const getListingTypeDisplay = (type: "product" | "service") => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Convert between singular and plural types
export const getSingularType = (
  pluralType: "products" | "services"
): "product" | "service" => {
  return pluralType === "products" ? "product" : "service";
};

export const getPluralType = (
  singularType: "product" | "service"
): "products" | "services" => {
  return singularType === "product" ? "products" : "services";
};
