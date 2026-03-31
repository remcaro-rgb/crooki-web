import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/salted-caramel.jpg"
          alt="Crooki cookies"
          className="w-full h-full object-cover"
        />
        {/* Dark crimson overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(139, 0, 49, 0.75)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-semibold mb-8 border border-white/30">
          🍪 {t("badge")}
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
          {t("title")}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center bg-white font-bold text-lg px-8 py-4 rounded-full transition-all hover:bg-gray-100 hover:scale-105"
            style={{ color: "#8b0031" }}
          >
            {t("cta_order")}
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-full transition-all hover:bg-white/10"
          >
            {t("cta_menu")}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/40 animate-pulse" />
      </div>
    </section>
  );
}
