import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ProductFormClient from "@/components/admin/ProductFormClient";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data: product } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return <ProductFormClient locale={locale} mode="edit" product={product} />;
}
