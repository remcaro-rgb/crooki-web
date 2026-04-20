import { getTranslations } from "next-intl/server";
import { mockMerch } from "@/lib/mock-products";
import MerchGrid from "@/components/menu/MerchGrid";

export default async function MerchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "merch" });

  return (
    <div>
      <div
        className="py-20 px-4 text-center text-white"
        style={{ backgroundColor: "#8b0031" }}
      >
        <h1 className="text-5xl md:text-6xl font-black mb-4">{t("title")}</h1>
        <p className="text-white/80 text-lg">{t("subtitle")}</p>
      </div>

      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <MerchGrid products={mockMerch} locale={locale} />
        </div>
      </div>
    </div>
  );
}
