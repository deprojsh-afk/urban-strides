import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCart();
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
      navigate("/cart");
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 max-w-6xl">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground mb-4">장바구니가 비어있습니다</p>
                <Button variant="hero" onClick={() => navigate("/cart")}>
                  장바구니로 돌아가기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              주문 확인
            </CardTitle>
            <CardDescription>주문 내역을 확인하고 결제를 진행하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">주문 상품</h3>
              {cartItems.map((item) => (
                <div key={item.id}>
                  <div className="flex gap-4 py-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg bg-muted"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">{item.productName}</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {item.size && <p>사이즈: {item.size}</p>}
                        {item.color && <p>색상: {item.color}</p>}
                        <p>수량: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="flex justify-between items-center text-xl font-bold">
                <span>총 결제 금액</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => navigate("/cart")}
                >
                  장바구니로 돌아가기
                </Button>
                <Button 
                  className="flex-1" 
                  size="lg" 
                  onClick={handleOrder}
                  disabled={isOrdering}
                >
                  {isOrdering ? "주문 처리 중..." : "주문하기"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
