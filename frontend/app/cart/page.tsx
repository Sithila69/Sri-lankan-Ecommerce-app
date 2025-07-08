"use client";
import React from "react";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

interface CartItem {
  id: number;
  title: string;
  seller: string;
  price: number;
  priceUnit?: string;
  image: string;
  quantity: number;
}

interface ShoppingCartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
  onContinueShopping: () => void;
}

const ShoppingCartPage: React.FC<ShoppingCartPageProps> = ({
  cartItems = [],
  onUpdateQuantity,
  onRemove,
  onContinueShopping,
}) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-600 hover:text-black">
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart Items ({totalItems})
                </h2>
              </div>

              {cartItems.length > 0 ? (
                <div className="p-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-4 border-b border-gray-200"
                    >
                      {/* Product Info */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={item?.image || "/placeholder-image.jpg"}
                          alt={item?.title || "Product image"}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {item?.title || "Untitled Product"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item?.seller || "Unknown Seller"}
                          </p>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            LKR {(item?.price || 0).toLocaleString()}
                            {item?.priceUnit && (
                              <span className="text-gray-500 font-normal">
                                {" "}
                                {item.priceUnit}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                onUpdateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item?.quantity || 0}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    onClick={onContinueShopping}
                    className="mt-4 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="text-gray-900">
                    LKR {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">
                    {deliveryFee === 0
                      ? "Free"
                      : `LKR ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      LKR {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                disabled={totalItems === 0}
              >
                {totalItems > 0 ? "Proceed to Checkout" : "Cart is Empty"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCartPage;
