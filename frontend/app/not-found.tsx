"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Home, Search, ArrowLeft, Grid3X3 } from "lucide-react";

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleBrowseCategories = () => {
    router.push("/categories");
  };

  const handleSearch = () => {
    // You can implement search functionality here
    // For now, redirect to categories
    router.push("/categories");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-light text-gray-200 select-none">
              404
            </h1>
            <div className="relative -mt-8">
              <div className="w-24 h-px bg-black mx-auto"></div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to a
              different location.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={handleGoHome}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-black text-white px-8 py-4 hover:bg-gray-800 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              <span>Go to Homepage</span>
            </button>

            <button
              onClick={handleGoBack}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-900 px-8 py-4 hover:border-gray-400 hover:shadow-sm transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Additional Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-6">
              Or try one of these options:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={handleBrowseCategories}
                className="flex items-center justify-center space-x-2 bg-gray-50 border border-gray-200 text-gray-700 px-6 py-3 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-sm font-medium"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Browse Categories</span>
              </button>

              <button
                onClick={handleSearch}
                className="flex items-center justify-center space-x-2 bg-gray-50 border border-gray-200 text-gray-700 px-6 py-3 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-sm font-medium"
              >
                <Search className="w-4 h-4" />
                <span>Search Products</span>
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12">
            <p className="text-xs text-gray-400">
              If you believe this is an error, please{" "}
              <a
                href="/contact"
                className="text-gray-600 hover:text-black transition-colors underline"
              >
                contact our support team
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
