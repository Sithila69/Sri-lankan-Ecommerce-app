"use client";
import React, { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  Heart,
  Plus,
  Minus,
  CheckCircle,
} from "lucide-react";

interface Seller {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  contact_email: string;
  contact_phone: string;
}

interface Product {
  id: number;
  name: string;
  seller: Seller;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  priceUnit?: string;
  image: string;
  hasOffer?: boolean;
  offerText?: string;
  isFavorited?: boolean;
  description: string;
  features: string[];
  type: string;
  serviceTime?: string;
  pricing?: string;
}

const ProductDetails: React.FC<{ product: Product }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddToCart = () => {
    // Add to cart logic here
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{product?.name}</h2>
          <p className="text-gray-600">{product?.seller.name}</p>
        </div>
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium ml-1 text-gray-500">
            {product?.rating}
          </span>
          <span className="text-xs text-black ml-1">({product?.reviews})</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          {product?.location}
        </div>
        {product?.type === "service" && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            {product?.serviceTime}
          </div>
        )}
      </div>

      <div className="mb-6">
        <p className="text-gray-700 mb-4">{product?.description}</p>

        {product?.features && (
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              LKR {product?.price.toLocaleString()}
            </span>
            {product?.pricing && (
              <span className="text-sm text-gray-500 ml-1">
                /{product?.pricing}
              </span>
            )}
          </div>

          {product?.type === "product" && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleAddToCart}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Add to Cart
          </button>
          <button
            onClick={() => {
              handleAddToCart();
              // setCurrentView("checkout");
            }}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
