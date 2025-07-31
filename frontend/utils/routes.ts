// Utility functions for generating dynamic routes

export interface ListingRoute {
  listing_type: "product" | "service";
  slug: string;
}

// Generate listing URL based on type and slug
export const getListingUrl = (listing: ListingRoute) => {
  return `/${listing.listing_type}/${listing.slug}`;
};

// Generate listing URL by type and slug separately
export const getListingUrlByType = (
  type: "product" | "service",
  slug: string
) => {
  return `/${type}/${slug}`;
};

// Generate category page URLs
export const getCategoryUrl = (type: "product" | "service") => {
  return type === "product" ? "/products" : "/services";
};

// Generate breadcrumb data for listings
export const getListingBreadcrumb = (
  type: "product" | "service",
  name: string
) => {
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const categoryUrl = getCategoryUrl(type);

  return [
    { label: "Home", href: "/" },
    { label: `${typeLabel}s`, href: categoryUrl },
    { label: name, href: "#" },
  ];
};

// Validate route type
export const isValidListingType = (
  type: string
): type is "product" | "service" => {
  return ["product", "service"].includes(type);
};

// Get display name for listing type
export const getListingTypeDisplay = (type: "product" | "service") => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};
