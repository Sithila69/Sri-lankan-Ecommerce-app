"use client";
import {
  User,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { logout } from "@/utils/auth";

interface UserDropdownProps {
  user: { name: string };
  setCurrentView: (view: string) => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  setCurrentView,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-50 text-gray-600 hover:text-black transition-colors rounded-md"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {userData?.avatar ? (
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-gray-600">
              {userData?.name ? (
                getInitials(userData.name)
              ) : (
                <User className="w-4 h-4" />
              )}
            </span>
          )}
        </div>

        {/* Name */}
        <div className="hidden lg:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {userData?.name || "User"}
          </div>
        </div>

        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {userData?.name ? (
                      getInitials(userData.name)
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {userData?.name || "User"}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/account"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="w-4 h-4 mr-3" />
              My Account
            </Link>
            <Link
              href="/account/orders"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Package className="w-4 h-4 mr-3" />
              My Orders
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Heart className="w-4 h-4 mr-3" />
              Wishlist
            </Link>
            <Link
              href="/account/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
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
  );
};

export default UserDropdown;
