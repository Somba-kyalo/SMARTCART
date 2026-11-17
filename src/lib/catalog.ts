import { createSupabaseServerClient } from "@/lib/supabase/server";
import { products as fallbackProducts, type Product } from "@/lib/products";

type DatabaseProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_kes: number;
  compare_at_price_kes: number | null;
  stock_quantity: number;
  categories: { name: string } | null;
  product_images: { storage_path: string; alt_text: string; sort_order: number }[];
};

export async function getPublishedProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return fallbackProducts;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("products").select("id,name,slug,description,price_kes,compare_at_price_kes,stock_quantity,categories(name),product_images(storage_path,alt_text,sort_order)").eq("is_published", true).order("created_at", { ascending: false });
    if (error || !data?.length) return fallbackProducts;
    return (data as unknown as DatabaseProduct[]).map((item) => ({
      id: item.slug,
      name: item.name,
      category: item.categories?.name ?? "Everyday Essentials",
      price: item.price_kes,
      oldPrice: item.compare_at_price_kes ?? undefined,
      image: item.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0]?.storage_path ?? fallbackProducts[0].image,
      imageAlt: item.product_images?.[0]?.alt_text ?? item.name,
      description: item.description,
      colors: item.stock_quantity > 0 ? "Available" : "Sold out",
    }));
  } catch {
    return fallbackProducts;
  }
}
