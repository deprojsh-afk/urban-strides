import { useState, useEffect } from "react";

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  const saveToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCartItems(items);
  };

  const addToCart = (
    productId: string,
    productName: string,
    productImage: string,
    price: number,
    size?: string,
    color?: string
  ) => {
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      saveToLocalStorage(updatedItems);
    } else {
      const newItem: CartItem = {
        id: `${productId}-${size || ""}-${color || ""}-${Date.now()}`,
        productId,
        productName,
        productImage,
        price,
        size,
        color,
        quantity: 1,
      };
      saveToLocalStorage([...cartItems, newItem]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    saveToLocalStorage(updatedItems);
  };

  const removeFromCart = (itemId: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    saveToLocalStorage(updatedItems);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
  };
};
