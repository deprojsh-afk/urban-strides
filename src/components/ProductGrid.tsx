import ProductCard from "./ProductCard";
import shoesImage from "@/assets/product-shoes-1.jpg";
import leggingsImage from "@/assets/product-leggings-1.jpg";
import topImage from "@/assets/product-top-1.jpg";
import jacketImage from "@/assets/product-jacket-1.jpg";

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      image: shoesImage,
      name: "Velocity Runner",
      category: "Shoes",
      price: 189,
      features: ["Lightweight", "Breathable", "Responsive"],
    },
    {
      id: 2,
      image: leggingsImage,
      name: "Precision Tights",
      category: "Bottoms",
      price: 98,
      features: ["Compression", "Moisture-Wicking", "Reflective"],
    },
    {
      id: 3,
      image: topImage,
      name: "Swift Performance Tee",
      category: "Tops",
      price: 68,
      features: ["Breathable", "Quick-Dry", "Seamless"],
    },
    {
      id: 4,
      image: jacketImage,
      name: "Urban Shield Jacket",
      category: "Outerwear",
      price: 248,
      features: ["Water-Resistant", "Packable", "Reflective"],
    },
    {
      id: 5,
      image: shoesImage,
      name: "Sprint Elite",
      category: "Shoes",
      price: 219,
      features: ["Carbon Plate", "Lightweight", "Responsive"],
    },
    {
      id: 6,
      image: topImage,
      name: "Motion Long Sleeve",
      category: "Tops",
      price: 78,
      features: ["Thermal", "Breathable", "Anti-Odor"],
    },
    {
      id: 7,
      image: leggingsImage,
      name: "Endurance Shorts",
      category: "Bottoms",
      price: 72,
      features: ["Lightweight", "4-Way Stretch", "Pocket"],
    },
    {
      id: 8,
      image: jacketImage,
      name: "Storm Runner Vest",
      category: "Outerwear",
      price: 158,
      features: ["Windproof", "Lightweight", "Packable"],
    },
  ];

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
