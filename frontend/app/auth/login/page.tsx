"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Phone } from "lucide-react";

import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
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

    if (loginMethod === "email") {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!validateSriLankanPhone(formData.phone)) {
        newErrors.phone =
          "Please enter a valid Sri Lankan mobile number (e.g., 0771234567 or +94771234567)";
      }

      if (otpSent && !formData.otp) {
        newErrors.otp = "OTP is required";
      } else if (otpSent && formData.otp.length !== 6) {
        newErrors.otp = "Please enter a valid 6-digit OTP";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSriLankanPhone = (phone: string) => {
    // Remove all spaces, dashes, and parentheses
    const cleanPhone = phone.replace(/[\s\-()]/g, "");

    // Sri Lankan mobile number patterns
    const patterns = [
      /^07[0-9]{8}$/, // Local format: 0771234567
      /^\+9407[0-9]{8}$/, // International format: +94771234567
      /^9407[0-9]{8}$/, // International without +: 94771234567
    ];

    return patterns.some((pattern) => pattern.test(cleanPhone));
  };

  const handleSendOtp = async () => {
    if (!formData.phone) {
      setErrors({ phone: "Phone number is required" });
      return;
    }

    if (!validateSriLankanPhone(formData.phone)) {
      setErrors({
        phone:
          "Please enter a valid Sri Lankan mobile number (e.g., 0771234567 or +94771234567)",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log("Sending OTP to:", formData.phone);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOtpSent(true);
      setOtpTimer(60); // 60 seconds timer
      setErrors({});

      // Start countdown timer
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("OTP send error:", error);
      setErrors({ general: "Failed to send OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMethod === "phone" && !otpSent) {
      await handleSendOtp();
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Login attempt:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful login
      alert("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Login failed. Please try again." });
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
              <h2 className="text-4xl font-light mb-8">Welcome to Kadey.lk</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 text-gray-900 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Shop Local Businesses</h3>
                    <p className="text-gray-300 text-sm">
                      Discover authentic products and services from Sri Lankan
                      entrepreneurs
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 text-gray-900 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Fast & Secure</h3>
                    <p className="text-gray-300 text-sm">
                      Same-day delivery in Colombo with secure payment
                      processing
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 text-gray-900 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Support Community</h3>
                    <p className="text-gray-300 text-sm">
                      Every purchase helps grow the local economy and small
                      businesses
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
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-light text-black mb-2">
                  Welcome back
                </h1>
                <p className="text-gray-600">
                  Sign in to your account to continue shopping
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continue with Facebook
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                  Continue with Apple
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Login Method Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    loginMethod === "email"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("phone")}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    loginMethod === "phone"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </button>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Email/Phone Field */}
                  {loginMethod === "email" ? (
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
                            errors.email ? "border-red-300" : "border-gray-300"
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
                  ) : (
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.phone ? "border-red-300" : "border-gray-300"
                          } focus:outline-none focus:border-black transition-colors text-gray-900`}
                          placeholder="0771234567 or +94771234567"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Password/OTP Field */}
                  {loginMethod === "email" ? (
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 border ${
                            errors.password
                              ? "border-red-300"
                              : "border-gray-300"
                          } focus:outline-none focus:border-black transition-colors text-gray-900`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  ) : otpSent ? (
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Enter OTP
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="otp"
                          name="otp"
                          type="text"
                          maxLength={6}
                          value={formData.otp}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.otp ? "border-red-300" : "border-gray-300"
                          } focus:outline-none focus:border-black transition-colors text-gray-900 text-center text-lg tracking-widest`}
                          placeholder="000000"
                        />
                      </div>
                      {errors.otp && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.otp}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <p className="text-gray-600">
                          OTP sent to {formData.phone}
                        </p>
                        {otpTimer > 0 ? (
                          <p className="text-gray-500">Resend in {otpTimer}s</p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-black hover:underline font-medium"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Remember Me & Forgot Password - Only for Email Login */}
                {loginMethod === "email" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        href="forgot-password"
                        className="text-gray-600 hover:text-black"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-3 px-4 font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading
                      ? loginMethod === "phone" && !otpSent
                        ? "Sending OTP..."
                        : "Signing in..."
                      : loginMethod === "phone" && !otpSent
                      ? "Send OTP"
                      : "Sign in"}
                  </button>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      href="register"
                      className="font-medium text-black hover:underline"
                    >
                      Create one here
                    </Link>
                  </p>
                </div>
              </form>

              {/* Mobile Benefits */}
              <div className="lg:hidden mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">
                  Why choose Kadey.lk?
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Shop from verified local businesses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Fast delivery across Sri Lanka</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Secure payments & quality guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
