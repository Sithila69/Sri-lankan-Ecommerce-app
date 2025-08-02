"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { RefreshCw, Home, ArrowLeft, AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRetry = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <div className="w-24 h-px bg-black mx-auto"></div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-3xl font-light text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
              We encountered an unexpected error. This has been logged and we're
              working to fix it.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left max-w-lg mx-auto">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Error Details:
                </h3>
                <p className="text-xs text-gray-600 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-black text-white px-8 py-4 hover:bg-gray-800 transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={handleGoHome}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-900 px-8 py-4 hover:border-gray-400 hover:shadow-sm transition-all duration-200 font-medium"
            >
              <Home className="w-5 h-5" />
              <span>Go to Homepage</span>
            </button>
          </div>

          {/* Additional Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center space-x-2 bg-gray-50 border border-gray-200 text-gray-700 px-6 py-3 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-sm font-medium mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back to Previous Page</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-12">
            <p className="text-xs text-gray-400">
              If this problem persists, please{" "}
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

export default ErrorPage;
