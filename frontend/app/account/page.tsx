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
  Package,
  Bell,
  Settings,
  Edit,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { checkAuthStatus, logout } from "@/utils/auth";

const AccountPage: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        setIsLoggedIn(authStatus.authenticated);
        setUser(authStatus.user || null);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUser(null);

      // Notify other components that auth status changed
      window.dispatchEvent(new CustomEvent("authUpdated"));

      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggedIn(false);
      setUser(null);

      // Still notify even if logout fails
      window.dispatchEvent(new CustomEvent("authUpdated"));

      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-gray-200 h-64"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-200 h-24"></div>
                  <div className="bg-gray-200 h-24"></div>
                  <div className="bg-gray-200 h-24"></div>
                </div>
                <div className="bg-gray-200 h-48"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Guest User View
  if (!isLoggedIn) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-8">
              <User className="w-12 h-12 text-gray-400" />
            </div>

            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              My Account
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Sign in to track orders, save favorites, and shop faster
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/login"
                className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="border border-gray-300 text-gray-700 px-8 py-3 font-medium hover:border-gray-400 hover:text-gray-900 transition-colors"
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
                <ShoppingBag className="w-8 h-8 text-gray-400 group-hover:text-gray-900 mb-4 mx-auto" />
                <h3 className="font-medium text-gray-900 mb-2">
                  Shopping Cart
                </h3>
                <p className="text-sm text-gray-600">
                  Items you're ready to buy
                </p>
              </Link>

              <Link
                href="/wishlist"
                className="p-6 border border-gray-200 hover:border-gray-300 transition-colors group"
              >
                <Heart className="w-8 h-8 text-gray-400 group-hover:text-gray-900 mb-4 mx-auto" />
                <h3 className="font-medium text-gray-900 mb-2">Wishlist</h3>
                <p className="text-sm text-gray-600">
                  Things you want to buy later
                </p>
              </Link>

              <Link
                href="/categories"
                className="p-6 border border-gray-200 hover:border-gray-300 transition-colors group"
              >
                <Package className="w-8 h-8 text-gray-400 group-hover:text-gray-900 mb-4 mx-auto" />
                <h3 className="font-medium text-gray-900 mb-2">
                  Browse Products
                </h3>
                <p className="text-sm text-gray-600">
                  Find what you're looking for
                </p>
              </Link>

              <Link
                href="/support"
                className="p-6 border border-gray-200 hover:border-gray-300 transition-colors group"
              >
                <HelpCircle className="w-8 h-8 text-gray-400 group-hover:text-gray-900 mb-4 mx-auto" />
                <h3 className="font-medium text-gray-900 mb-2">
                  Help & Support
                </h3>
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

  const navigationItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart, href: "/wishlist" },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  // Logged In User View
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6">
              {/* User Profile Header */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  if (item.href) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 p-3 text-left transition-colors ${
                        isActive
                          ? "bg-gray-50 text-gray-900 border-r-2 border-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "overview" && (
              <div className="space-y-8">
                {/* Account Overview */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Account Overview
                    </h3>
                    <button
                      onClick={() => setActiveSection("settings")}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edit Profile</span>
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <p className="text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Quick Actions
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveSection("orders")}
                      className="flex items-center space-x-3 p-4 border border-gray-200 hover:border-gray-300 transition-colors text-left"
                    >
                      <ShoppingBag className="w-6 h-6 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-900 block">
                          View Orders
                        </span>
                        <span className="text-sm text-gray-600">
                          Track your purchases
                        </span>
                      </div>
                    </button>

                    <Link
                      href="/cart"
                      className="flex items-center space-x-3 p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <Package className="w-6 h-6 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-900 block">
                          Shopping Cart
                        </span>
                        <span className="text-sm text-gray-600">
                          Complete your purchase
                        </span>
                      </div>
                    </Link>

                    <button
                      onClick={() => setActiveSection("addresses")}
                      className="flex items-center space-x-3 p-4 border border-gray-200 hover:border-gray-300 transition-colors text-left"
                    >
                      <MapPin className="w-6 h-6 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-900 block">
                          Manage Addresses
                        </span>
                        <span className="text-sm text-gray-600">
                          Update delivery locations
                        </span>
                      </div>
                    </button>

                    <Link
                      href="/support"
                      className="flex items-center space-x-3 p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <HelpCircle className="w-6 h-6 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-900 block">
                          Get Help
                        </span>
                        <span className="text-sm text-gray-600">
                          Contact support
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "orders" && (
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  My Orders
                </h3>
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No orders found</p>
                  <Link
                    href="/categories"
                    className="bg-gray-900 text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}

            {activeSection === "addresses" && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delivery Addresses
                  </h3>
                  <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Address</span>
                  </button>
                </div>
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No addresses saved</p>
                  <p className="text-sm text-gray-500">
                    Add a delivery address to get started
                  </p>
                </div>
              </div>
            )}

            {activeSection === "payment" && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Methods
                  </h3>
                  <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Payment Method</span>
                  </button>
                </div>
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No payment methods saved</p>
                  <p className="text-sm text-gray-500">
                    Add a payment method for faster checkout
                  </p>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Order Updates</p>
                      <p className="text-sm text-gray-600">
                        Get notified about order status changes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-gray-900 border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Promotions</p>
                      <p className="text-sm text-gray-600">
                        Receive offers and promotional emails
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-gray-900 border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">New Products</p>
                      <p className="text-sm text-gray-600">
                        Be the first to know about new arrivals
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-gray-900 border-gray-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Account Settings
                </h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.first_name}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.last_name}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-gray-900 text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;
