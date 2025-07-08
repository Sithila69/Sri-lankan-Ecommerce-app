import React from "react";
import { Search } from "lucide-react";

const EmptyState = ({ resetFilters }) => (
  <div className="text-center py-12">
    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <p className="text-gray-500 text-lg mb-4">
      No products found matching your criteria
    </p>
    <button
      onClick={resetFilters}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Reset Filters
    </button>
  </div>
);

export default EmptyState;
