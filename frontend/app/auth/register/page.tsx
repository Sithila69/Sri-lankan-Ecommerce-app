"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";

import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { registerCustomer, RegisterCustomerData } from "@/utils/api";

const RegisterPage: React.FC = () => {
  const [registrationMethod, setRegistrationMethod] = useState<
    "email" | "phone"
  >("email");
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp" | "details">(
    "phone"
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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
      setPhoneStep("otp");
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (registrationMethod === "email") {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password =
          "Password must contain uppercase, lowercase, and number";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "You must accept the terms and conditions";
      }
    } else {
      // Phone registration validation based on step
      if (phoneStep === "phone") {
        if (!formData.phone) {
          newErrors.phone = "Phone number is required";
        } else if (!validateSriLankanPhone(formData.phone)) {
          newErrors.phone =
            "Please enter a valid Sri Lankan mobile number (e.g., 0771234567 or +94771234567)";
        }
      } else if (phoneStep === "otp") {
        if (!formData.otp) {
          newErrors.otp = "OTP is required";
        } else if (formData.otp.length !== 6) {
          newErrors.otp = "Please enter a valid 6-digit OTP";
        }
      } else if (phoneStep === "details") {
        if (!formData.firstName.trim()) {
          newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
          newErrors.lastName = "Last name is required";
        }

        if (!formData.acceptTerms) {
          newErrors.acceptTerms = "You must accept the terms and conditions";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registrationMethod === "phone") {
      if (phoneStep === "phone") {
        await handleSendOtp();
        return;
      } else if (phoneStep === "otp") {
        if (!validateForm()) return;
        // OTP verified, move to details step
        setPhoneStep("details");
        setErrors({});
        return;
      }
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare data for API call
      const registrationData: RegisterCustomerData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email:
          registrationMethod === "email"
            ? formData.email
            : `${formData.phone}@temp.com`, // Temporary email for phone registration
        password:
          registrationMethod === "email"
            ? formData.password
            : "TempPassword123!", // Temporary password for phone registration
        phone: registrationMethod === "phone" ? formData.phone : undefined,
        preferred_language: "en",
        marketing_consent: false,
      };

      const response = await registerCustomer(registrationData);

      // Handle successful registration
      const message =
        registrationMethod === "email"
          ? "Registration successful! Please check your email to verify your account."
          : "Registration successful! Your account has been created.";
      alert(message);

      // Optionally redirect to login page
      // window.location.href = '/auth/login';
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors({
        general: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <Header />
      <div className="h-max bg-white mt-12 mb-12 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex border lg:border-gray-800 ">
            {/* Left Side - Benefits */}
            <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-12 flex-col justify-center">
              <div className="max-w-md">
                <h2 className="text-4xl font-light mb-8">Join Our Community</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-gray-900">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        Exclusive Member Benefits
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Get early access to new products, special discounts, and
                        member-only deals
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-gray-900">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 ">
                        Personalized Experience
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Curated recommendations based on your preferences and
                        location
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-gray-900">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        Order Tracking & History
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Keep track of all your orders and easily reorder your
                        favorites
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-light mb-1">50K+</div>
                    <div className="text-xs text-gray-300">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light mb-1">2K+</div>
                    <div className="text-xs text-gray-300">
                      Local Businesses
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-light mb-1">15K+</div>
                    <div className="text-xs text-gray-300">
                      Products & Services
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-light text-black mb-2">
                    Create account
                  </h1>
                  <p className="text-gray-600">
                    Join Kadey.lk to start shopping with local businesses
                  </p>
                </div>

                {/* Registration Method Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setRegistrationMethod("email")}
                    className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                      registrationMethod === "email"
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegistrationMethod("phone")}
                    className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                      registrationMethod === "phone"
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
                    {/* Name Fields - Only for Email or Phone Details Step */}
                    {(registrationMethod === "email" ||
                      phoneStep === "details") && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-900 mb-2"
                          >
                            First Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              autoComplete="given-name"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border ${
                                errors.firstName
                                  ? "border-red-300"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-black transition-colors text-gray-900`}
                              placeholder="First name"
                            />
                          </div>
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-900 mb-2"
                          >
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border ${
                              errors.lastName
                                ? "border-red-300"
                                : "border-gray-300"
                            } focus:outline-none focus:border-black transition-colors text-gray-900`}
                            placeholder="Last name"
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Email/Phone Field */}
                    {registrationMethod === "email" ? (
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
                    ) : phoneStep === "phone" ? (
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
                              errors.phone
                                ? "border-red-300"
                                : "border-gray-300"
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
                    ) : phoneStep === "otp" ? (
                      <div>
                        <div className="text-center mb-4">
                          <p className="text-gray-600">
                            We've sent a verification code to
                          </p>
                          <p className="font-medium text-black">
                            {formData.phone}
                          </p>
                        </div>
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
                          <button
                            type="button"
                            onClick={() => setPhoneStep("phone")}
                            className="text-gray-600 hover:text-black"
                          >
                            ← Change number
                          </button>
                          {otpTimer > 0 ? (
                            <p className="text-gray-500">
                              Resend in {otpTimer}s
                            </p>
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

                    {/* Password Fields - Only for Email Registration */}
                    {registrationMethod === "email" && (
                      <>
                        {/* Password Field */}
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
                              autoComplete="new-password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-12 py-3 border ${
                                errors.password
                                  ? "border-red-300"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-black transition-colors text-gray-900`}
                              placeholder="Create a password"
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

                        {/* Confirm Password Field */}
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-900 mb-2"
                          >
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="new-password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-12 py-3 border ${
                                errors.confirmPassword
                                  ? "border-red-300"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-black transition-colors text-gray-900`}
                              placeholder="Confirm your password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Terms and Conditions - Only for Email or Phone Details Step */}
                  {(registrationMethod === "email" ||
                    phoneStep === "details") && (
                    <div>
                      <div className="flex items-start">
                        <input
                          id="acceptTerms"
                          name="acceptTerms"
                          type="checkbox"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-black focus:ring-black border-gray-300 mt-1"
                        />
                        <label
                          htmlFor="acceptTerms"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="text-black hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="text-black hover:underline"
                          >
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      {errors.acceptTerms && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.acceptTerms}
                        </p>
                      )}
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
                        ? registrationMethod === "phone" && !otpSent
                          ? "Sending OTP..."
                          : registrationMethod === "phone" &&
                            phoneStep === "otp"
                          ? "Verifying..."
                          : "Creating account..."
                        : registrationMethod === "phone" &&
                          phoneStep === "phone"
                        ? "Send OTP"
                        : registrationMethod === "phone" && phoneStep === "otp"
                        ? "Verify OTP"
                        : "Create account"}
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="login"
                        className="font-medium text-black hover:underline"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>

                {/* Mobile Benefits */}
                <div className="lg:hidden mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Join thousands of happy customers
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="text-lg font-medium text-black">50K+</div>
                      <div className="text-xs text-gray-500">Customers</div>
                    </div>
                    <div>
                      <div className="text-lg font-medium text-black">2K+</div>
                      <div className="text-xs text-gray-500">Businesses</div>
                    </div>
                    <div>
                      <div className="text-lg font-medium text-black">15K+</div>
                      <div className="text-xs text-gray-500">Products</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span>Exclusive member discounts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span>Personalized recommendations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span>Order tracking & history</span>
                    </div>
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

export default RegisterPage;
