import { Filter, ChevronDown, Grid3X3, Package, Wrench } from "lucide-react";
import { Category, FilterType, SortOption } from "@/types/listings";
import ListingsSortControls from "./ListingsSortControls";

interface ListingsFiltersProps {
  selectedType: FilterType;
  selectedCategory: string;
  sortBy: SortOption;
  showFilters: boolean;
  availableCategories: Category[];
  listingsCount: number;
  isLoading: boolean;
  onTypeChange: (type: FilterType) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortOption) => void;
  onToggleFilters: () => void;
}

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
] as const;

const ListingsFilters = ({
  selectedType,
  selectedCategory,
  sortBy,
  showFilters,
  availableCategories,
  listingsCount,
  isLoading,
  onTypeChange,
  onCategoryChange,
  onSortChange,
  onToggleFilters,
}: ListingsFiltersProps) => {
  const selectedCategoryName =
    availableCategories.find((c) => c.slug === selectedCategory)?.name ||
    "All Categories";

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 mt-12">
      {/* Mobile: Stack everything vertically */}
      <div className="block sm:hidden space-y-4">
        {/* Results Count - Mobile */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isLoading ? (
              <span className="inline-block w-32 h-4 bg-gray-300 animate-pulse rounded" />
            ) : (
              `${listingsCount} listings found`
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
            onChange={(e) => onTypeChange(e.target.value as FilterType)}
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
            onClick={onToggleFilters}
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
                    onClick={() => onCategoryChange(category.slug)}
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
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            {[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "popular", label: "Most Popular" },
            ].map((option) => (
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
              onChange={(e) => onTypeChange(e.target.value as FilterType)}
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
              onClick={onToggleFilters}
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
                      onClick={() => onCategoryChange(category.slug)}
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
              `${listingsCount} listings found`
            )}
          </div>
        </div>

        {/* Sort Options - Desktop */}
        <ListingsSortControls sortBy={sortBy} onSortChange={onSortChange} />
      </div>
    </div>
  );
};

export default ListingsFilters;
