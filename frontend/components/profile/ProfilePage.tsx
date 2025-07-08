import React from "react";
import { User, ArrowLeft } from "lucide-react";

const ProfilePage = ({ user, setCurrentView, handleLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView("store")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <UserProfileCard
              user={user}
              setCurrentView={setCurrentView}
              handleLogout={handleLogout}
            />
          </div>

          <div className="lg:col-span-2">
            <AccountInfo user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfileCard = ({ user, setCurrentView, handleLogout }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex flex-col items-center">
      <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mb-4">
        <User className="w-12 h-12 text-gray-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-gray-600 mt-1">{user.phone}</p>
      <p className="text-sm text-gray-500 mt-2">
        Member since {new Date(user.joinedDate).toLocaleDateString()}
      </p>
    </div>

    <div className="mt-6 space-y-2">
      <button
        onClick={() => setCurrentView("orders")}
        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        My Orders
      </button>
      <button
        onClick={() => setCurrentView("favorites")}
        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        Favorites
      </button>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
      >
        Logout
      </button>
    </div>
  </div>
);

const AccountInfo = ({ user }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-6">
      Account Information
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={user.name}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={user.phone}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Member Since
        </label>
        <input
          type="text"
          value={new Date(user.joinedDate).toLocaleDateString()}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
        />
      </div>
    </div>
  </div>
);

export default ProfilePage;
