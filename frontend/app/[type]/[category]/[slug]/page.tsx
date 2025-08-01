"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import ProductDetails from "@/components/product/ProductDetails";
import SellerInfo from "@/components/product/SellerInfo";
import { useParams, notFound, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import { DetailedListing } from "@/types";
import Breadcrumb from "@/components/common/Breadcrumb";

const UnifiedListingPage = () => {
  const [listing, setListing] = useState<DetailedListing | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const type = params?.type as string;
  const category = params?.category as string;
  const slug = params?.slug as string;

  // Validate type parameter
  const validTypes = ["products", "services"];
  if (!validTypes.includes(type)) {
    notFound();
  }

  useEffect(() => {
    const fetchListing = async () => {
      if (!slug || !type) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/listings/get-details/${slug}`
        );

        if (!response.ok) {
          throw new Error("Listing not found");
        }

        const data = await response.json();
        console.log("Fetched listing data:", {
          slug,
          type,
          category,
          listingType: data.listing_type,
          listingCategory: data.categories.slug,
        });

        // Convert type to singular for comparison
        const singularType = type === "products" ? "product" : "service";

        // Verify the listing type matches the URL
        if (data.listing_type !== singularType) {
          notFound();
        }
        // Verify the category matches the URL (if category is not "all")
        if (category !== "all" && data.categories.slug !== category) {
          console.log("Category mismatch:", {
            urlCategory: category,
            actualCategory: data.categories.slug,
            redirecting: true,
          });
          // Redirect to the correct category URL
          const correctUrl = `/${type}/${data.category?.slug || "all"}/${slug}`;
          router.replace(correctUrl);
          return;
        }

        // Sort images by display_order, ensuring primary image (display_order = 0) comes first
        if (data.images && data.images.length > 0) {
          data.images.sort((a: any, b: any) => {
            // Primary image (display_order = 0) always comes first
            if (a.display_order === 0) return -1;
            if (b.display_order === 0) return 1;
            // Then sort by display_order ascending
            return a.display_order - b.display_order;
          });
        }

        setListing(data);
        // Reset selected image index to 0 (primary image) when new listing loads
        setSelectedImageIndex(0);
      } catch (error) {
        console.error("Error fetching listing:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [slug, type]);

  const handleBack = () => {
    // Navigate back to the category page using the actual category from the listing
    const actualCategory = listing?.category?.slug || category;
    if (actualCategory === "all") {
      router.push(`/${type}`);
    } else {
      router.push(`/${type}?category=${actualCategory}`);
    }
  };

  // Get sorted images (primary image first, then by display_order)
  const getSortedImages = () => {
    if (!listing?.images) return [];

    return [...listing.images].sort((a: any, b: any) => {
      // Primary image (display_order = 0) always comes first
      if (a.display_order === 0) return -1;
      if (b.display_order === 0) return 1;
      // Then sort by display_order ascending
      return a.display_order - b.display_order;
    });
  };

  const sortedImages = getSortedImages();

  const handlePreviousImage = () => {
    if (sortedImages.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? sortedImages.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (sortedImages.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === sortedImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    notFound();
  }

  const singularType = type === "products" ? "product" : "service";
  const pageTitle =
    singularType === "product" ? "Product Details" : "Service Details";
  // Use the actual category name from the listing for better UX
  const actualCategoryName =
    listing?.category?.name ||
    category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const backText = `Back to ${actualCategoryName} ${type}`;
  const typeLabel =
    singularType.charAt(0).toUpperCase() + singularType.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />

        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {backText}
        </button>

        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            {listing.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 overflow-hidden">
            {sortedImages.length > 0 ? (
              <>
                <div className="relative aspect-square bg-gray-100 group">
                  <img
                    src={sortedImages[selectedImageIndex]?.image_url || ""}
                    alt={
                      sortedImages[selectedImageIndex]?.alt_text || listing.name
                    }
                    className="w-full h-full object-cover"
                  />

                  {/* Primary Image Indicator */}
                  {sortedImages[selectedImageIndex]?.display_order === 0 && (
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      Primary
                    </div>
                  )}

                  {/* Navigation Buttons - Only show if multiple images */}
                  {sortedImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {selectedImageIndex + 1} / {sortedImages.length}
                      </div>
                    </>
                  )}
                </div>

                {sortedImages.length > 1 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {sortedImages.map((image, index) => (
                        <button
                          key={`${image.image_url}-${index}`}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-all ${
                            selectedImageIndex === index
                              ? "border-black"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <img
                            src={image.image_url}
                            alt={image.alt_text}
                            className="w-full h-full object-cover"
                          />
                          {/* Primary image indicator on thumbnail */}
                          {image.display_order === 0 && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="bg-white text-black text-xs px-1 py-0.5 rounded font-medium">
                                1st
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">
                    No Image Available
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <ProductDetails listing={listing} type={singularType} />
            <SellerInfo seller={listing.sellers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedListingPage;
