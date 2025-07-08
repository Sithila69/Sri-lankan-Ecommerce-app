import React from "react";

interface OrderItemProps {
  order: {
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
  };
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-gray-900">Order #{order.id}</h2>
          <p className="text-sm text-gray-600">
            {new Date(order.orderDate).toLocaleDateString()} •
            <span className="capitalize"> {order.status}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">LKR {order.total.toLocaleString()}</p>
          <p className="text-sm text-gray-600">
            {order.paymentMethod === "card"
              ? "Credit Card"
              : "Cash on Delivery"}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Delivery Address
          </h3>
          <p className="text-sm text-gray-600">
            {order.deliveryAddress.street}, {order.deliveryAddress.city}
            <br />
            {order.deliveryAddress.district}, {order.deliveryAddress.postalCode}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-600">{item.seller}</p>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">
                  LKR {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
