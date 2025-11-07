import React, { useState } from "react";
import { User } from "lucide-react";

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
    <div className="relative group">
      <button
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="w-6 h-6" />
        <span className="hidden md:block">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {
              setCurrentView("profile");
              setIsOpen(false);
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Profile
          </button>
          <button
            onClick={() => {
              setCurrentView("orders");
              setIsOpen(false);
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            My Orders
          </button>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
