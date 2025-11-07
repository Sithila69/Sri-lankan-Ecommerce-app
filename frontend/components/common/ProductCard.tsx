import { Listing } from "@/types";
import {
  Heart,
  Share2,
  ShoppingCart,
  Calendar,
  CalendarCheck,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Tooltip from "./Tooltip";
import { getListingUrl } from "@/utils/routes";

const ProductCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [isFavorited, setIsFavorited] = useState(listing.isFavorited || false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Check if item is new (within last 7 days)
  const isNewArrival = () => {
    if (!listing.created_at) return false;
    const createdDate = new Date(listing.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdDate > sevenDaysAgo;
  };

  const handleViewDetails = () => {
    // Use the actual category from the listing, fallback to "all" if not available
    const category = listing.category?.slug || "all";

    const url = getListingUrl({
      listing_type: listing.listing_type,
      slug: listing.slug,
      category: category,
    });
    router.push(url);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    handleViewDetails();
  };
  return (
    <div
      className="relative bg-white  border border-gray-100 hover:shadow-md transition-all cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden ">
        <img
          src={listing?.primary_image?.url}
          alt={listing?.primary_image?.alt_text}
          className="w-full h-full object-cover"
        />

        {/* New Arrival Badge */}
        {isNewArrival() && (
          <div className="absolute top-2 left-2 bg-gray-900 text-white px-3 py-1 text-xs font-medium">
            NEW
          </div>
        )}

        {/* Discount Badge */}
        {listing.discounted_price &&
          listing.discounted_price < listing.base_price && (
            <div
              className={`absolute top-2 ${
                isNewArrival() ? "left-16" : "left-2"
              } bg-red-500 text-white px-3 py-1 text-xs font-medium`}
            >
              {Math.round(
                ((listing.base_price - listing.discounted_price) /
                  listing.base_price) *
                  100
              )}
              % OFF
            </div>
          )}

        {/* Offer Badge */}
        {listing.hasOffer && !listing.discounted_price && !isNewArrival() && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-3 py-1 text-xs font-medium">
            {listing.offerText}
          </div>
        )}

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

      {/* Action Buttons - Positioned outside overflow container */}
      <div
        className={`absolute top-2 right-2 flex gap-1 transition-opacity z-10 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <Tooltip text="Add to wishlist" position="bottom">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </Tooltip>

        <Tooltip text={`Share ${listing.listing_type}`} position="bottom">
          <button className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </Tooltip>
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
            {listing.discounted_price &&
            listing.discounted_price < listing.base_price ? (
              <div className="flex flex-col">
                <div className="font-bold text-gray-900">
                  LKR {listing.discounted_price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 line-through">
                  LKR {listing.base_price.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="font-bold text-gray-900">
                LKR {listing.base_price.toLocaleString()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* <Tooltip text="View details" position="top">
              <button
                onClick={handleViewDetails}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </Tooltip> */}

            <Tooltip
              text={
                listing.listing_type === "service"
                  ? "Book service"
                  : "Add to cart"
              }
              position="top"
            >
              <button className="bg-black text-white p-2  hover:bg-gray-800 transition-colors">
                {listing.listing_type === "service" ? (
                  <CalendarCheck className="w-3.5 h-3.5" />
                ) : (
                  <ShoppingCart className="w-3.5 h-3.5" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
