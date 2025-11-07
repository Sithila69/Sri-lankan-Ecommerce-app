import { useRouter } from "next/navigation";
import { Grid3X3 } from "lucide-react";
import { FilterType } from "@/types/listings";

interface ListingsEmptyStateProps {
  onViewAll: () => void;
}

const ListingsEmptyState = ({ onViewAll }: ListingsEmptyStateProps) => {
  const router = useRouter();

  return (
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
          onClick={onViewAll}
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
  );
};

export default ListingsEmptyState;
