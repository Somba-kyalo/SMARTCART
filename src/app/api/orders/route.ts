import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { products as fallbackProducts } from "@/lib/products";

type RequestItem = { productId: string; quantity: number };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as (RequestItem[] & Record<string, unknown>) | null;
  if (!body || !Array.isArray(body.items) || !body.items.length) return NextResponse.json({ error: "Add at least one product." }, { status: 400 });
  const items = body.items as RequestItem[];
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
  let trustedItems: { productId: string; quantity: number; product: { id: string; name: string; price: number; stock_quantity?: number } }[];
  if (configured) {
    const catalogClient = createSupabaseAdminClient();
    const { data } = await catalogClient.from("products").select("id,name,slug,price_kes,stock_quantity").in("slug", items.map((item) => item.productId)).eq("is_published", true);
    trustedItems = items.map((item) => { const product = data?.find((candidate) => candidate.slug === item.productId); return { productId: product?.id ?? "", quantity: item.quantity, product: product ? { id: product.id, name: product.name, price: product.price_kes, stock_quantity: product.stock_quantity } : undefined }; }).filter((item): item is typeof item & { product: NonNullable<typeof item.product> } => Boolean(item.product && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= item.product.stock_quantity));
  } else {
    trustedItems = items.map((item) => ({ ...item, product: fallbackProducts.find((product) => product.id === item.productId) })).filter((item): item is typeof item & { product: NonNullable<typeof item.product> } => Boolean(item.product && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20)).map((item) => ({ ...item, product: { id: item.product.id, name: item.product.name, price: item.product.price } }));
  }
  if (trustedItems.length !== items.length) return NextResponse.json({ error: "One or more products or quantities are invalid." }, { status: 400 });
  if (!body.fullName || !body.email || !body.phone || !body.county || !body.town || !body.addressLine) return NextResponse.json({ error: "Complete all required delivery details." }, { status: 400 });
  const subtotal = trustedItems.reduce((sum, item) => sum + item.product!.price * item.quantity, 0);
  if (!configured) return NextResponse.json({ error: "Ordering is not configured yet. Apply the Supabase migration and add environment variables first." }, { status: 503 });
  const sessionClient = await createSupabaseServerClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  const supabase = createSupabaseAdminClient();
  const { data: order, error } = await supabase.from("orders").insert({ user_id: user?.id ?? null, email: String(body.email), status: "pending", subtotal_kes: subtotal, delivery_fee_kes: 0, delivery_details: { fullName: body.fullName, phone: body.phone, county: body.county, town: body.town, addressLine: body.addressLine, deliveryInstructions: body.deliveryInstructions ?? "" } }).select("id").single();
  if (error || !order) return NextResponse.json({ error: "We could not create your order." }, { status: 500 });
  const { error: itemError } = await supabase.from("order_items").insert(trustedItems.map((item) => ({ order_id: order.id, product_id: item.product.id, product_name: item.product.name, unit_price_kes: item.product.price, quantity: item.quantity })));
  if (itemError) return NextResponse.json({ error: "Order creation could not be completed." }, { status: 500 });
  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
