import React from "react";

const Filters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  priceRange,
  setPriceRange,
}) => {
  const locations = [
    { id: "all", name: "All Locations" },
    { id: "colombo", name: "Colombo" },
    { id: "kandy", name: "Kandy" },
    { id: "galle", name: "Galle" },
    { id: "negombo", name: "Negombo" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 text-sm w-full text-left px-3 py-2 rounded ${
                  selectedCategory === category.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="space-y-2">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location.id)}
                className={`block w-full text-left px-3 py-2 rounded text-sm ${
                  selectedLocation === location.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setPriceRange("all")}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${
                priceRange === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setPriceRange("under-1000")}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${
                priceRange === "under-1000"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Under LKR 1,000
            </button>
            <button
              onClick={() => setPriceRange("1000-5000")}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${
                priceRange === "1000-5000"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              LKR 1,000 - 5,000
            </button>
            <button
              onClick={() => setPriceRange("5000-15000")}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${
                priceRange === "5000-15000"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              LKR 5,000 - 15,000
            </button>
            <button
              onClick={() => setPriceRange("over-15000")}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${
                priceRange === "over-15000"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Over LKR 15,000
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
