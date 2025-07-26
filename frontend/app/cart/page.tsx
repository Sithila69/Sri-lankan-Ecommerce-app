"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
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
          <Breadcrumb />
          {/* <button
            onClick={onContinueShopping}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors group mb-4"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Continue Shopping</span>
          </button> */}
          <div className="flex items-center space-x-3 mb-6">
            <ShoppingBag className="w-7 h-7 text-black" />
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">Add some items to get started</p>
            <Link href={"/"}>
              <button
                onClick={onContinueShopping}
                className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Cart Items ({totalItems})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="relative">
                          <img
                            src={item?.image_url || "/placeholder-image.jpg"}
                            alt={item?.name || "Product image"}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {item?.name || "Untitled Product"}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            Sold by {item?.seller || "Unknown Seller"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-gray-900">
                              LKR {(item?.price || 0).toLocaleString()}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center border border-gray-200 rounded-lg">
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
                                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-l-lg"
                                >
                                  <Minus className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="w-12 text-center font-semibold text-gray-900 border-x border-gray-200">
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
                                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-r-lg"
                                >
                                  <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemove(item.product_id)}
                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">
                      LKR {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>LKR {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-lg"
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
