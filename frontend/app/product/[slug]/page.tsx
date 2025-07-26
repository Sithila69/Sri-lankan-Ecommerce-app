"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import ProductDetails from "@/components/product/ProductDetails";
import SellerInfo from "@/components/product/SellerInfo";
import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import { DetailedListing } from "@/types";
import Breadcrumb from "@/components/common/Breadcrumb";

const ListingsPage = () => {
  const [listing, setListing] = useState<DetailedListing | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const params = useParams();
  const slug = params?.slug as string;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const response = await fetch(
          `http://localhost:8080/listings/get-details/${slug}`
        );
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [slug]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />

        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Store
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            {listing.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {listing.images && listing.images.length > 0 ? (
              <>
                <div className="aspect-square bg-gray-100">
                  <img
                    src={listing.images[selectedImageIndex]?.image_url || ""}
                    alt={
                      listing.images[selectedImageIndex]?.alt_text ||
                      listing.name
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                {listing.images.length > 1 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2 overflow-x-auto">
                      {listing.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                            selectedImageIndex === index
                              ? "border-gray-900"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image.image_url}
                            alt={image.alt_text}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>

          <div>
            <ProductDetails listing={listing} />
            <SellerInfo seller={listing.sellers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
