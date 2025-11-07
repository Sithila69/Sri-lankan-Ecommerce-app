import React from "react";
import {
  User,
  Star,
  MapPin,
  Phone,
  Mail,
  Store,
  Shield,
  MessageCircle,
  Check,
} from "lucide-react";
import { Seller } from "./../../types/seller";

const SellerInfo: React.FC<{ seller: Seller }> = ({ seller }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-gray-900 fill-current"
            : index < rating
            ? "text-gray-900 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Seller Information
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Check className="w-4 h-4 text-gray-900" />
          <span>Verified Seller</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Seller Profile */}
        <div className="flex items-start gap-4">
          <div className="relative">
            {seller?.logo_url ? (
              <img
                src={seller.logo_url}
                alt={seller.business_name}
                className="w-16 h-16 object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-50 border border-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-900 flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {seller?.business_name}
            </h4>

            {/* Rating */}
            <div className="flex items-center bg-gray-50 px-3 py-1.5 mb-3">
              <div className="flex items-center gap-0.5 mr-2">
                {renderStars(seller?.rating || 0)}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {seller?.rating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({formatReviewCount(seller?.total_reviews || 0)})
              </span>
            </div>

            {/* Location */}
            {(seller?.district || seller?.province) && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1.5" />
                <span>
                  {seller.district && seller.province
                    ? `${seller.district}, ${seller.province}`
                    : seller.district || seller.province}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {formatReviewCount(seller?.total_reviews || 0)}
              </div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {seller?.rating?.toFixed(1) || "0.0"}
              </div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3">
          <button className="w-full bg-gray-900 text-white py-3 px-4 hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2">
            <Store className="w-4 h-4" />
            Visit Store
          </button>
          <button className="w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Contact Seller
          </button>
        </div>
      </div>

      {/* Contact Information */}
      {(seller?.contact_phone || seller?.contact_email) && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seller.contact_phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                <span>{seller.contact_phone}</span>
              </div>
            )}
            {seller.contact_email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                <span>{seller.contact_email}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-gray-900" />
            <span>Verified Business</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-gray-900" />
            <span>Trusted Seller</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
