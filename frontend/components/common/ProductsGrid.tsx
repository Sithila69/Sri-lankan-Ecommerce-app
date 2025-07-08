import ProductCard from "./ProductCard";

interface Product {
  id: number;
  title: string;
  seller: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: number;
  priceUnit?: string;
  image: string;
  hasOffer?: boolean;
  offerText?: string;
  isFavorited?: boolean;
}

const ProductsGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
export default ProductsGrid;
