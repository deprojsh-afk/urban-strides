import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  if (!product) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">제품을 찾을 수 없습니다</h1>
            <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
          </div>
        </div>
      </>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id, product.name, product.image, product.price);
    }
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSize(selectedSize === size ? "" : size);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColor(selectedColor === color ? "" : color);
  };

  const handleAddToCart = () => {
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasColors = product.colors && product.colors.length > 0;

    if (hasSizes && !selectedSize) {
      toast({
        title: "사이즈를 선택해주세요",
        description: "장바구니에 담으려면 사이즈를 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    if (hasColors && !selectedColor) {
      toast({
        title: "색상을 선택해주세요",
        description: "장바구니에 담으려면 색상을 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    addToCart(
      product.id,
      product.name,
      product.image,
      product.price,
      selectedSize,
      selectedColor
    );

    toast({
      title: "장바구니에 담았습니다",
      description: `${product.name}이(가) 장바구니에 추가되었습니다.`,
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen py-8 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로 가기
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* 제품 이미지 */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* 제품 정보 */}
            <div className="flex flex-col">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl font-display font-bold mb-4">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold mb-6">${product.price}</p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.features.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">
                    사이즈
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSizeToggle(size)}
                        className="min-w-[60px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">
                    색상
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleColorToggle(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  장바구니에 담기
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`h-5 w-5 transition-all ${
                      inWishlist ? "fill-primary text-primary" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
