"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductDetails from "@/components/product/ProductDetails";
import Breadcrumb from "@/components/common/Breadcrumb";
import { DetailedListing } from "@/types";

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
      setError("Invalid listing parameters");
      setIsLoading(false);
      return;
    }

    const fetchListing = async () => {
      try {
        const apiEndpoint = type === "products" ? "products" : "services";
        const response = await fetch(
          `http://localhost:8080/${apiEndpoint}/${slug}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch listing: ${response.status}`);
        }

        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError("Failed to load listing details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [type, slug, isValidType]);

  if (!isValidType) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Invalid Page Type
            </h1>
            <p className="text-gray-600">
              The requested page type is not valid.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
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
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              {error || "Listing Not Found"}
            </h1>
            <p className="text-gray-600 mb-8">
              The requested listing could not be found or loaded.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
            >
              Go Back
            </button>
          </div>
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
          <div className="space-y-4">
            {listing.images && listing.images.length > 0 ? (
              <>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={listing.images[0]?.image_url}
                    alt={listing.images[0]?.alt_text || listing.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {listing.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {listing.images.slice(1, 5).map((image, index) => (
                      <div
                        key={image.id}
                        className="aspect-square overflow-hidden bg-gray-100"
                      >
                        <img
                          src={image.thumbnail_url || image.image_url}
                          alt={image.alt_text || `${listing.name} ${index + 2}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
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
