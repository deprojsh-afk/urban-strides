import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const Collections = () => {
  const navigate = useNavigate();

  const collections = [
    {
      name: "Urban Runner",
      description: "도시의 거리를 위한 스타일리시한 러닝 컬렉션",
      products: products.filter(p => ["Shoes", "Leggings"].includes(p.category)),
    },
    {
      name: "Performance Pro",
      description: "최고의 기능성을 추구하는 프로페셔널 라인",
      products: products.filter(p => ["Top", "Jacket"].includes(p.category)),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 px-4 lg:px-8">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로
          </Button>
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Collections
            </h1>
            <p className="text-muted-foreground text-lg">
              스타일과 기능을 완벽하게 조화시킨 STRIDE의 시그니처 컬렉션
            </p>
          </div>

          <div className="space-y-16">
            {collections.map((collection) => (
              <div key={collection.name}>
                <div className="mb-8">
                  <h2 className="text-3xl font-display font-bold mb-2">
                    {collection.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {collection.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {collection.products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Collections;
