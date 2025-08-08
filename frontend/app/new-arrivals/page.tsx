"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductsGrid from "@/components/common/ProductsGrid";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Listing } from "@/types";
import {
  Clock,
  Package,
  Wrench,
  Calendar,
  Filter,
  ChevronDown,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

type FilterType = "all" | "products" | "services";
type DateRange = "7" | "30" | "90";

const NewArrivalsPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<FilterType>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>("30");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const dateRangeOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
  ];

  const typeOptions = [
    {
      value: "all",
      label: "All Items",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      value: "products",
      label: "Products Only",
      icon: <Package className="w-4 h-4" />,
    },
    {
      value: "services",
      label: "Services Only",
      icon: <Wrench className="w-4 h-4" />,
    },
  ];

  // Load categories on initial load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/listings/categories`
        );
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Set initial filters from URL params
  useEffect(() => {
    const typeParam = (searchParams.get("type") as FilterType) || "all";
    const categoryParam = searchParams.get("category") || "all";
    const daysParam = (searchParams.get("days") as DateRange) || "30";

    setSelectedType(typeParam);
    setSelectedCategory(categoryParam);
    setSelectedDateRange(daysParam);
  }, [searchParams]);

  // Fetch listings when filters change
  useEffect(() => {
    const fetchNewArrivals = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          days_back: selectedDateRange,
          limit: "50",
        });

        if (selectedCategory !== "all") {
          params.append("category_id", selectedCategory);
        }

        if (selectedType !== "all") {
          params.append(
            "listing_type",
            selectedType === "products" ? "product" : "service"
          );
        }

        const response = await fetch(
          `http://localhost:8080/listings/new-arrivals?${params.toString()}`
        );
        const data = await response.json();
        setListings(data.listings || []);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, [selectedType, selectedCategory, selectedDateRange]);

  const handleTypeChange = (newType: FilterType) => {
    setSelectedType(newType);
    updateURL(newType, selectedCategory, selectedDateRange);
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setShowFilters(false);
    updateURL(selectedType, newCategory, selectedDateRange);
  };

  const handleDateRangeChange = (newRange: DateRange) => {
    setSelectedDateRange(newRange);
    updateURL(selectedType, selectedCategory, newRange);
  };

  const updateURL = (type: FilterType, category: string, days: DateRange) => {
    const params = new URLSearchParams();
    if (type !== "all") {
      params.set("type", type);
    }
    if (category !== "all") {
      params.set("category", category);
    }
    if (days !== "30") {
      params.set("days", days);
    }

    const newUrl = params.toString()
      ? `/new-arrivals?${params.toString()}`
      : "/new-arrivals";
    router.push(newUrl, { scroll: false });
  };

  const availableCategories = [
    { id: 0, name: "All Categories", slug: "all" },
    ...categories,
  ];

  const selectedCategoryName =
    availableCategories.find((c) => c.slug === selectedCategory)?.name ||
    "All Categories";

  const selectedDateRangeLabel =
    dateRangeOptions.find((d) => d.value === selectedDateRange)?.label ||
    "Last 30 days";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />

        <div className="mt-8">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-8 h-8 text-gray-700" />
            <h1 className="text-4xl font-light text-gray-900">New Arrivals</h1>
          </div>
          <div className="w-16 h-px bg-black"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Discover the latest products and services added to our marketplace
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 mt-12">
          {/* Mobile: Stack everything vertically */}
          <div className="block sm:hidden space-y-4">
            {/* Results Count - Mobile */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLoading ? (
                  <span className="inline-block w-32 h-4 bg-gray-300 animate-pulse rounded" />
                ) : (
                  `${listings.length} new items found`
                )}
              </p>
            </div>

            {/* Date Range Filter - Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) =>
                  handleDateRangeChange(e.target.value as DateRange)
                }
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter - Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value as FilterType)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter - Mobile */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <span className="font-medium text-gray-900">
                  {selectedCategoryName}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showFilters && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                  <div className="py-2">
                    {availableCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedCategory === category.slug
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-6">
              {/* Date Range Filter - Desktop */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Period:
                </span>
                <select
                  value={selectedDateRange}
                  onChange={(e) =>
                    handleDateRangeChange(e.target.value as DateRange)
                  }
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter - Desktop */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) =>
                    handleTypeChange(e.target.value as FilterType)
                  }
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter - Desktop */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {selectedCategoryName}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    <div className="py-2">
                      {availableCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.slug)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                            selectedCategory === category.slug
                              ? "bg-gray-100 text-gray-900 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Count - Desktop */}
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <div className="w-32 h-4 bg-gray-300 animate-pulse rounded" />
                ) : (
                  `${listings.length} new items found`
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Filters Display */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Active Filters:
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {selectedDateRangeLabel}
                </span>
                {selectedType !== "all" && (
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {typeOptions.find((t) => t.value === selectedType)?.icon}
                    <span className="ml-1">
                      {typeOptions.find((t) => t.value === selectedType)?.label}
                    </span>
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCategoryName}
                  </span>
                )}
              </div>
              {(selectedType !== "all" || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSelectedType("all");
                    setSelectedCategory("all");
                    updateURL("all", "all", selectedDateRange);
                  }}
                  className="text-sm text-gray-600 hover:text-black font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <ProductsGrid listings={listings} isLoading={isLoading} />

        {/* Empty State */}
        {!isLoading && listings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No new arrivals found
            </h3>
            <p className="text-gray-600 mb-6">
              No new items have been added in the{" "}
              {selectedDateRangeLabel.toLowerCase()}. Try extending your search
              period or explore our full catalog.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleDateRangeChange("90")}
                className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium rounded-lg"
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Extend to 3 Months
              </button>
              <button
                onClick={() => router.push("/categories/listings")}
                className="bg-white border border-gray-300 text-gray-900 px-6 py-3 hover:border-gray-400 transition-colors font-medium rounded-lg"
              >
                Browse All Listings
              </button>
            </div>

            {/* Quick suggestions */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => {
                  setSelectedType("products");
                  setSelectedDateRange("90");
                  updateURL("products", selectedCategory, "90");
                }}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center border border-gray-200"
              >
                <Package className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  New Products
                </span>
              </button>
              <button
                onClick={() => {
                  setSelectedType("services");
                  setSelectedDateRange("90");
                  updateURL("services", selectedCategory, "90");
                }}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center border border-gray-200"
              >
                <Wrench className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  New Services
                </span>
              </button>
              <button
                onClick={() => router.push("/categories")}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center border border-gray-200"
              >
                <div className="w-6 h-6 bg-gray-400 rounded mx-auto mb-2"></div>
                <span className="text-sm font-medium text-gray-900">
                  All Categories
                </span>
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewArrivalsPage;
