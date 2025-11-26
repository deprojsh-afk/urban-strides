import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag, User, LogOut, Heart, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "로그아웃 실패",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "로그아웃 완료",
        description: "안전하게 로그아웃되었습니다.",
      });
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-display font-bold tracking-tighter hover:opacity-80 transition-opacity"
          >
            STRIDE
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate("/shop")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </button>
            <button onClick={() => navigate("/collections")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Collections
            </button>
            <button onClick={() => navigate("/technology")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Technology
            </button>
            <button onClick={() => navigate("/about")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {user && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/wishlist")}
                  className="hidden md:flex"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/orders")}
                  className="hidden md:flex"
                >
                  <Package className="h-5 w-5" />
                </Button>
              </>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    마이페이지
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="hidden md:flex"
              >
                로그인
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <button
              onClick={() => {
                navigate("/shop");
                setIsOpen(false);
              }}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => {
                navigate("/collections");
                setIsOpen(false);
              }}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Collections
            </button>
            <button
              onClick={() => {
                navigate("/technology");
                setIsOpen(false);
              }}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Technology
            </button>
            <button
              onClick={() => {
                navigate("/about");
                setIsOpen(false);
              }}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/wishlist");
                    setIsOpen(false);
                  }}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  위시리스트
                </button>
                <button
                  onClick={() => {
                    navigate("/orders");
                    setIsOpen(false);
                  }}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  주문 내역
                </button>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  마이페이지
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/auth");
                  setIsOpen(false);
                }}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                로그인
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
