"use client";
import { Heart, MapPin, Star } from "lucide-react";
import { useState } from "react";
import navigation from "next/navigation";
import router from "next/router";
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
  title: string;
  seller: Seller;
  rating: number;
  reviewCount: number;
  location: string;
  price: number;
  priceUnit?: string;
  image: string;
  hasOffer?: boolean;
  offerText?: string;
  isFavorited?: boolean;
}

import Link from "next/link";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isFavorited, setIsFavorited] = useState(product.isFavorited || false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        {product.hasOffer && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-medium">
            {product.offerText}
          </div>
        )}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.seller.name}</p>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            <span className="text-sm text-gray-500 ml-1">
              ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-center ml-4">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 ml-1">
              {product.location}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            LKR {product.price.toLocaleString()}
            {product.priceUnit && (
              <span className="text-sm text-gray-500 font-normal">
                {" "}
                /{product.priceUnit}
              </span>
            )}
          </div>
          <Link href={`/product/${product.id}`}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
