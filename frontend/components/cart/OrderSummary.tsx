import React from "react";

interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const OrderSummary: React.FC<{
  summary: OrderSummary;
  itemCount: number;
  onProceedToCheckout: () => void;
}> = ({ summary, itemCount, onProceedToCheckout }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">
            LKR {summary.subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="text-gray-900">
            {summary.deliveryFee === 0
              ? "Free"
              : `LKR ${summary.deliveryFee.toLocaleString()}`}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">
              LKR {summary.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onProceedToCheckout}
        className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
