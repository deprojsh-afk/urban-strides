import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const ProductGrid = () => {

  return (
    <section className="py-16 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Performance Collection
          </h2>
          <p className="text-muted-foreground">
            Engineered for urban athletes who demand style and function
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
