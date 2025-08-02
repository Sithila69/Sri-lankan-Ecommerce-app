"use client";
import React, { useState, useEffect } from "react";
import { Star, MapPin, Clock, Heart, Plus, Minus, Check } from "lucide-react";
import { DetailedListing } from "@/types";
import { addToCart } from "@/utils/cart";

const ProductDetails: React.FC<{ listing: DetailedListing; type: string }> = ({
  listing,
  type,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(
    listing.discounted_price || listing.base_price
  );
  const [isFavorited, setIsFavorited] = useState(false);

  const stock_quantity =
    listing.listing_type === "product" && listing.availability_info?.quantity
      ? listing.availability_info?.quantity
      : 0;

  const item = {
    product_id: listing.id,
    name: listing.name,
    price: listing.discounted_price || listing.base_price,
    image_url: listing.images?.[0]?.image_url || "",
    quantity: quantity,
    seller: listing?.sellers?.business_name,
    stock: stock_quantity,
  };

  useEffect(() => {
    const price = listing.discounted_price || listing.base_price;
    setTotalPrice(price * quantity);
  }, [quantity, listing.base_price, listing.discounted_price]);

  const handleAddToCart = () => {
    if (listing.listing_type === "service") {
      // For services, add to service requests
      const serviceItem = {
        ...item,
        type: "service" as const,
        booking_required: true,
        quantity: 1, // Services typically have quantity of 1
      };
      addToCart(serviceItem, 1);
    } else {
      addToCart(item, stock_quantity);
    }
  };

  const increaseQuantity = () => {
    if (listing.listing_type === "product" && quantity < stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (listing.listing_type === "product" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Helper variables for better UX
  const isService = listing.listing_type === "service";
  const isProductAvailable =
    listing.listing_type === "product" && stock_quantity > 0;
  const isServiceAvailable =
    listing.listing_type === "service" &&
    listing.availability_info?.service_type; // Service is available if it has a service type
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="bg-white  border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            {listing?.name}
          </h2>
          <p className="text-gray-600">{listing?.sellers?.business_name}</p>
        </div>

        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorited ? "fill-gray-900 text-gray-900" : "text-gray-400"
            }`}
          />
        </button>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 ">
          {typeLabel}
        </span>
        {listing.listing_type === "service" && (
          <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 ">
            {listing.availability_info?.service_type === "on_site"
              ? "On-site"
              : listing.availability_info?.service_type === "remote"
              ? "Remote"
              : "Hybrid"}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center bg-gray-50 px-3 py-1.5 ">
          <Star className="w-4 h-4 text-gray-900 fill-current" />
          {listing?.review_summary?.total > 0 ? (
            <>
              <span className="text-sm font-medium ml-1.5 text-gray-900">
                {listing.review_summary.average}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({listing.review_summary.total})
              </span>
            </>
          ) : (
            <span className="text-sm font-medium ml-1.5 text-gray-600">
              No reviews
            </span>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1.5" />
          {listing?.location}
        </div>

        {listing?.listing_type === "service" && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1.5" />
            {listing?.services[0]?.completion_time_min}{" "}
            {listing?.services[0]?.completion_time_unit}
          </div>
        )}
      </div>

      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed mb-4">
          {listing?.description}
        </p>

        {listing?.features && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Features</h3>
            {listing.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Check className="w-4 h-4 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            {listing.discounted_price &&
            listing.discounted_price < listing.base_price ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-semibold text-gray-900">
                    LKR {totalPrice.toLocaleString()}
                  </span>
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    {Math.round(
                      ((listing.base_price - listing.discounted_price) /
                        listing.base_price) *
                        100
                    )}
                    % OFF
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg text-gray-500 line-through">
                    LKR {(listing.base_price * quantity).toLocaleString()}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    You save LKR{" "}
                    {(
                      (listing.base_price - listing.discounted_price) *
                      quantity
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-3xl font-semibold text-gray-900">
                LKR {totalPrice.toLocaleString()}
              </span>
            )}
            {listing?.pricing && (
              <span className="text-sm text-gray-500 ml-1">
                /{listing?.pricing}
              </span>
            )}
          </div>

          {listing?.listing_type === "product" && (
            <div>
              {stock_quantity > 0 ? (
                <div className="flex items-center border border-gray-200 ">
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                    aria-label="Increase quantity"
                    disabled={quantity >= stock_quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
          )}
        </div>

        {/* Service Type Info */}
        {isService ? (
          <div className="bg-gray-50 p-4 border border-gray-200 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Service Type</span>
              <span className="font-medium text-gray-900">
                {listing.availability_info?.service_type === "on_site"
                  ? "On-site Service"
                  : listing.availability_info?.service_type === "remote"
                  ? "Remote Service"
                  : listing.availability_info?.service_type === "hybrid"
                  ? "Hybrid Service"
                  : "Service Available"}
              </span>
            </div>
          </div>
        ) : (
          stock_quantity > 0 && (
            <p className="text-sm text-gray-500 mb-6">
              {stock_quantity} items available
            </p>
          )
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isService ? (
            <>
              <button
                onClick={handleAddToCart}
                className="w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 hover:bg-gray-50 transition-colors font-medium"
                disabled={!isServiceAvailable}
              >
                Add to Service Requests
              </button>
              <button
                className="w-full bg-gray-900 text-white py-3 px-4 hover:bg-gray-800 transition-colors font-medium"
                disabled={!isServiceAvailable}
              >
                Book Now
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                className="w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 hover:bg-gray-50 transition-colors font-medium disabled:bg-gray-100 disabled:text-gray-400"
                disabled={!isProductAvailable}
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white py-3 px-4 hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400"
                disabled={!isProductAvailable}
              >
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
