"use client";
import { useRouter } from "next/navigation";
import {
  Package,
  Wrench,
  Search,
  ArrowLeft,
  Grid3X3,
  AlertCircle,
} from "lucide-react";

interface ItemNotFoundProps {
  type?: "product" | "service";
  category?: string;
  itemName?: string;
  reason?: "not_found" | "removed" | "unavailable";
}

const ItemNotFound: React.FC<ItemNotFoundProps> = ({
  type,
  category,
  itemName,
  reason = "not_found",
}) => {
  const router = useRouter();

  const typeLabel =
    type === "product" ? "Product" : type === "service" ? "Service" : "Item";
  const typePlural =
    type === "product" ? "products" : type === "service" ? "services" : "items";
  const typeIcon =
    type === "product" ? (
      <Package className="w-8 h-8" />
    ) : type === "service" ? (
      <Wrench className="w-8 h-8" />
    ) : (
      <Grid3X3 className="w-8 h-8" />
    );

  const getReasonMessage = () => {
    switch (reason) {
      case "removed":
        return `This ${typeLabel.toLowerCase()} has been removed by the seller or is no longer available.`;
      case "unavailable":
        return `This ${typeLabel.toLowerCase()} is currently unavailable but may return in the future.`;
      default:
        return `The ${typeLabel.toLowerCase()} you're looking for doesn't exist or the link may be incorrect.`;
    }
  };

  const getReasonTitle = () => {
    switch (reason) {
      case "removed":
        return `${typeLabel} Removed`;
      case "unavailable":
        return `${typeLabel} Unavailable`;
      default:
        return `${typeLabel} Not Found`;
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleBrowseCategory = () => {
    if (type && category) {
      router.push(`/categories/${type}s/${category}`);
    } else if (type) {
      router.push(`/categories/${type}s`);
    } else {
      router.push("/categories");
    }
  };

  const handleBrowseAll = () => {
    if (type) {
      router.push(`/categories/${type}s`);
    } else {
      router.push("/categories");
    }
  };

  const handleSearch = () => {
    router.push("/categories/listings");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      {/* Icon and Visual */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <div className="relative">
            {typeIcon}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          </div>
        </div>
        <div className="w-24 h-px bg-black mx-auto"></div>
      </div>

      {/* Error Message */}
      <div className="mb-12">
        <h1 className="text-3xl font-light text-gray-900 mb-4">
          {getReasonTitle()}
        </h1>

        {itemName && (
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700 mb-2">
              &quot;{itemName}&quot;
            </p>
          </div>
        )}

        <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
          {getReasonMessage()}
        </p>

        {reason === "removed" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-lg mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This item may have been discontinued, sold
              out, or the seller may have updated their listings.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-8">
        <button
          onClick={handleGoBack}
          className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-black text-white px-8 py-4 hover:bg-gray-800 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        {category && (
          <button
            onClick={handleBrowseCategory}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-900 px-8 py-4 hover:border-gray-400 hover:shadow-sm transition-all duration-200 font-medium"
          >
            {typeIcon}
            <span>
              Browse{" "}
              {category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
          </button>
        )}
      </div>

      {/* Additional Options */}
      <div className="border-t border-gray-200 pt-8">
        <p className="text-sm text-gray-500 mb-6">You might also want to:</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <button
            onClick={handleBrowseAll}
            className="flex items-center justify-center space-x-2 bg-gray-50 border border-gray-200 text-gray-700 px-6 py-3 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-sm font-medium"
          >
            {typeIcon}
            <span>
              All {typePlural.charAt(0).toUpperCase() + typePlural.slice(1)}
            </span>
          </button>

          <button
            onClick={handleSearch}
            className="flex items-center justify-center space-x-2 bg-gray-50 border border-gray-200 text-gray-700 px-6 py-3 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            <span>Search All</span>
          </button>

          <button
            onClick={handleGoHome}
            className="flex items-center justify-center space-x-2 bg-gray-50 border border-gray-200 text-gray-700 px-6 py-3 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-sm font-medium"
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-12">
        <p className="text-xs text-gray-400">
          Can&apos;t find what you&apos;re looking for?{" "}
          <a
            href="/contact"
            className="text-gray-600 hover:text-black transition-colors underline"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default ItemNotFound;
