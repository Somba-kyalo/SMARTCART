import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/auth/login");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/account");
  const [{ count: products }, { count: orders }, { count: customers }] = await Promise.all([supabase.from("products").select("id", { count: "exact", head: true }), supabase.from("orders").select("id", { count: "exact", head: true }), supabase.from("profiles").select("id", { count: "exact", head: true })]);
  return <main className="admin-page"><p className="eyebrow">Operations</p><h1>SmartCart Africa dashboard</h1><div className="admin-stats"><div><strong>{products ?? 0}</strong><span>Products</span></div><div><strong>{orders ?? 0}</strong><span>Orders</span></div><div><strong>{customers ?? 0}</strong><span>Customers</span></div></div><p className="admin-note">Product, order, supplier and payment management can be added here without exposing service-role credentials to the browser.</p></main>;
}
