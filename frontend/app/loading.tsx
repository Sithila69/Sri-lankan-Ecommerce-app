import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Loading Spinner */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-black"></div>
            </div>
            <div className="w-16 h-px bg-black mx-auto"></div>
          </div>

          {/* Loading Text */}
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              Loading...
            </h2>
            <p className="text-gray-600">
              Please wait while we prepare your content
            </p>
          </div>

          {/* Loading Animation Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoadingPage;
