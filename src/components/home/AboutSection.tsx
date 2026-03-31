import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";

export default async function AboutSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "about" });

  const features = [
    { key: "feature1", icon: "🌾" },
    { key: "feature2", icon: "👩‍🍳" },
    { key: "feature3", icon: "❤️" },
  ] as const;

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#fdf8f0" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/pistachio-dream.jpg"
                alt="Crooki artisan cookies"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
            {/* Floating badge */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full flex items-center justify-center text-white font-black text-center text-sm shadow-xl"
              style={{ backgroundColor: "#8b0031" }}
            >
              <div>
                <div className="text-3xl">🍪</div>
                <div className="text-xs mt-1">100% Artesanal</div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "#8b0031" }}>
              {t("title")}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {t("description")}
            </p>

            <div className="flex flex-col gap-4">
              {features.map(({ key, icon }) => (
                <div key={key} className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ backgroundColor: "#8b003115" }}
                  >
                    {icon}
                  </div>
                  <span className="font-semibold text-gray-800 text-lg">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
