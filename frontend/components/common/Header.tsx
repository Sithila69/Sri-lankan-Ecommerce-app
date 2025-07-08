"use client";
import { Heart, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import router from "next/router";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">LankaMarket</h1>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Heart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-500" />
            <Link href={`/cart`}>
              <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500" />
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
