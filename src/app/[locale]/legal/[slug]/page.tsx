import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getLegalDoc, legalDocs } from "@/content/legal";
import LegalMarkdown from "@/components/legal/LegalMarkdown";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    legalDocs.map((doc) => ({ locale, slug: doc.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};
  return { title: `${doc[locale === "en" ? "en" : "es"].title} | Crooki` };
}

export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();
  const t = await getTranslations({ locale, namespace: "legal" });
  const content = doc[locale === "en" ? "en" : "es"];

  return (
    <div>
      <div className="py-16 px-4 text-center text-white" style={{ backgroundColor: "#8b0031" }}>
        <h1 className="text-3xl md:text-5xl font-black max-w-3xl mx-auto">{content.title}</h1>
      </div>

      <div className="py-12 px-4 bg-white">
        <article className="max-w-3xl mx-auto">
          <Link href="/legal" className="inline-block mb-8 text-sm font-bold text-[#8b0031] hover:underline">
            ← {t("back")}
          </Link>
          {locale === "en" && (
            <p className="mb-8 rounded-lg bg-gray-100 p-4 text-sm text-gray-600">
              {t("translation_note")}
            </p>
          )}
          <LegalMarkdown source={content.body} />
        </article>
      </div>
    </div>
  );
}
