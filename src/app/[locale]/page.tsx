import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutSection from "@/components/home/AboutSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("available", true)
    .order("display_order")
    .limit(6);

  return (
    <>
      <Hero locale={locale} />
      <FeaturedProducts products={products || []} locale={locale} />
      <AboutSection locale={locale} />
    </>
  );
}
