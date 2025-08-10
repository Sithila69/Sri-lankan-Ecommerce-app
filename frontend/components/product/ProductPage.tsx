// "use client";
// import React, { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import ProductDetails from "./ProductDetails";
// import SellerInfo from "./SellerInfo";

// import { Product } from "@/types";

// interface ProductPageProps {
//   currentView: string;
//   setCurrentView: (view: string) => void;
//   selectedProduct: Product;
//   favorites: number[];
//   toggleFavorite: (productId: number) => void;
//   addToCart: (product: Product, quantity: number, serviceOptions: any) => void;
// }

// const ProductPage: React.FC<ProductPageProps> = ({
//   currentView,
//   setCurrentView,
//   selectedProduct,
//   favorites,
//   toggleFavorite,
//   addToCart,
// }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [selectedOptions, setSelectedOptions] = useState({});

//   const handleOptionChange = (optionName: string, value: string) => {
//     setSelectedOptions((prev) => ({
//       ...prev,
//       [optionName]: value,
//     }));
//   };

//   const handleAddToCart = () => {
//     addToCart(selectedProduct, quantity, selectedOptions);
//     setCurrentView("cart");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex items-center gap-4 mb-8">
//           <button
//             onClick={() => setCurrentView("store")}
//             className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Back to Store
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900">
//             {selectedProduct.name}
//           </h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <img
//               src={selectedProduct.img_url}
//               alt={selectedProduct.name}
//               className="w-full h-96 object-cover"
//             />
//           </div>

//           <div>
//             <ProductDetails
//               selectedProduct={selectedProduct}
//               favorites={favorites}
//               toggleFavorite={toggleFavorite}
//               quantity={quantity}
//               setQuantity={setQuantity}
//               handleAddToCart={handleAddToCart}
//               setCurrentView={setCurrentView}
//             />

//             <SellerInfo selectedProduct={selectedProduct} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;
