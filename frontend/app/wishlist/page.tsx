"use client";
import React, { useState } from "react";
import {
  Heart,
  Trash2,
  ShoppingCart,
  Star,
  Grid,
  List,
  Search,
  Filter,
} from "lucide-react";

import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

// Mock data for wishlist items
const mockWishlistItems = [
  {
    id: 1,
    name: "Artisan Coffee Blend",
    business: "Local Roasters Co.",
    price: 24.99,
    originalPrice: 29.99,
    image: "/api/placeholder/300/300",
    rating: 4.8,
    reviews: 127,
    inStock: true,
    category: "Food & Beverage",
  },
  {
    id: 2,
    name: "Handcrafted Leather Wallet",
    business: "Heritage Crafts",
    price: 89.99,
    originalPrice: null,
    image: "/api/placeholder/300/300",
    rating: 4.9,
    reviews: 89,
    inStock: false,
    category: "Accessories",
  },
  {
    id: 3,
    name: "Organic Honey Set",
    business: "Meadow Bee Farm",
    price: 34.99,
    originalPrice: 39.99,
    image: "/api/placeholder/300/300",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    category: "Food & Beverage",
  },
  {
    id: 4,
    name: "Ceramic Plant Pot",
    business: "Clay & Co.",
    price: 45.0,
    originalPrice: null,
    image: "/api/placeholder/300/300",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    category: "Home & Garden",
  },
];

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  const categories = [
    "all",
    ...Array.from(new Set(mockWishlistItems.map((item) => item.category))),
  ];

  const removeFromWishlist = (itemId: number) => {
    setWishlistItems((items) => items.filter((item) => item.id !== itemId));
  };

  const filteredItems = wishlistItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.business.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStock = showOutOfStock || item.inStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h1 className="text-5xl font-light text-black mb-4">My Wishlist</h1>
            <p className="text-xl text-gray-600 mb-2">
              {wishlistItems.length} carefully curated items
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="border-b border-gray-200 bg-white text-gray-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 space-y-4 sm:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOutOfStock}
                  onChange={(e) => setShowOutOfStock(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Show out of stock</span>
              </label>

              <div className="flex border border-gray-300">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-light text-gray-900 mb-3">
              {searchTerm || selectedCategory !== "all"
                ? "No matches found"
                : "Your wishlist awaits"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Discover amazing products from local businesses and start building your wishlist"}
            </p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white py-3 px-8 font-medium hover:bg-gray-800 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600">
                Showing {filteredItems.length} of {wishlistItems.length} items
              </p>
            </div>

            {/* Items Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="bg-white border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-lg">
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-sm transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500" />
                        </button>
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-medium">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-2">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.business}
                          </p>
                        </div>

                        <div className="flex items-center mb-3">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {item.rating}
                          </span>
                          <span className="text-sm text-gray-400 ml-1">
                            ({item.reviews})
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-medium text-gray-900">
                              ${item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          disabled={!item.inStock}
                          className={`w-full py-2 px-4 text-sm font-medium transition-colors ${
                            item.inStock
                              ? "bg-black text-white hover:bg-gray-800"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {item.inStock
                            ? "Add to Cart"
                            : "Notify When Available"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 hover:border-black transition-colors"
                  >
                    <div className="p-6 flex items-center space-x-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.business}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {item.rating} ({item.reviews})
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {item.category}
                          </span>
                          {!item.inStock && (
                            <span className="text-sm text-red-600 font-medium">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-medium text-gray-900">
                            ${item.price}
                          </div>
                          {item.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ${item.originalPrice}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            disabled={!item.inStock}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                              item.inStock
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {item.inStock ? "Add to Cart" : "Notify"}
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;
