import React from "react";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
interface CartPageProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  cart: any[];
  updateCartQuantity: (productId: number, quantity: number) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartPage: React.FC<CartPageProps> = ({
  currentView,
  setCurrentView,
  cart,
  updateCartQuantity,
  getCartTotal,
  getCartItemsCount,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView("store")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => setCurrentView("store")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({getCartItemsCount()})
                  </h2>
                </div>

                <div className="divide-y">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      updateCartQuantity={updateCartQuantity}
                    />
                  ))}
                </div>
              </div>
            </div>

            <OrderSummary
              cart={cart}
              getCartTotal={getCartTotal}
              setCurrentView={setCurrentView}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
