import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOrdering, setIsOrdering] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

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

    if (!paymentMethod) {
      toast({
        title: "결제 수단을 선택해주세요",
        description: "결제 수단을 선택한 후 진행해주세요.",
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
          status: "completed",
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
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/cart")}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-2xl font-display font-bold">
                주문하기
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* 결제 수단 섹션 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">결제 수단</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("naver")}
                    className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                      paymentMethod === "naver"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-center h-12">
                      <span className="text-[#03C75A] font-bold text-lg">NAVER Pay</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("kakao")}
                    className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                      paymentMethod === "kakao"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-center h-12">
                      <span className="text-[#FEE500] font-bold text-lg">Kakao Pay</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("toss")}
                    className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                      paymentMethod === "toss"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-center h-12">
                      <span className="text-[#0064FF] font-bold text-lg">Toss Pay</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-center h-12">
                      <span className="font-semibold">신용/체크 카드</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                      paymentMethod === "bank"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-center h-12">
                      <span className="font-semibold">무통장 입금</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("phone")}
                    className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                      paymentMethod === "phone"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-center h-12">
                      <span className="font-semibold">휴대폰 결제</span>
                    </div>
                  </button>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* 결제 금액 섹션 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">결제 금액</h3>
              <div className="bg-muted/30 rounded-lg p-6 space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>총 상품 금액</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>최종 결제 금액</span>
                  <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* 결제하기 버튼 */}
            <Button 
              className="w-full h-14 text-lg font-bold" 
              size="lg" 
              onClick={handleOrder}
              disabled={isOrdering || !paymentMethod}
            >
              {isOrdering ? "결제 처리 중..." : "결제하기"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
