import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "주문하려면 로그인해주세요.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "장바구니가 비어있습니다",
        description: "상품을 추가해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsOrdering(true);

    try {
      const totalAmount = getTotalPrice();

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        product_name: item.productName,
        product_image: item.productImage,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      localStorage.removeItem("cart");

      toast({
        title: "주문이 완료되었습니다",
        description: "주문 내역에서 확인하실 수 있습니다.",
      });

      navigate("/orders");
    } catch (error: any) {
      toast({
        title: "주문에 실패했습니다",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  };

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
                    onClick={handleOrder}
                    disabled={isOrdering}
                  >
                    {isOrdering ? "주문 중..." : "주문하기"}
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
