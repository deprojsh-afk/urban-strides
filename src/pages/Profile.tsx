import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package } from "lucide-react";
import Navigation from "@/components/Navigation";
import { z } from "zod";
import { format } from "date-fns";

const profileSchema = z.object({
  fullName: z.string().trim().min(1, { message: "이름을 입력하세요" }).max(100),
  phoneNumber: z.string().trim().max(20).optional(),
  birthDate: z.string().optional(),
});

type ProfileData = z.infer<typeof profileSchema>;

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    phoneNumber: "",
    birthDate: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfileData({
            fullName: data.full_name || "",
            phoneNumber: data.phone_number || "",
            birthDate: data.birth_date || "",
          });
        }
      } catch (error: any) {
        toast({
          title: "프로필 로드 실패",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  // Fetch order history
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        if (ordersData) {
          // Fetch order items for each order
          const ordersWithItems = await Promise.all(
            ordersData.map(async (order) => {
              const { data: itemsData, error: itemsError } = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id", order.id);

              if (itemsError) throw itemsError;

              return {
                ...order,
                order_items: itemsData || [],
              };
            })
          );

          setOrders(ordersWithItems);
        }
      } catch (error: any) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const validated = profileSchema.parse(profileData);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: validated.fullName,
          phone_number: validated.phoneNumber || null,
          birth_date: validated.birthDate || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "저장 완료",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      });
    } catch (error: any) {
      toast({
        title: "저장 실패",
        description: error.errors?.[0]?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="grid gap-6">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-display font-bold">마이페이지</CardTitle>
              <CardDescription>프로필 정보를 관리하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">이름 *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="홍길동"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, fullName: e.target.value })
                    }
                    disabled={isSaving}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">전화번호</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={profileData.phoneNumber}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phoneNumber: e.target.value })
                    }
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">생년월일</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) =>
                      setProfileData({ ...profileData, birthDate: e.target.value })
                    }
                    disabled={isSaving}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isSaving} variant="hero">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      "저장"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    disabled={isSaving}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-display font-bold flex items-center gap-2">
                <Package className="h-6 w-6" />
                주문 내역
              </CardTitle>
              <CardDescription>과거 구매 내역을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>주문 내역이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-border rounded-lg p-4 space-y-4 bg-background/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            주문일: {format(new Date(order.created_at), "yyyy년 MM월 dd일")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            주문번호: {order.id.slice(0, 8)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            ₩{order.total_amount.toLocaleString()}
                          </p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {order.status === "pending" && "결제 대기"}
                            {order.status === "processing" && "처리중"}
                            {order.status === "completed" && "완료"}
                            {order.status === "cancelled" && "취소됨"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-border">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            {item.product_image && (
                              <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.product_name}</p>
                              <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                                {item.size && <span>사이즈: {item.size}</span>}
                                {item.color && <span>색상: {item.color}</span>}
                                <span>수량: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-medium">
                                ₩{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
