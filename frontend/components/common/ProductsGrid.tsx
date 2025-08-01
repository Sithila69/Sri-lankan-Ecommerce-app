import { Listing } from "@/types";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";

const ProductsGrid: React.FC<{ listings: Listing[]; isLoading: boolean }> = ({
  listings,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  // if (!listings || listings.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <p className="text-gray-500">No listings found.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ProductCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};
export default ProductsGrid;
