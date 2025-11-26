import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, Trash2 } from "lucide-react";

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { wishlist, loading, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
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
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 fill-primary text-primary" />
              위시리스트
            </CardTitle>
            <CardDescription>마음에 드는 상품을 저장하세요</CardDescription>
          </CardHeader>
          <CardContent>
            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground mb-4">위시리스트가 비어있습니다</p>
                <Button variant="hero" onClick={() => navigate("/")}>
                  쇼핑 시작하기
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="group relative border border-border rounded-lg overflow-hidden bg-background/50 hover:border-primary/50 transition-all"
                  >
                    {item.product_image && (
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-3">
                      <h3 className="font-medium text-lg">{item.product_name}</h3>
                      <p className="text-xl font-bold">
                        ₩{item.product_price.toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigate("/")}
                        >
                          상세보기
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFromWishlist(item.product_id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wishlist;
