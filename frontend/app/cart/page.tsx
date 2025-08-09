"use client";
import React, { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Calendar,
  CalendarCheck,
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  CartItem,
} from "@/utils/cart";
import Link from "next/link";

interface ShoppingCartPageProps {
  onContinueShopping: () => void;
}

const ShoppingCartPage: React.FC<ShoppingCartPageProps> = ({
  onContinueShopping,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart items
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const items = getCart();
        setCartItems(items);
      } catch (error) {
        console.error("Failed to load cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  const handleUpdateQuantity = (
    productId: string,
    newQuantity: number,
    stockAvailable: number
  ) => {
    if (newQuantity < 1) return;

    const success = updateQuantity(productId, newQuantity, stockAvailable);
    if (success) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      alert("Not enough stock available");
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    setCartItems((prev) =>
      prev.filter((item) => item.product_id !== productId)
    );
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
  };

  // Calculate order summary
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
    0
  );
  const deliveryFee: number = 0; // Free delivery
  const total = subtotal + deliveryFee;
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item?.quantity || 0),
    0
  );

  // Separate products and services for display
  const products = cartItems.filter((item) => item.type !== "service");
  const services = cartItems.filter((item) => item.type === "service");

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      console.log("Proceed to checkout clicked");
      alert("Proceeding to checkout...");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="hidden sm:block mb-6">
            <Breadcrumb />
          </div>
          <div className="flex items-center space-x-3 mb-8">
            <ShoppingBag className="w-8 h-8 text-black" />
            <h1 className="text-4xl font-light text-black">Shopping Cart</h1>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-light text-black mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start shopping to add items to your cart
            </p>
            <Link href={"/"}>
              <button
                onClick={onContinueShopping}
                className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-black">
                    Cart Items ({totalItems})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Products Section */}
                  {products.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-black mb-4 flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Products ({products.length})
                      </h3>
                      <div className="space-y-4">
                        {products.map((item) => (
                          <div
                            key={item.product_id}
                            className="bg-white border border-gray-200 p-6 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-start space-x-4">
                              {/* Product Image */}
                              <div className="flex-shrink-0">
                                <img
                                  src={
                                    item?.image_url || "/placeholder-image.jpg"
                                  }
                                  alt={item?.name || "Product image"}
                                  className="w-20 h-20 object-cover"
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-black text-lg mb-1">
                                  {item?.name || "Untitled Product"}
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                  Sold by {item?.seller || "Unknown Seller"}
                                </p>

                                <div className="flex items-center justify-between">
                                  <div className="text-xl font-medium text-black">
                                    Rs. {(item?.price || 0).toLocaleString()}
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center border border-gray-300">
                                      <button
                                        onClick={() => {
                                          if (item.quantity > 1) {
                                            handleUpdateQuantity(
                                              item.product_id,
                                              item.quantity - 1,
                                              item.stock
                                            );
                                          }
                                        }}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                      >
                                        <Minus className="w-4 h-4 text-gray-600" />
                                      </button>
                                      <span className="w-12 text-center font-medium text-black border-x border-gray-300">
                                        {item?.quantity || 0}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            item.product_id,
                                            item.quantity + 1,
                                            item.stock
                                          )
                                        }
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                      >
                                        <Plus className="w-4 h-4 text-gray-600" />
                                      </button>
                                    </div>

                                    <button
                                      onClick={() =>
                                        handleRemove(item.product_id)
                                      }
                                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Services Section */}
                  {services.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-black mb-4 flex items-center">
                        <CalendarCheck className="w-5 h-5 mr-2" />
                        Service Bookings ({services.length})
                      </h3>
                      <div className="space-y-4">
                        {services.map((item) => (
                          <div
                            key={item.product_id}
                            className="bg-blue-50 border border-blue-200 p-6 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start space-x-4">
                              {/* Service Image */}
                              <div className="relative flex-shrink-0">
                                <img
                                  src={
                                    item?.image_url || "/placeholder-image.jpg"
                                  }
                                  alt={item?.name || "Service image"}
                                  className="w-20 h-20 object-cover"
                                />
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
                                  <Calendar className="w-3 h-3" />
                                </div>
                              </div>

                              {/* Service Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-black text-lg mb-1">
                                  {item?.name || "Untitled Service"}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  Service by{" "}
                                  {item?.seller || "Unknown Provider"}
                                </p>

                                {/* Service Type Badge */}
                                {item.service_type && (
                                  <div className="mb-4">
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                                      {item.service_type === "on_site"
                                        ? "On-site Service"
                                        : item.service_type === "remote"
                                        ? "Remote Service"
                                        : "Hybrid Service"}
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="text-xl font-medium text-black">
                                    Rs. {(item?.price || 0).toLocaleString()}
                                  </div>

                                  {/* Service Actions */}
                                  <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600 bg-white px-3 py-1">
                                      Booking Request
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleRemove(item.product_id)
                                      }
                                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 lg:sticky lg:top-6">
                <h2 className="text-xl font-medium text-black mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-medium">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-medium text-black">
                      <span>Total</span>
                      <span>Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-black text-white py-4 px-6 font-medium hover:bg-gray-800 transition-colors text-lg"
                  disabled={totalItems === 0}
                >
                  {totalItems > 0 ? "Proceed to Checkout" : "Cart is Empty"}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Free shipping on all orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ShoppingCartPage;
