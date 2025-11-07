import React from "react";
import { ShoppingCart } from "lucide-react";
import OrderItem from "./OrderItem";

interface Order {
  id: number;
  items: any[];
  total: number;
  deliveryAddress: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  paymentMethod: string;
  status: string;
  orderDate: string;
  estimatedDelivery: string;
}

interface OrdersPageProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  orders: Order[];
}

const OrdersPage: React.FC<OrdersPageProps> = ({
  currentView,
  setCurrentView,
  orders,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <button
            onClick={() => setCurrentView("store")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Shop Now
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              You haven&apos;t placed any orders yet
            </p>
            <button
              onClick={() => setCurrentView("store")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
