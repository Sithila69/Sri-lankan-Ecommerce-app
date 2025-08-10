"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductDetails from "@/components/product/ProductDetails";
import Breadcrumb from "@/components/common/Breadcrumb";
import ItemNotFound from "@/components/common/ItemNotFound";
import ImageGallery from "@/components/common/ImageGallery";
import { DetailedListing } from "@/types";
import SellerInfo from "@/components/product/SellerInfo";

type ListingType = "products" | "services";

const ListingDetailsPage = () => {
  const [listing, setListing] = useState<DetailedListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const type = params?.type as ListingType;
  const categorySlug = params?.category as string;
  const slug = params?.slug as string;

  // Validate type parameter
  const isValidType = type === "products" || type === "services";

  useEffect(() => {
    if (!isValidType || !slug) {
      notFound();
      return;
    }

    const fetchListing = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/listings/get-details/${slug}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("404: Item not found");
          } else if (response.status === 410) {
            throw new Error("removed: Item has been removed");
          } else {
            throw new Error(`Failed to fetch listing: ${response.status}`);
          }
        }

        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load listing details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [type, slug, isValidType]);

  if (!isValidType) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-300 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    // Extract item name from slug for display
    const itemName = slug
      ? slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : undefined;

    const getReason = () => {
      if (error?.includes("404")) return "not_found";
      if (error?.includes("removed") || error?.includes("410"))
        return "removed";
      return "not_found";
    };

    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ItemNotFound
            type={type === "products" ? "product" : "service"}
            category={categorySlug}
            itemName={itemName}
            reason={getReason()}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Image Gallery */}
          <div>
            <ImageGallery
              images={listing.images || []}
              productName={listing.name}
            />
          </div>

          {/* Product Details */}
          <div>
            <ProductDetails
              listing={listing}
              type={type === "products" ? "product" : "service"}
            />
          </div>
        </div>

        {/* Additional Information */}
        {listing.description && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <div className="prose max-w-none text-gray-700">
              <p className="leading-relaxed">{listing.description}</p>
            </div>
          </div>
        )}

        {/* Seller Information Section */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <SellerInfo seller={listing.sellers} />
        </div>

        {/* Features */}
        {listing.features && listing.features.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {listing.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetailsPage;
