"use client";
import React, { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";

import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Password reset attempt:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResetLinkSent(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({ general: "Failed to reset password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <Header />
      <div className="min-h-[calc(100vh-112px)] bg-white mt-12 mb-12">
        <div className="max-w-7xl mx-auto flex lg:border lg:border-gray-800">
          {/* Left Side - Benefits */}
          <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-12 flex-col justify-center">
            <div className="max-w-md">
              <h2 className="text-4xl font-light mb-8">Reset Your Password</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 text-gray-900 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Secure Process</h3>
                    <p className="text-gray-300 text-sm">
                      We use secure methods to verify your identity and protect
                      your account
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 text-gray-900 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Quick Recovery</h3>
                    <p className="text-gray-300 text-sm">
                      Get back to shopping from local businesses in just a few
                      minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 min-h-[600px]">
              {/* Header */}
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-light text-black mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  No worries, we'll send you reset instructions
                </p>
              </div>

              {/* Success Message for Email Reset */}
              {resetLinkSent ? (
                <div className="text-center space-y-6">
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Reset link sent!</p>
                    <p className="text-sm mt-1">
                      Check your email for password reset instructions.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Didn't receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => setResetLinkSent(false)}
                        className="text-black hover:underline font-medium"
                      >
                        try again
                      </button>
                    </p>
                    <Link
                      href="login"
                      className="inline-block w-full bg-black text-white py-3 px-4 text-center font-medium hover:bg-gray-800 transition-colors"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Form */}
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {errors.general && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {errors.general}
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-900 mb-2"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border ${
                              errors.email
                                ? "border-red-300"
                                : "border-gray-300"
                            } focus:outline-none focus:border-black transition-colors text-gray-900`}
                            placeholder="Enter your email"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-3 px-4 font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading
                          ? "Sending Reset Link..."
                          : "Send Reset Link"}
                      </button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Remember your password?{" "}
                        <Link
                          href="login"
                          className="font-medium text-black hover:underline"
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
