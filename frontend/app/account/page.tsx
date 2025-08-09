"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Package,
  Star,
  Bell,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const AccountPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in (you can replace this with your actual auth logic)
    const checkAuthStatus = () => {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setIsLoggedIn(false);
    setUser(null);
  };

  // Guest User View
  if (!isLoggedIn) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <User className="w-12 h-12 text-gray-400" />
            </div>

            <h1 className="text-3xl font-light text-black mb-4">My Account</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Sign in to track orders, save favorites, and shop faster
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/login"
                className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="border border-gray-300 text-gray-700 px-8 py-3 font-medium hover:border-black hover:text-black transition-colors"
              >
                Create Account
              </Link>
            </div>

            {/* Guest Features */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link
                href="/cart"
                className="p-6 border border-gray-200 hover:border-gray-300 transition-colors group"
              >
                <ShoppingBag className="w-8 h-8 text-gray-400 group-hover:text-black mb-4 mx-auto" />
                <h3 className="font-medium text-black mb-2">Shopping Cart</h3>
                <p className="text-sm text-gray-600">
                  Items you're ready to buy
                </p>
              </Link>

              <Link
                href="/wishlist"
                className="p-6 border border-gray-200 hover:border-gray-300 transition-colors group"
              >
                <Heart className="w-8 h-8 text-gray-400 group-hover:text-black mb-4 mx-auto" />
                <h3 className="font-medium text-black mb-2">Wishlist</h3>
                <p className="text-sm text-gray-600">
                  Things you want to buy later
                </p>
              </Link>

              <Link
                href="/categories"
                className="p-6 border border-gray-200 hover:border-gray-300 transition-colors group"
              >
                <Package className="w-8 h-8 text-gray-400 group-hover:text-black mb-4 mx-auto" />
                <h3 className="font-medium text-black mb-2">Browse Products</h3>
                <p className="text-sm text-gray-600">
                  Find what you're looking for
                </p>
              </Link>

              <Link
                href="/support"
                className="p-6 border border-gray-200 hover:border-gray-300 transition-colors group"
              >
                <HelpCircle className="w-8 h-8 text-gray-400 group-hover:text-black mb-4 mx-auto" />
                <h3 className="font-medium text-black mb-2">Help & Support</h3>
                <p className="text-sm text-gray-600">
                  Need help? We're here for you
                </p>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Logged In User View
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="font-medium text-black">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <a
                  href="#profile"
                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#orders"
                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-5 h-5" />
                    <span>My Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <Link
                  href="/wishlist"
                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <a
                  href="#addresses"
                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5" />
                    <span>Addresses</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#payment"
                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Methods</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#notifications"
                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <Link
                  href="/support"
                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5" />
                    <span>Help & Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-light text-black">12</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Wishlist Items</p>
                    <p className="text-2xl font-light text-black">8</p>
                  </div>
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Reward Points</p>
                    <p className="text-2xl font-light text-black">450</p>
                  </div>
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-medium text-black mb-6">
                Recent Orders
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-black">Order #12345</p>
                      <p className="text-sm text-gray-600">
                        Placed on Dec 15, 2024
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black">Rs. 2,450</p>
                    <p className="text-sm text-green-600">Delivered</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-black">Order #12344</p>
                      <p className="text-sm text-gray-600">
                        Placed on Dec 10, 2024
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black">Rs. 1,200</p>
                    <p className="text-sm text-blue-600">In Transit</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="#orders"
                  className="text-black hover:underline font-medium"
                >
                  View All Orders →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-black mb-6">
                Quick Actions
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/categories"
                  className="flex items-center space-x-3 p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <Package className="w-6 h-6 text-gray-400" />
                  <span className="font-medium text-black">
                    Browse Products
                  </span>
                </Link>

                <Link
                  href="/cart"
                  className="flex items-center space-x-3 p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                  <span className="font-medium text-black">View Cart</span>
                </Link>

                <a
                  href="#addresses"
                  className="flex items-center space-x-3 p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <MapPin className="w-6 h-6 text-gray-400" />
                  <span className="font-medium text-black">
                    Manage Addresses
                  </span>
                </a>

                <Link
                  href="/support"
                  className="flex items-center space-x-3 p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <HelpCircle className="w-6 h-6 text-gray-400" />
                  <span className="font-medium text-black">Get Help</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;
