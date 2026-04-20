import { getTranslations } from "next-intl/server";
import ProductGrid from "@/components/menu/ProductGrid";
import type { CategoryRow, Product } from "@/lib/types";
import { mockProducts } from "@/lib/mock-products";

async function loadCatalog(): Promise<{ categories: CategoryRow[]; products: Product[] }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_")) {
    return { categories: [], products: mockProducts };
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const [{ data: categories }, { data: products }] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("kind", "menu")
        .order("display_order"),
      supabase
        .from("products")
        .select("*, product_images(*)")
        .order("display_order"),
    ]);
    return {
      categories: (categories as CategoryRow[]) ?? [],
      products: (products as Product[]) ?? mockProducts,
    };
  } catch {
    return { categories: [], products: mockProducts };
  }
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "menu" });
  const { categories, products } = await loadCatalog();

  return (
    <div>
      <div className="py-20 px-4 text-center text-white" style={{ backgroundColor: "#8b0031" }}>
        <h1 className="text-5xl md:text-6xl font-black mb-4">{t("title")}</h1>
        <p className="text-white/80 text-lg">{t("subtitle")}</p>
      </div>

      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <ProductGrid products={products} categories={categories} locale={locale} />
        </div>
      </div>
    </div>
  );
}
