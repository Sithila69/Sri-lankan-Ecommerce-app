import { SortOption } from "@/types/listings";

interface ListingsSortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  className?: string;
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
] as const;

const ListingsSortControls = ({
  sortBy,
  onSortChange,
  className = "",
}: ListingsSortControlsProps) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ListingsSortControls;
