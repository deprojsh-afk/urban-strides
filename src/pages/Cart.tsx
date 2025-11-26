import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              장바구니
            </CardTitle>
            <CardDescription>장바구니에 담긴 상품을 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground mb-4">장바구니가 비어있습니다</p>
                <Button variant="hero" onClick={() => navigate("/")}>
                  쇼핑 시작하기
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-4 py-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-lg bg-muted"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{item.productName}</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {item.size && <p>사이즈: {item.size}</p>}
                          {item.color && <p>색상: {item.color}</p>}
                          <p className="font-semibold text-foreground">${item.price}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
                <div className="pt-4 space-y-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>총 금액</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={() => navigate("/checkout")}
                  >
                    주문하기
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
