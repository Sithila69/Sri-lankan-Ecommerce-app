import { Grid3X3 } from "lucide-react";

const ListingsHeader = () => {
  return (
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
  );
};

export default ListingsHeader;
