"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductsGrid from "@/components/common/ProductsGrid";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Listing } from "@/types";
import { Filter, ChevronDown } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "popular";

const ProductCategoryPage = () => {
  const [products, setProducts] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = params?.category as string;

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  // Load categories on initial load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await fetch(
          `http://localhost:8080/categories/type/product`
        );
        const categoriesData = await categoriesResponse.json();
        const fetchedCategories = [
          { id: 0, name: "All Categories", slug: "all" },
          ...(categoriesData.categories || []),
        ];
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([{ id: 0, name: "All Categories", slug: "all" }]);
      }
    };

    fetchCategories();
  }, []);

  // Set category from URL params and sort from query params
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
    const sortParam = (searchParams.get("sort") as SortOption) || "newest";
    setSortBy(sortParam);
  }, [categorySlug, searchParams]);

  // Fetch products when category or sort changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
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

        const productsResponse = await fetch(
          `http://localhost:8080/products/category/${selectedCategory}?limit=100${sortParam}`
        );
        const productsData = await productsResponse.json();
        const fetchedProducts = productsData.products || [];

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a selected category
    if (selectedCategory) {
      fetchProducts();
    }
  }, [selectedCategory, sortBy]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setShowFilters(false);

    // Navigate to the appropriate route
    if (categorySlug === "all") {
      // Go to main products page
      const params = new URLSearchParams();
      if (sortBy !== "newest") {
        params.set("sort", sortBy);
      }
      const newUrl = params.toString()
        ? `/products?${params.toString()}`
        : "/products";
      router.push(newUrl);
    } else {
      // Go to category-specific route
      const params = new URLSearchParams();
      if (sortBy !== "newest") {
        params.set("sort", sortBy);
      }
      const newUrl = params.toString()
        ? `/products/${categorySlug}?${params.toString()}`
        : `/products/${categorySlug}`;
      router.push(newUrl);
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);

    // Update URL with sort parameter
    const params = new URLSearchParams();
    if (newSort !== "newest") {
      params.set("sort", newSort);
    }

    const newUrl = params.toString()
      ? `/products/${categorySlug}?${params.toString()}`
      : `/products/${categorySlug}`;
    router.push(newUrl, { scroll: false });
  };

  const selectedCategoryName =
    categories.find((c) => c.slug === selectedCategory)?.name ||
    "All Categories";

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ];

  if (selectedCategory !== "all") {
    breadcrumbItems.push({
      label: selectedCategoryName,
      href: "",
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />

        <div className="mt-8">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            {selectedCategory === "all" ? "Products" : selectedCategoryName}
          </h1>
          <div className="w-16 h-px bg-black"></div>
        </div>

        {/* Filter and Sort Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 mt-12">
          {/* Mobile: Stack everything vertically */}
          <div className="block sm:hidden space-y-4">
            {/* Results Count - Mobile */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLoading ? (
                  <span className="inline-block w-32 h-4 bg-gray-300 animate-pulse rounded" />
                ) : (
                  `${products.length} products found`
                )}
              </p>
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
                    {categories.map((category) => (
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
                      {categories.map((category) => (
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
                {isLoading ? (
                  <div className="w-32 h-4 bg-gray-300 animate-pulse rounded" />
                ) : (
                  `${products.length} products found`
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

        {/* Products Grid */}
        <ProductsGrid listings={products} isLoading={isLoading} />

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or browse all categories
            </p>
            <button
              onClick={() => handleCategoryChange("all")}
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
            >
              View All Products
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductCategoryPage;
