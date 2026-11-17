"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products";

export type CartLine = { product: Product; quantity: number };

type CartContextValue = {
  cart: CartLine[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  changeQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("smartcart-cart");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CartLine[];
      if (Array.isArray(parsed)) setCart(parsed.filter((line) => line?.product?.id && line.quantity > 0));
    } catch {
      window.localStorage.removeItem("smartcart-cart");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("smartcart-cart", JSON.stringify(cart));
  }, [cart]);

  const value = useMemo<CartContextValue>(() => ({
    cart,
    itemCount: cart.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    addToCart: (product) => setCart((current) => {
      const line = current.find((item) => item.product.id === product.id);
      return line
        ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { product, quantity: 1 }];
    }),
    changeQuantity: (productId, delta) => setCart((current) => current
      .map((line) => line.product.id === productId ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line)
      .filter((line) => line.quantity > 0)),
    removeFromCart: (productId) => setCart((current) => current.filter((line) => line.product.id !== productId)),
  }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
