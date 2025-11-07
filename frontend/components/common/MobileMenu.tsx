import { Search } from "lucide-react";
import React from "react";

type MobileMenuProps = {
  setCurrentView: (view: string) => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
};

const MobileMenu: React.FC<MobileMenuProps> = ({
  setCurrentView,
  setMobileMenuOpen,
}) => {
  const categories = [
    { id: "all", name: "All Categories", icon: "🏪" },
    { id: "food", name: "Food & Beverages", icon: "🍰" },
    { id: "services", name: "Services", icon: "🔧" },
    { id: "clothing", name: "Clothing & Textiles", icon: "👕" },
    { id: "crafts", name: "Handicrafts", icon: "🎨" },
  ];

  return (
    <div className="md:hidden pb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products and services..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="md:hidden border-t bg-white">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentView("store");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                selectedCategory === category.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
