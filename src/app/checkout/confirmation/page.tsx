import Link from "next/link";

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const order = (await searchParams).order;
  return <main className="confirmation-page"><p className="eyebrow">Order received</p><h1>Thank you. We’re preparing your order.</h1><p>Your order reference is <strong>{order ?? "pending"}</strong>. Payment confirmation and delivery updates will be sent to your email or phone.</p><Link href="/" className="button button-dark">Continue shopping</Link></main>;
}
