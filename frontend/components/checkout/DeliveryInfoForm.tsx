import React from "react";

interface DeliveryInfoFormProps {
  deliveryAddress: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  setDeliveryAddress: (address: any) => void;
}

const DeliveryInfoForm: React.FC<DeliveryInfoFormProps> = ({
  deliveryAddress,
  setDeliveryAddress,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Delivery Information
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={deliveryAddress.street}
              onChange={(e) =>
                setDeliveryAddress({
                  ...deliveryAddress,
                  street: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={deliveryAddress.city}
              onChange={(e) =>
                setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Colombo"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <input
              type="text"
              value={deliveryAddress.district}
              onChange={(e) =>
                setDeliveryAddress({
                  ...deliveryAddress,
                  district: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Colombo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              value={deliveryAddress.postalCode}
              onChange={(e) =>
                setDeliveryAddress({
                  ...deliveryAddress,
                  postalCode: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfoForm;
