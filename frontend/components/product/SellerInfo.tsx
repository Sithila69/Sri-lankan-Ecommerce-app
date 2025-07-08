import React from "react";
import { User, Star } from "lucide-react";

interface Seller {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  contact_email: string;
  contact_phone: string;
}

const SellerInfo: React.FC<{ seller: Seller }> = ({ seller }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">About the Seller</h3>
      <div className="flex items-start gap-4">
        <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{seller?.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{seller?.rating}</span>
            <span className="text-sm text-gray-400">
              ({seller?.reviews} reviews)
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View Shop
            </button>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
