import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

export interface Product {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  features: string[];
  description?: string;
  sizes?: string[];
  colors?: string[];
}

export const products: Product[] = [
  {
    id: "cloud-runner",
    image: product1,
    name: "Cloud Runner",
    category: "Shoes",
    price: 189,
    features: ["Lightweight", "Breathable", "Cushioned"],
    description: "Experience ultimate comfort with our Cloud Runner shoes. Engineered with advanced cushioning technology for a smooth, responsive ride on any surface.",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Grey"],
  },
  {
    id: "velocity-pro",
    image: product2,
    name: "Velocity Pro",
    category: "Shoes",
    price: 219,
    features: ["Carbon Plate", "Responsive", "Dynamic"],
    description: "Push your limits with the Velocity Pro. Featuring a carbon fiber plate for explosive speed and energy return in every stride.",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black", "Red", "Blue"],
  },
  {
    id: "swift-elite",
    image: product3,
    name: "Swift Elite",
    category: "Shoes",
    price: 198,
    features: ["Mesh Upper", "Flexible", "Breathable"],
    description: "Lightweight and breathable design for maximum flexibility. The Swift Elite adapts to your foot for a personalized fit.",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Grey", "Navy", "White"],
  },
  {
    id: "tech-performance-tee",
    image: product4,
    name: "Tech Performance Tee",
    category: "Tops",
    price: 78,
    features: ["Quick-Dry", "Breathable", "Reflective"],
    description: "Stay cool and visible with our Tech Performance Tee. Moisture-wicking fabric with reflective details for safe training in any condition.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: "runner-vest",
    image: product5,
    name: "Runner Vest",
    category: "Tops",
    price: 98,
    features: ["Storage", "Lightweight", "Breathable"],
    description: "Carry your essentials with ease. Multiple pockets and lightweight construction make this vest perfect for long-distance runs.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Blue"],
  },
  {
    id: "trail-cap",
    image: product6,
    name: "Trail Cap",
    category: "Accessories",
    price: 48,
    features: ["Water-Repellent", "Fast-Dry", "UV Protection"],
    description: "Protection from the elements. Water-repellent fabric with UV protection keeps you comfortable in all weather conditions.",
    sizes: ["One Size"],
    colors: ["Black", "White", "Khaki"],
  },
  {
    id: "sport-goggles",
    image: product7,
    name: "Sport Goggles",
    category: "Accessories",
    price: 158,
    features: ["Anti-Fog", "UV Protection", "Adjustable"],
    description: "Crystal-clear vision in any condition. Anti-fog coating and UV protection with an adjustable fit for maximum comfort.",
    sizes: ["One Size"],
    colors: ["Black", "Blue", "Clear"],
  },
  {
    id: "trail-pack",
    image: product8,
    name: "Trail Pack",
    category: "Accessories",
    price: 128,
    features: ["Lightweight", "Packable", "Water-Resistant"],
    description: "Your perfect trail companion. Lightweight, water-resistant, and packable design with multiple compartments for organized storage.",
    sizes: ["One Size"],
    colors: ["Black", "Grey", "Green"],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};
