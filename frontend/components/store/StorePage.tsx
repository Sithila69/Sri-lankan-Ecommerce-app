import React, { useState } from "react";
import ProductCard from "../common/ProductCard";
import Filters from "./Filters";
import EmptyState from "./EmptyState";
import { Filter } from "lucide-react";

const StorePage = ({
  products,
  categories,
  setSelectedProduct,
  setCurrentView,
  favorites,
  toggleFavorite,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" ||
      product.location.toLowerCase() === selectedLocation;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPrice = true;
    if (priceRange !== "all") {
      const price = product.price;
      switch (priceRange) {
        case "under-1000":
          matchesPrice = price < 1000;
          break;
        case "1000-5000":
          matchesPrice = price >= 1000 && price <= 5000;
          break;
        case "5000-15000":
          matchesPrice = price >= 5000 && price <= 15000;
          break;
        case "over-15000":
          matchesPrice = price > 15000;
          break;
      }
    }

    return matchesCategory && matchesLocation && matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedCategory === "all"
              ? "All Products & Services"
              : categories.find((c) => c.id === selectedCategory)?.name}
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <Filters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        )}

        {filteredProducts.length === 0 ? (
          <EmptyState
            resetFilters={() => {
              setSelectedCategory("all");
              setSelectedLocation("all");
              setPriceRange("all");
              setSearchTerm("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={(product) => {
                  setSelectedProduct(product);
                  setCurrentView("product");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
