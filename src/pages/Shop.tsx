import Navigation from "@/components/Navigation";
import ProductGrid from "@/components/ProductGrid";
import FilterBar from "@/components/FilterBar";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Shop = () => {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Best Collection
            </h1>
            <p className="text-muted-foreground text-lg">
              인기 제품으로 구성된 베스트 컬렉션을 만나보세요
            </p>
          </div>
          <FilterBar 
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
          />
          <ProductGrid filters={activeFilters} />
        </div>
      </main>
    </div>
  );
};

export default Shop;
