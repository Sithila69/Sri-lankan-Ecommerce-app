"use client";
import { Heart, Search, ShoppingCart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const Header: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Function to get unique item count from localStorage
    const getCartCount = () => {
      try {
        const cart = localStorage.getItem("guest_cart");
        if (cart) {
          const cartItems = JSON.parse(cart);
          // Count unique items (number of different products), not total quantities
          setCartCount(cartItems.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error reading cart:", error);
        setCartCount(0);
      }
    };

    // Get initial cart count
    getCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      getCartCount();
    };

    // Listen for localStorage changes (from other tabs)
    window.addEventListener("storage", handleCartUpdate);

    // Custom event for cart updates within the same tab
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/images/base_logo_black.png"
                  alt="kadey.lk logo"
                  width={60}
                  height={60}
                />
                <h1 className="text-xl font-medium text-black">Kadey.lk</h1>
              </Link>
            </div>
            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, stores, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/wishlist">
                <button className="p-3 hover:bg-gray-50 text-gray-600 hover:text-black">
                  <Heart className="w-5 h-5" />
                </button>
              </Link>

              <Link href="/cart">
                <button className="relative p-3 hover:bg-gray-50 text-gray-600 hover:text-black">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center font-medium">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </button>
              </Link>

              <Link href="/account">
                <button className="p-3 hover:bg-gray-50 text-gray-600 hover:text-black">
                  <User className="w-5 h-5" />
                </button>
              </Link>
            </div>
            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-50 text-gray-600"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link href="/cart">
                <button className="relative p-2 hover:bg-gray-50 text-gray-600">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center font-medium">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-50 text-gray-600"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black text-gray-900 placeholder-gray-500"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/categories"
                className="block text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/stores"
                className="block text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Local Stores
              </Link>
              <Link
                href="/deals"
                className="block text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Deals
              </Link>
              <Link
                href="/wishlist"
                className="block text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wishlist
              </Link>
              <Link
                href="/account"
                className="block text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Account
              </Link>
              <Link
                href="/support"
                className="block text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Secondary Navigation Bar */}
      <nav className="hidden md:block bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-12">
            <Link
              href="/categories"
              className="text-sm text-gray-600 hover:text-black font-medium"
            >
              All Categories
            </Link>
            <Link
              href="/stores"
              className="text-sm text-gray-600 hover:text-black font-medium"
            >
              Local Stores
            </Link>
            <Link
              href="/deals"
              className="text-sm text-gray-600 hover:text-black font-medium"
            >
              Today's Deals
            </Link>
            <Link
              href="/new"
              className="text-sm text-gray-600 hover:text-black font-medium"
            >
              New Arrivals
            </Link>
            <Link
              href="/support"
              className="text-sm text-gray-600 hover:text-black font-medium"
            >
              Help & Support
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Header;
