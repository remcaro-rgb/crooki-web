import { getTranslations } from "next-intl/server";
import { mockMerch } from "@/lib/mock-products";
import MerchGrid from "@/components/menu/MerchGrid";
import type { CategoryRow, Product } from "@/lib/types";

async function loadMerch(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_")) {
    return mockMerch;
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: merchCats } = await supabase
      .from("categories")
      .select("slug")
      .eq("kind", "merch");
    const slugs = ((merchCats as { slug: string }[] | null) ?? []).map((c) => c.slug);
    if (slugs.length === 0) return mockMerch;
    const { data: products } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .in("category", slugs)
      .order("display_order");
    return ((products as Product[] | null) ?? []).length > 0
      ? (products as Product[])
      : mockMerch;
  } catch {
    return mockMerch;
  }
}

export default async function MerchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "merch" });
  const products = await loadMerch();

  return (
    <div>
      <div className="py-20 px-4 text-center text-white" style={{ backgroundColor: "#8b0031" }}>
        <h1 className="text-5xl md:text-6xl font-black mb-4">{t("title")}</h1>
        <p className="text-white/80 text-lg">{t("subtitle")}</p>
      </div>

      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <MerchGrid products={products} locale={locale} />
        </div>
      </div>
    </div>
  );
}
