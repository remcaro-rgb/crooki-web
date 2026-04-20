import { requireAdmin } from "@/lib/admin-auth";
import ProductFormClient from "@/components/admin/ProductFormClient";
import type { CategoryRow } from "@/lib/types";

export default async function NewProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kind?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const { kind, category } = await searchParams;

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("kind")
    .order("display_order");

  return (
    <ProductFormClient
      locale={locale}
      mode="create"
      categories={(categories as CategoryRow[]) ?? []}
      initialKind={kind === "merch" ? "merch" : "menu"}
      initialCategory={category}
    />
  );
}
