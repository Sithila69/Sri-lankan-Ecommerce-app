"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Package, Wrench, ChevronRight, Grid3X3 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface CategorySection {
  type: "products" | "services";
  label: string;
  icon: React.ReactNode;
  categories: Category[];
  isLoading: boolean;
}

const CategoriesPage = () => {
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const router = useRouter();

  // Fetch product categories
  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/categories/type/product`
        );
        const data = await response.json();
        setProductCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching product categories:", error);
        setProductCategories([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProductCategories();
  }, []);

  // Fetch service categories
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/categories/type/service`
        );
        const data = await response.json();
        setServiceCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching service categories:", error);
        setServiceCategories([]);
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServiceCategories();
  }, []);

  const handleCategoryClick = (type: "products" | "services", slug: string) => {
    router.push(`/categories/${type}/${slug}`);
  };

  const handleViewAllClick = (type: "products" | "services") => {
    router.push(`/categories/${type}`);
  };

  const sections: CategorySection[] = [
    {
      type: "products",
      label: "Product Categories",
      icon: <Package className="w-6 h-6 text-gray-900" />,
      categories: productCategories,
      isLoading: isLoadingProducts,
    },
    {
      type: "services",
      label: "Service Categories",
      icon: <Wrench className="w-6 h-6 text-gray-900" />,
      categories: serviceCategories,
      isLoading: isLoadingServices,
    },
  ];

  const CategoryCard = ({
    category,
    type,
  }: {
    category: Category;
    type: "products" | "services";
  }) => (
    <button
      onClick={() => handleCategoryClick(type, category.slug)}
      className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left w-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
          {category.count !== undefined && (
            <p className="text-xs text-gray-500 mt-2">
              {category.count} {type === "products" ? "products" : "services"}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-4" />
      </div>
    </button>
  );

  const CategorySkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse ml-4"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />

        <div className="mt-8">
          <div className="flex items-center space-x-3 mb-4">
            <Grid3X3 className="w-8 h-8 text-gray-700" />
            <h1 className="text-4xl font-light text-gray-900">
              All Categories
            </h1>
          </div>
          <div className="w-16 h-px bg-black"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Browse all available product and service categories
          </p>
        </div>

        {/* Categories Sections */}
        <div className="mt-12 space-y-16">
          {sections.map((section) => (
            <div key={section.type}>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-gray-900">
                      {section.label}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {section.isLoading ? (
                        <span className="inline-block w-24 h-4 bg-gray-300 animate-pulse rounded"></span>
                      ) : (
                        `${section.categories.length} categories available`
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewAllClick(section.type)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                >
                  <span>
                    View All{" "}
                    {section.type === "products" ? "Products" : "Services"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <CategorySkeleton key={index} />
                  ))
                ) : section.categories.length > 0 ? (
                  // Category cards
                  section.categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      type={section.type}
                    />
                  ))
                ) : (
                  // Empty state
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      {section.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {section.type} categories found
                    </h3>
                    <p className="text-gray-600">
                      {section.type === "products" ? "Product" : "Service"}{" "}
                      categories will appear here when available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleViewAllClick("products")}
              className="flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg px-6 py-4 hover:border-gray-400 hover:shadow-sm transition-all duration-200"
            >
              <Package className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Browse All Products
              </span>
            </button>
            <button
              onClick={() => handleViewAllClick("services")}
              className="flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg px-6 py-4 hover:border-gray-400 hover:shadow-sm transition-all duration-200"
            >
              <Wrench className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Browse All Services
              </span>
            </button>
            <button
              onClick={() => router.push("/categories/listings")}
              className="flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg px-6 py-4 hover:border-gray-400 hover:shadow-sm transition-all duration-200"
            >
              <Grid3X3 className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                View All Listings
              </span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
