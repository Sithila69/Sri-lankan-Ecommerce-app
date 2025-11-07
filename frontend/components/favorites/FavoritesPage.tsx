import React from "react";
import { Heart, ArrowLeft } from "lucide-react";
import ProductCard from "../common/ProductCard";

interface Product {
  id: number;
  name: string;
  category: string;
  type: string;
  price: number;
  currency: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  seller: string;
  pricing?: string;
  stock: number;
}

interface FavoritesPageProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  favorites: number[];
  products: Product[];
  toggleFavorite: (productId: number) => void;
  setSelectedProduct: (product: Product) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  setCurrentView,
  favorites,
  products,
  toggleFavorite,
  setSelectedProduct,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView("store")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Your Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              You don&apos;t have any favorites yet
            </p>
            <button
              onClick={() => setCurrentView("store")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter((product) => favorites.includes(product.id))
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  setSelectedProduct={setSelectedProduct}
                  setCurrentView={setCurrentView}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
