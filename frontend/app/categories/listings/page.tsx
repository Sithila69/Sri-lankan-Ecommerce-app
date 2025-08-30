"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductsGrid from "@/components/common/ProductsGrid";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Listing } from "@/types";
import { Filter, ChevronDown, Grid3X3, Package, Wrench } from "lucide-react";
import { getBaseURL } from "@/utils/getBaseURL";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: number;
  name: string;
  slug: string;
}

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "popular";
type FilterType = "all" | "products" | "services";

const fetchCategories = async () => {
  const [productResponse, serviceResponse] = await Promise.all([
    fetch(`${getBaseURL()}/categories/type/product`),
    fetch(`${getBaseURL()}/categories/type/service`),
  ]);

  const productData = await productResponse.json();
  const serviceData = await serviceResponse.json();

  return {
    productCategories: productData.categories || [],
    serviceCategories: serviceData.categories || [],
  };
};

const AllListingsPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<FilterType>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [showFilters, setShowFilters] = useState(false);
  const {
    data,
    isLoading: categoriesLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  const typeOptions = [
    {
      value: "all",
      label: "All Listings",
      icon: <Grid3X3 className="w-4 h-4" />,
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

  // Set categories from React Query data
  useEffect(() => {
    if (data) {
      setProductCategories(data.productCategories || []);
      setServiceCategories(data.serviceCategories || []);
    }
  }, [data]);

  // Set initial filters from URL params
  useEffect(() => {
    const typeParam = (searchParams.get("type") as FilterType) || "all";
    const categoryParam = searchParams.get("category") || "all";
    const sortParam = (searchParams.get("sort") as SortOption) || "newest";

    setSelectedType(typeParam);
    setSelectedCategory(categoryParam);
    setSortBy(sortParam);
  }, [searchParams]);

  // Add loading state for listings
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  // Fetch listings when filters change
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoadingListings(true);
      try {
        // Build sort parameter for API
        let sortParam = "";
        switch (sortBy) {
          case "oldest":
            sortParam = "&sort=created_at&order=asc";
            break;
          case "price-low":
            sortParam = "&sort=base_price&order=asc";
            break;
          case "price-high":
            sortParam = "&sort=base_price&order=desc";
            break;
          case "popular":
            sortParam = "&sort=views_count&order=desc";
            break;
          default: // newest
            sortParam = "&sort=created_at&order=desc";
        }

        let allListings: Listing[] = [];

        if (selectedType === "all" || selectedType === "products") {
          try {
            const productsResponse = await fetch(
              `${getBaseURL()}/products/category/${selectedCategory}?limit=100${sortParam}`
            );
            const productsData = await productsResponse.json();
            const products = (productsData.products || []).map(
              (item: Listing) => ({
                ...item,
                type: "product" as const,
              })
            );
            allListings = [...allListings, ...products];
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        }

        if (selectedType === "all" || selectedType === "services") {
          try {
            const servicesResponse = await fetch(
              `${getBaseURL()}/services/category/${selectedCategory}?limit=100${sortParam}`
            );
            const servicesData = await servicesResponse.json();
            const services = (servicesData.services || []).map(
              (item: Listing) => ({
                ...item,
                type: "service" as const,
              })
            );
            allListings = [...allListings, ...services];
          } catch (error) {
            console.error("Error fetching services:", error);
          }
        }

        // Sort combined results if needed
        if (sortBy === "newest") {
          allListings.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        } else if (sortBy === "oldest") {
          allListings.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        } else if (sortBy === "price-low") {
          allListings.sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
        } else if (sortBy === "price-high") {
          allListings.sort((a, b) => (b.base_price || 0) - (a.base_price || 0));
        } else if (sortBy === "popular") {
          allListings.sort(
            (a, b) => (b.views_count || 0) - (a.views_count || 0)
          );
        }

        setListings(allListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } finally {
        setIsLoadingListings(false);
      }
    };

    fetchListings();
  }, [selectedType, selectedCategory, sortBy]);

  const handleTypeChange = (newType: FilterType) => {
    setSelectedType(newType);
    updateURL(newType, selectedCategory, sortBy);
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setShowFilters(false);
    updateURL(selectedType, newCategory, sortBy);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    updateURL(selectedType, selectedCategory, newSort);
  };

  const updateURL = (type: FilterType, category: string, sort: SortOption) => {
    const params = new URLSearchParams();
    if (type !== "all") {
      params.set("type", type);
    }
    if (category !== "all") {
      params.set("category", category);
    }
    if (sort !== "newest") {
      params.set("sort", sort);
    }

    const newUrl = params.toString()
      ? `/categories/listings?${params.toString()}`
      : "/categories/listings";
    router.push(newUrl, { scroll: false });
  };

  // Get available categories based on selected type
  const getAvailableCategories = () => {
    const allCategories = [{ id: 0, name: "All Categories", slug: "all" }];

    if (selectedType === "all") {
      // Combine and deduplicate categories
      const combined = [...productCategories, ...serviceCategories];
      const unique = combined.filter(
        (category, index, self) =>
          index === self.findIndex((c) => c.slug === category.slug)
      );
      return [...allCategories, ...unique];
    } else if (selectedType === "products") {
      return [...allCategories, ...productCategories];
    } else if (selectedType === "services") {
      return [...allCategories, ...serviceCategories];
    }

    return allCategories;
  };

  const availableCategories = getAvailableCategories();
  const selectedCategoryName =
    availableCategories.find((c) => c.slug === selectedCategory)?.name ||
    "All Categories";
  const selectedTypeName =
    typeOptions.find((t) => t.value === selectedType)?.label || "All Listings";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />

        <div className="mt-8">
          <div className="flex items-center space-x-3 mb-4">
            <Grid3X3 className="w-8 h-8 text-gray-700" />
            <h1 className="text-4xl font-light text-gray-900">All Listings</h1>
          </div>
          <div className="w-16 h-px bg-black"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Browse all products and services in one place
          </p>
        </div>

        {/* Filter and Sort Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 mt-12">
          {/* Mobile: Stack everything vertically */}
          <div className="block sm:hidden space-y-4">
            {/* Results Count - Mobile */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLoadingListings ? (
                  <span className="inline-block w-32 h-4 bg-gray-300 animate-pulse rounded" />
                ) : (
                  `${listings.length} listings found`
                )}
              </p>
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
                            ? "bg-blue-50 text-blue-700 font-medium"
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

            {/* Sort Options - Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-6">
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
                              ? "bg-blue-50 text-blue-700 font-medium"
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
                {isLoadingListings ? (
                  <div className="w-32 h-4 bg-gray-300 animate-pulse rounded" />
                ) : (
                  `${listings.length} listings found`
                )}
              </div>
            </div>

            {/* Sort Options - Desktop */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <ProductsGrid listings={listings} isLoading={isLoadingListings} />

        {/* Empty State */}
        {!isLoadingListings && listings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 flex items-center justify-center">
              <Grid3X3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or browse all categories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleTypeChange("all")}
                className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium rounded-lg"
              >
                View All Listings
              </button>
              <button
                onClick={() => router.push("/categories")}
                className="bg-white border border-gray-300 text-gray-900 px-6 py-3 hover:border-gray-400 transition-colors font-medium rounded-lg"
              >
                Browse Categories
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllListingsPage;
