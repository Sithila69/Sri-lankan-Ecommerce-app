"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Plus, Minus, CheckCircle } from "lucide-react";
import ProductDetails from "@/components/product/ProductDetails";
import SellerInfo from "@/components/product/SellerInfo";
import { useParams } from "next/navigation";
import Header from "@/components/common/Header";

interface Product {
  id: number;
  name: string;
  category: string;
  type: string;
  price: number;
  currency: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  seller: string;
  description: string;
  sellerRating: number;
  sellerReviews: number;
  availability: string;
  deliveryTime?: string;
  serviceTime?: string;
  features: string[];
  stock: number;
  pricing?: string;
}

interface ProductPageProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProduct: Product;
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  addToCart: (product: Product, quantity: number, serviceOptions: any) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({
  currentView,
  setCurrentView,
  selectedProduct,
  favorites,
  toggleFavorite,
  addToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [product, setProduct] = useState<Product | null>(null);
  const params = useParams();
  const id = params?.id;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  console.log(product);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedOptions);
    setCurrentView("cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button className="flex items-center gap-2 text-gray-600 hover:text-black">
          <ArrowLeft className="w-5 h-5" />
          Back to Store
        </button>
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{product?.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={product?.image}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <ProductDetails
              product={product}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              setCurrentView={setCurrentView}
            />

            <SellerInfo seller={product?.seller} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
