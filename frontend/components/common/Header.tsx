"use client";
import {
  Heart,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { checkAuthStatus, logout } from "@/utils/auth";
import Image from "next/image";

const Header: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  // const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set client flag to prevent hydration mismatch
    // setIsClient(true);

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

    // Check authentication status
    const checkAuth = async () => {
      try {
        // Add a small delay to ensure loading state is visible
        await new Promise((resolve) => setTimeout(resolve, 100));
        const authStatus = await checkAuthStatus();
        setIsAuthenticated(authStatus.authenticated);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    // Get initial cart count
    getCartCount();

    // Check authentication
    checkAuth();

    // Listen for cart updates
    const handleCartUpdate = () => {
      getCartCount();
    };

    // Listen for auth updates
    const handleAuthUpdate = () => {
      checkAuth();
    };

    // Listen for localStorage changes (from other tabs)
    window.addEventListener("storage", handleCartUpdate);

    // Custom event for cart updates within the same tab
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Custom event for auth updates
    window.addEventListener("authUpdated", handleAuthUpdate);

    // Handle clicks outside dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("authUpdated", handleAuthUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-black"></div>
          </div>
          <h2 className="text-xl font-light text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      // Call the proper logout function that handles backend logout
      await logout();

      // Update auth state
      setIsAuthenticated(false);
      setIsUserDropdownOpen(false);

      // Notify other components
      window.dispatchEvent(new CustomEvent("authUpdated"));

      // Redirect to home
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, update local state and redirect
      setIsAuthenticated(false);
      setIsUserDropdownOpen(false);
      window.dispatchEvent(new CustomEvent("authUpdated"));
      window.location.href = "/";
    }
  };

  // Show full screen loader while checking auth
  // if (!isClient || isAuthLoading || isAuthenticated === null) {
  //   return (
  //     <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 mx-auto mb-6">
  //           <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-black"></div>
  //         </div>
  //         <h2 className="text-xl font-light text-gray-900 mb-2">Loading...</h2>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
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

              {isAuthenticated === false ? (
                <Link href="/auth/login">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black border border-gray-300 hover:border-black transition-colors">
                    Sign In
                  </button>
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center p-3 hover:bg-gray-50 text-gray-600 hover:text-black transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg z-50">
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Package className="w-4 h-4 mr-3" />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Heart className="w-4 h-4 mr-3" />
                          Wishlist
                        </Link>
                        <Link
                          href="/account/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              {isAuthenticated === false ? (
                <Link
                  href="/auth/login"
                  className="block w-full text-center bg-black text-white font-medium py-3 px-4 hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              ) : (
                <Link
                  href="/account"
                  className="block text-gray-900 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              )}
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
                href="/new-arrivals"
                className="block text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link
                href="/wishlist"
                className="block text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wishlist
              </Link>
              <Link
                href="/support"
                className="block text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
              <button
                onClick={handleLogout}
                className="block   py-2 font-medium text-red-600 "
              >
                Sign Out
              </button>
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
              Today&apos;s Deals
            </Link>
            <Link
              href="/new-arrivals"
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
