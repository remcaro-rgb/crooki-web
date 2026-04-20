import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import CategoryFormClient from "@/components/admin/CategoryFormClient";
import type { CategoryRow } from "@/lib/types";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const { supabase } = await requireAdmin(locale);

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  return (
    <CategoryFormClient
      locale={locale}
      mode="edit"
      category={category as CategoryRow}
    />
  );
}
