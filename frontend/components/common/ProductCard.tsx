import { Listing } from "@/types";
import {
  Heart,
  MapPin,
  Star,
  Share2,
  Eye,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const ProductCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [isFavorited, setIsFavorited] = useState(listing.isFavorited || false);
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="relative bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative aspect-square">
        <img
          src={listing?.primary_image?.url}
          alt={listing?.primary_image?.alt_text}
          className="w-full h-full object-cover"
        />

        {/* Offer Badge */}
        {listing.hasOffer && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-semibold">
            {listing.offerText}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="p-1.5 bg-white/80 rounded-full"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          <button className="p-1.5 bg-white/80 rounded-full">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Stock Status */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 text-xs">
          <div className="flex justify-between items-center">
            {/* Product availability */}
            {listing.listing_type === "product" &&
              listing.availability_info?.type === "product" && (
                <span
                  className={`font-medium ${
                    listing.availability_info.available
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {listing.availability_info.available
                    ? "In stock"
                    : "Out of stock"}
                </span>
              )}

            {/* Service availability */}
            {listing.listing_type === "service" &&
              listing.availability_info?.type === "service" && (
                <span className="font-medium text-blue-600">
                  {listing.availability_info.availability === "on_demand"
                    ? "On demand"
                    : listing.availability_info.availability === "scheduled"
                    ? "Scheduled"
                    : "Unavailable"}
                  {" • "}
                  {listing.availability_info.service_type === "on_site"
                    ? "On-site"
                    : listing.availability_info.service_type === "remote"
                    ? "Remote"
                    : "Hybrid"}
                </span>
              )}

            {/* Time info */}
            <div className="flex items-center text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {listing.time_info?.min}-{listing.time_info?.max}{" "}
              {listing.time_info?.unit}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
            {listing.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {listing?.seller?.business_name}
          </p>
        </div>

        {/* Rating */}

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-gray-900">
              LKR {listing.base_price}
            </div>
          </div>

          <button className="bg-black text-white p-2 rounded-md hover:bg-gray-800 text-xs">
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
