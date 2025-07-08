import React from "react";
import { CreditCard, Truck } from "lucide-react";

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "card"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-700" />
              <span className="font-medium">Credit/Debit Card</span>
            </div>
          </div>

          <div
            className={`p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "cod"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("cod")}
          >
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-gray-700" />
              <span className="font-medium">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
