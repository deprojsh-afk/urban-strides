import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  product_price: number;
  created_at: string;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWishlist(data || []);
    } catch (error: any) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (
    productId: string,
    productName: string,
    productImage: string | null,
    productPrice: number
  ) => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "위시리스트에 추가하려면 로그인하세요",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("wishlists").insert({
        user_id: user.id,
        product_id: productId,
        product_name: productName,
        product_image: productImage,
        product_price: productPrice,
      });

      if (error) throw error;

      toast({
        title: "추가 완료",
        description: "위시리스트에 추가되었습니다",
      });

      await fetchWishlist();
    } catch (error: any) {
      if (error.code === "23505") {
        toast({
          title: "이미 추가됨",
          description: "이미 위시리스트에 있는 상품입니다",
        });
      } else {
        toast({
          title: "추가 실패",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;

      toast({
        title: "제거 완료",
        description: "위시리스트에서 제거되었습니다",
      });

      await fetchWishlist();
    } catch (error: any) {
      toast({
        title: "제거 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product_id === productId);
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};
