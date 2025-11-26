import ProductCard from "./ProductCard";
import { products } from "@/data/products";

interface ProductGridProps {
  filters?: string[];
}

const ProductGrid = ({ filters = [] }: ProductGridProps) => {
  const filteredProducts = filters.length === 0 
    ? products 
    : products.filter(product => filters.includes(product.category));

  return (
    <section className="py-16 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
