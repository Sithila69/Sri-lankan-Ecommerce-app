"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductsGrid from "@/components/common/ProductsGrid";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Listing } from "@/types";
import { Clock, Package, Wrench, Calendar } from "lucide-react";

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
          `http://localhost:8080/listings?${params.toString()}`
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
            <Clock className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-light text-gray-900">New Arrivals</h1>
          </div>
          <div className="w-16 h-px bg-blue-600"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Discover the latest products and services added to our marketplace
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8 mt-12">
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
                <Calendar className="w-4 h-4 inline mr-2" />
                Time Period
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) =>
                  handleDateRangeChange(e.target.value as DateRange)
                }
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter - Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-6">
              {/* Date Range Filter - Desktop */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Period:
                </span>
                <select
                  value={selectedDateRange}
                  onChange={(e) =>
                    handleDateRangeChange(e.target.value as DateRange)
                  }
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter - Desktop */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Category:
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {availableCategories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
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

        {/* Current Filters Display */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>Showing:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              {selectedDateRangeLabel}
            </span>
            {selectedType !== "all" && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                {typeOptions.find((t) => t.value === selectedType)?.label}
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                {selectedCategoryName}
              </span>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        <ProductsGrid listings={listings} isLoading={isLoading} />

        {/* Empty State */}
        {!isLoading && listings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No new arrivals found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your time period or browse all listings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleDateRangeChange("90")}
                className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors font-medium rounded-lg"
              >
                Extend to 3 Months
              </button>
              <button
                onClick={() => router.push("/categories/listings")}
                className="bg-white border border-gray-300 text-gray-900 px-6 py-3 hover:border-gray-400 transition-colors font-medium rounded-lg"
              >
                Browse All Listings
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
