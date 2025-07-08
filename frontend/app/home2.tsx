"use client";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ProductsGrid from "@/components/common/ProductsGrid";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
interface Product {
  id: number;
  title: string;
  seller: string;
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

const Home: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            All Products & Services
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>All Categories</option>
                  <option>Food & Beverages</option>
                  <option>Services</option>
                  <option>Clothing & Textiles</option>
                  <option>Handicrafts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>All Locations</option>
                  <option>Colombo</option>
                  <option>Kandy</option>
                  <option>Galle</option>
                  <option>Negombo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>All Prices</option>
                  <option>Under LKR 1,000</option>
                  <option>LKR 1,000 - 5,000</option>
                  <option>LKR 5,000 - 10,000</option>
                  <option>Above LKR 10,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>All Ratings</option>
                  <option>4.5+ Stars</option>
                  <option>4.0+ Stars</option>
                  <option>3.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <ProductsGrid products={products} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
