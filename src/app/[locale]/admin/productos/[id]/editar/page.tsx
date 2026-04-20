import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import ProductFormClient from "@/components/admin/ProductFormClient";
import type { CategoryRow, Product } from "@/lib/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const { supabase } = await requireAdmin(locale);

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, product_images(*)").eq("id", id).single(),
    supabase.from("categories").select("*").order("kind").order("display_order"),
  ]);

  if (!product) notFound();

  return (
    <ProductFormClient
      locale={locale}
      mode="edit"
      product={product as Product}
      categories={(categories as CategoryRow[]) ?? []}
    />
  );
}
