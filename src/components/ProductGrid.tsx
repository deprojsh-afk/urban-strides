import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const ProductGrid = () => {
  const products = [
    {
      id: "cloud-runner",
      image: product1,
      name: "Cloud Runner",
      category: "Shoes",
      price: 189,
      features: ["Lightweight", "Breathable", "Cushioned"],
    },
    {
      id: "velocity-pro",
      image: product2,
      name: "Velocity Pro",
      category: "Shoes",
      price: 219,
      features: ["Carbon Plate", "Responsive", "Dynamic"],
    },
    {
      id: "swift-elite",
      image: product3,
      name: "Swift Elite",
      category: "Shoes",
      price: 198,
      features: ["Mesh Upper", "Flexible", "Breathable"],
    },
    {
      id: "tech-performance-tee",
      image: product4,
      name: "Tech Performance Tee",
      category: "Tops",
      price: 78,
      features: ["Quick-Dry", "Breathable", "Reflective"],
    },
    {
      id: "runner-vest",
      image: product5,
      name: "Runner Vest",
      category: "Tops",
      price: 98,
      features: ["Storage", "Lightweight", "Breathable"],
    },
    {
      id: "trail-cap",
      image: product6,
      name: "Trail Cap",
      category: "Accessories",
      price: 48,
      features: ["Water-Repellent", "Fast-Dry", "UV Protection"],
    },
    {
      id: "sport-goggles",
      image: product7,
      name: "Sport Goggles",
      category: "Accessories",
      price: 158,
      features: ["Anti-Fog", "UV Protection", "Adjustable"],
    },
    {
      id: "trail-pack",
      image: product8,
      name: "Trail Pack",
      category: "Accessories",
      price: 128,
      features: ["Lightweight", "Packable", "Water-Resistant"],
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
