"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductsGrid from "@/components/common/ProductsGrid";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  ListingsHeader,
  ListingsFilters,
  ListingsEmptyState,
} from "@/components/listings";
import {
  useCategoriesData,
  useListingsFilters,
  useListingsData,
} from "@/hooks";
import { Category } from "@/types/listings";

const AllListingsPage = () => {
  // Custom hooks for data and state management
  const { data: categoriesData } = useCategoriesData();
  const {
    filters,
    showFilters,
    setShowFilters,
    handleTypeChange,
    handleCategoryChange,
    handleSortChange,
  } = useListingsFilters();
  const { listings, isLoading } = useListingsData(filters);

  // Get available categories based on selected type
  const getAvailableCategories = (): Category[] => {
    const allCategories = [{ id: 0, name: "All Categories", slug: "all" }];

    if (!categoriesData) return allCategories;

    const { productCategories, serviceCategories } = categoriesData;

    if (filters.type === "all") {
      // Combine and deduplicate categories
      const combined = [...productCategories, ...serviceCategories];
      const unique = combined.filter(
        (category, index, self) =>
          index === self.findIndex((c) => c.slug === category.slug)
      );
      return [...allCategories, ...unique];
    } else if (filters.type === "products") {
      return [...allCategories, ...productCategories];
    } else if (filters.type === "services") {
      return [...allCategories, ...serviceCategories];
    }

    return allCategories;
  };

  const availableCategories = getAvailableCategories();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />

        <ListingsHeader />

        <ListingsFilters
          selectedType={filters.type}
          selectedCategory={filters.category}
          sortBy={filters.sort}
          showFilters={showFilters}
          availableCategories={availableCategories}
          listingsCount={listings.length}
          isLoading={isLoading}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <ProductsGrid listings={listings} isLoading={isLoading} />

        {!isLoading && listings.length === 0 && (
          <ListingsEmptyState onViewAll={() => handleTypeChange("all")} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllListingsPage;
