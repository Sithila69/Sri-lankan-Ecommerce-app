"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Wrench, ChevronRight, Grid3X3 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface CategorySection {
  type: "products" | "services";
  label: string;
  icon: React.ReactNode;
  categories: Category[];
  isLoading: boolean;
}

const CategoriesSection = () => {
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

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

  const sections: CategorySection[] = [
    {
      type: "products",
      label: "Product Categories",
      icon: <Package className="w-5 h-5" />,
      categories: productCategories,
      isLoading: isLoadingProducts,
    },
    {
      type: "services",
      label: "Service Categories",
      icon: <Wrench className="w-5 h-5" />,
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
    <Link href={`/categories/${type}/${category.slug}`}>
      <div className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
              {category.name}
            </h4>
            {category.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-4" />
        </div>
      </div>
    </Link>
  );

  const CategorySkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse ml-4"></div>
      </div>
    </div>
  );

  return (
    <div className="border-t border-gray-200 pt-16">
      <div className="mb-12 text-center">
        <h3 className="text-3xl font-light text-gray-900 mb-4">
          Browse by Category
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find exactly what you're looking for in our organized categories
        </p>
        <div className="w-16 h-px bg-black mx-auto mt-6"></div>
      </div>

      <div className="space-y-16">
        {sections.map((section) => (
          <div key={section.type}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">{section.icon}</div>
                <div>
                  <h4 className="text-2xl font-light text-gray-900">
                    {section.label}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {section.isLoading ? (
                      <span className="inline-block w-24 h-4 bg-gray-300 animate-pulse rounded"></span>
                    ) : (
                      `${section.categories.length} categories available`
                    )}
                  </p>
                </div>
              </div>

              <Link href={`/categories/${section.type}`}>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer">
                  <span>
                    View All{" "}
                    {section.type === "products" ? "Products" : "Services"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <CategorySkeleton key={index} />
                ))
              ) : section.categories.length > 0 ? (
                // Show first 6 categories
                section.categories
                  .slice(0, 6)
                  .map((category) => (
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
                  <h5 className="text-lg font-medium text-gray-900 mb-2">
                    No {section.type} categories found
                  </h5>
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

      {/* View All Categories Button */}
      <div className="text-center mt-16">
        <Link href="/categories">
          <div className="inline-flex items-center space-x-3 bg-black text-white px-8 py-4 hover:bg-gray-800 transition-colors font-medium cursor-pointer">
            <Grid3X3 className="w-5 h-5" />
            <span>View All Categories</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CategoriesSection;
