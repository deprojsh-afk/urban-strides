import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  image: string;
  name: string;
  category: string;
  price: number;
  features: string[];
}

const ProductCard = ({ image, name, category, price, features }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-500">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Button
          variant="hero"
          size="sm"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"
        >
          Quick View
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
          <h3 className="text-base font-semibold mt-1">{name}</h3>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {features.map((feature) => (
            <span
              key={feature}
              className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-sm"
            >
              {feature}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${price}</span>
          <Button variant="ghost" size="sm" className="text-xs">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
