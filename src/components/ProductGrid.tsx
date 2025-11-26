import ProductCard from "./ProductCard";
import shoesImage from "@/assets/product-shoes-1.jpg";
import leggingsImage from "@/assets/product-leggings-1.jpg";
import topImage from "@/assets/product-top-1.jpg";
import jacketImage from "@/assets/product-jacket-1.jpg";

const ProductGrid = () => {
  const products = [
    {
      id: "velocity-runner",
      image: shoesImage,
      name: "Velocity Runner",
      category: "Shoes",
      price: 189,
      features: ["Lightweight", "Breathable", "Responsive"],
    },
    {
      id: "precision-tights",
      image: leggingsImage,
      name: "Precision Tights",
      category: "Bottoms",
      price: 98,
      features: ["Compression", "Moisture-Wicking", "Reflective"],
    },
    {
      id: "swift-performance-tee",
      image: topImage,
      name: "Swift Performance Tee",
      category: "Tops",
      price: 68,
      features: ["Breathable", "Quick-Dry", "Seamless"],
    },
    {
      id: "urban-shield-jacket",
      image: jacketImage,
      name: "Urban Shield Jacket",
      category: "Outerwear",
      price: 248,
      features: ["Water-Resistant", "Packable", "Reflective"],
    },
    {
      id: "sprint-elite",
      image: shoesImage,
      name: "Sprint Elite",
      category: "Shoes",
      price: 219,
      features: ["Carbon Plate", "Lightweight", "Responsive"],
    },
    {
      id: "motion-long-sleeve",
      image: topImage,
      name: "Motion Long Sleeve",
      category: "Tops",
      price: 78,
      features: ["Thermal", "Breathable", "Anti-Odor"],
    },
    {
      id: "endurance-shorts",
      image: leggingsImage,
      name: "Endurance Shorts",
      category: "Bottoms",
      price: 72,
      features: ["Lightweight", "4-Way Stretch", "Pocket"],
    },
    {
      id: "storm-runner-vest",
      image: jacketImage,
      name: "Storm Runner Vest",
      category: "Outerwear",
      price: 158,
      features: ["Windproof", "Lightweight", "Packable"],
    },
  ];

  return (
    <section className="py-16 px-4 lg:px-8 bg-gradient-to-b from-black/20 to-background relative overflow-hidden">
      {/* Background subtle gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-pink-500/5 pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 text-white drop-shadow-lg">
            Performance Collection
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base">
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
