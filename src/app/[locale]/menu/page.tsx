import { getTranslations } from "next-intl/server";
import ProductGrid from "@/components/menu/ProductGrid";
import type { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mock-products";

async function getProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_")) {
    return mockProducts;
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .order("display_order");

    // If the DB hasn't been migrated + re-seeded with the docx catalog yet
    // (rows missing `category`, or only the old galletas seed), fall back to
    // the mock catalog so every category has its products visible.
    const dbReady =
      Array.isArray(data) &&
      data.length > 0 &&
      data.every((row) => typeof (row as Product).category === "string");
    if (!dbReady) return mockProducts;

    const categoriesPresent = new Set((data as Product[]).map((r) => r.category));
    if (categoriesPresent.size < 2) return mockProducts;

    return data as Product[];
  } catch {
    return mockProducts;
  }
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "menu" });
  const products = await getProducts();

  return (
    <div>
      {/* Hero banner */}
      <div
        className="py-20 px-4 text-center text-white"
        style={{ backgroundColor: "#8b0031" }}
      >
        <h1 className="text-5xl md:text-6xl font-black mb-4">{t("title")}</h1>
        <p className="text-white/80 text-lg">{t("subtitle")}</p>
      </div>

      {/* Product sections (all categories visible, no horizontal scroll) */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <ProductGrid products={products} locale={locale} />
        </div>
      </div>
    </div>
  );
}
