import React from "react";
import { ArrowLeft } from "lucide-react";
import DeliveryInfoForm from "./DeliveryInfoForm";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "../cart/OrderSummary";

interface CheckoutPageProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  cart: any[];
  getCartTotal: () => number;
  deliveryAddress: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  setDeliveryAddress: (address: any) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  processOrder: (orderData: any) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  currentView,
  setCurrentView,
  cart,
  getCartTotal,
  deliveryAddress,
  setDeliveryAddress,
  paymentMethod,
  setPaymentMethod,
  processOrder,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView("cart")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DeliveryInfoForm
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
            />

            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          <OrderSummary
            cart={cart}
            getCartTotal={getCartTotal}
            setCurrentView={setCurrentView}
            processOrder={processOrder}
            deliveryAddress={deliveryAddress}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
