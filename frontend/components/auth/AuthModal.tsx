import React, { useState } from "react";
import { X } from "lucide-react";
import AuthForm from "./AuthForm";

interface AuthModalProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  handleLogin: (email: string, password: string) => void;
  handleRegister: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  handleLogin,
  handleRegister,
}) => {
  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {authMode === "login" ? "Login" : "Sign Up"}
          </h2>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <AuthForm
          authMode={authMode}
          setAuthMode={setAuthMode}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
        />
      </div>
    </div>
  );
};

export default AuthModal;
