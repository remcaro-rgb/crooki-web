import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutSection from "@/components/home/AboutSection";
import type { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mock-products";

async function getProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_")) {
    return mockProducts.slice(0, 6);
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("available", true)
      .order("display_order")
      .limit(6);
    return data || mockProducts.slice(0, 6);
  } catch {
    return mockProducts.slice(0, 6);
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const products = await getProducts();

  return (
    <>
      <Hero locale={locale} />
      <FeaturedProducts products={products} locale={locale} />
      <AboutSection locale={locale} />
    </>
  );
}
