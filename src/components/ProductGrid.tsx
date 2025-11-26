import ProductCard from "./ProductCard";
import watchImage from "@/assets/product-watch.png";
import shoesImage from "@/assets/product-shoes-2.png";
import socksImage from "@/assets/product-socks.png";
import backpackImage from "@/assets/product-backpack.png";
import vestImage from "@/assets/product-vest.png";
import visorImage from "@/assets/product-visor.png";
import bottleImage from "@/assets/product-bottle.png";
import capImage from "@/assets/product-cap.png";

const ProductGrid = () => {
  const products = [
    {
      id: "smart-runner-watch",
      image: watchImage,
      name: "Smart Runner Watch",
      category: "Accessories",
      price: 249,
      features: ["GPS Tracking", "Heart Rate", "Waterproof"],
    },
    {
      id: "velocity-runner",
      image: shoesImage,
      name: "Velocity Runner",
      category: "Shoes",
      price: 189,
      features: ["Lightweight", "Breathable", "Responsive"],
    },
    {
      id: "performance-socks",
      image: socksImage,
      name: "Performance Socks",
      category: "Accessories",
      price: 28,
      features: ["Moisture-Wicking", "Cushioned", "Anti-Blister"],
    },
    {
      id: "urban-runner-pack",
      image: backpackImage,
      name: "Urban Runner Pack",
      category: "Accessories",
      price: 168,
      features: ["Hydration Compatible", "Reflective", "Lightweight"],
    },
    {
      id: "storm-runner-vest",
      image: vestImage,
      name: "Storm Runner Vest",
      category: "Outerwear",
      price: 158,
      features: ["Windproof", "Lightweight", "Packable"],
    },
    {
      id: "solar-visor",
      image: visorImage,
      name: "Solar Visor",
      category: "Accessories",
      price: 42,
      features: ["UV Protection", "Adjustable", "Quick-Dry"],
    },
    {
      id: "hydration-bottle",
      image: bottleImage,
      name: "Hydration Bottle",
      category: "Accessories",
      price: 32,
      features: ["Soft Flask", "500ml", "Leak-Proof"],
    },
    {
      id: "trail-runner-cap",
      image: capImage,
      name: "Trail Runner Cap",
      category: "Accessories",
      price: 38,
      features: ["Water-Repellent", "Breathable", "Adjustable"],
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
