"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatKes } from "@/lib/products";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal } = useCart();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", county: "", town: "", addressLine: "", deliveryInstructions: "" });
  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!cart.length) return setMessage("Your bag is empty.");
    setBusy(true); setMessage("");
    const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, items: cart.map(({ product, quantity }) => ({ productId: product.id, quantity })) }) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(result.error ?? "We could not create your order.");
    router.push(`/checkout/confirmation?order=${result.orderId}`);
  }

  return <main className="checkout-page"><div className="checkout-heading"><a href="/#shop" className="back-link"><ArrowLeft size={15} /> Continue shopping</a><p className="eyebrow">Secure checkout</p><h1>Where should we deliver?</h1></div><div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><label>Full name<input required value={form.fullName} onChange={update("fullName")} /></label><label>Email<input type="email" required value={form.email} onChange={update("email")} /></label><label>Phone number<input required value={form.phone} onChange={update("phone")} placeholder="07xx xxx xxx" /></label><div className="form-row"><label>County<input required value={form.county} onChange={update("county")} /></label><label>Town<input required value={form.town} onChange={update("town")} /></label></div><label>Delivery address<input required value={form.addressLine} onChange={update("addressLine")} /></label><label>Delivery instructions <span>(optional)</span><textarea value={form.deliveryInstructions} onChange={update("deliveryInstructions")} rows={3} /></label>{message && <p className="form-error" role="alert">{message}</p>}<button className="button button-dark" disabled={busy} type="submit">{busy ? "Creating order…" : "Place order"} <ArrowRight size={17} /></button></form><aside className="checkout-summary"><p className="eyebrow">Your order</p>{cart.map(({ product, quantity }) => <div className="checkout-line" key={product.id}><span>{product.name} × {quantity}</span><strong>{formatKes(product.price * quantity)}</strong></div>)}<div className="checkout-total"><span>Subtotal</span><strong>{formatKes(subtotal)}</strong></div><small>Delivery charges and payment confirmation are handled server-side.</small></aside></div></main>;
}
