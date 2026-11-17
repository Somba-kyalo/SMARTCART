"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function AddToBagButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return <button className="button button-dark detail-add" type="button" onClick={handleAdd}>{added ? <>Added to bag <Check size={17} /></> : <>Add to bag <ArrowRight size={17} /></>}</button>;
}
