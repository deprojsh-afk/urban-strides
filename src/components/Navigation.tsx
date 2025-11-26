import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-2xl font-display font-bold tracking-tighter">
            STRIDE
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </a>
            <a href="#collections" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Collections
            </a>
            <a href="#technology" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Technology
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center">
                0
              </span>
            </Button>

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
            <a href="#shop" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </a>
            <a href="#collections" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Collections
            </a>
            <a href="#technology" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Technology
            </a>
            <a href="#about" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
