import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/auth/login");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("full_name,phone").eq("id", user.id).maybeSingle();
  const { data: orders } = await supabase.from("orders").select("id,status,total_kes,created_at").order("created_at", { ascending: false }).limit(10);
  return <main className="account-page"><div className="account-heading"><div><p className="eyebrow">Your account</p><h1>{profile?.full_name || "Welcome back"}</h1><p>{user.email}</p></div><Link href="/" className="text-link">Continue shopping</Link></div><section className="account-panel"><h2>Recent orders</h2>{orders?.length ? <div className="order-list">{orders.map((order) => <div className="order-row" key={order.id}><span>#{order.id.slice(0, 8)}</span><strong>{order.status.replaceAll("_", " ")}</strong><span>KSh {order.total_kes.toLocaleString("en-KE")}</span></div>)}</div> : <p className="empty-state">Your orders will appear here after checkout.</p>}</section></main>;
}
