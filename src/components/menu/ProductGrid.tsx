"use client";

import { useTranslations } from "next-intl";
import type { Product, Category } from "@/lib/types";
import { CATEGORY_ORDER } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  products: Product[];
  locale: string;
}

function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const t = useTranslations("menu");
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const name = locale === "en" ? product.name_en : product.name_es;
  const description = locale === "en" ? product.description_en : product.description_es;
  const imageUrl =
    product.product_images?.[0]?.url ||
    `/images/${product.id.toLowerCase().replace(/\s+/g, "-")}.jpg`;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const hasPrice = product.price > 0;

  return (
    <div className="group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-72 overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {hasPrice && (
          <div
            className="absolute top-4 right-4 text-white font-black text-sm px-3 py-1.5 rounded-full shadow-lg"
            style={{ backgroundColor: "#8b0031" }}
          >
            ${product.price.toLocaleString("es-CO")}
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-base bg-black/60 px-5 py-2 rounded-full">
              {t("sold_out")}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-black text-2xl mb-2 leading-tight">{name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
          {description}
        </p>
        {product.available && hasPrice ? (
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-full transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: added ? "#16a34a" : "#8b0031" }}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                {locale === "en" ? "Added!" : "¡Agregado!"}
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {t("add_to_cart")}
              </>
            )}
          </button>
        ) : !hasPrice ? (
          <div className="w-full py-3.5 rounded-full bg-gray-50 text-gray-400 font-semibold text-center text-sm">
            {locale === "en" ? "Ask in store" : "Consultar en tienda"}
          </div>
        ) : (
          <button
            disabled
            className="w-full py-3.5 rounded-full bg-gray-100 text-gray-400 font-semibold cursor-not-allowed"
          >
            {t("sold_out")}
          </button>
        )}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  products,
  locale,
  title,
  emptyLabel,
}: {
  category: Category;
  products: Product[];
  locale: string;
  title: string;
  emptyLabel: string;
}) {
  return (
    <section id={`cat-${category}`} className="scroll-mt-24">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-black text-3xl md:text-4xl" style={{ color: "#8b0031" }}>
          {title}
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
          <p className="text-lg font-semibold">{emptyLabel}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ProductGrid({ products, locale }: Props) {
  const t = useTranslations("menu");
  const tCat = useTranslations("categories");

  const byCategory = new Map<Category, Product[]>();
  for (const cat of CATEGORY_ORDER) byCategory.set(cat, []);
  for (const p of products) {
    if (byCategory.has(p.category)) byCategory.get(p.category)!.push(p);
  }

  return (
    <div className="space-y-20">
      {/* Category chips — all visible, no horizontal scroll, wraps naturally */}
      <nav className="flex flex-wrap gap-2 justify-center">
        {CATEGORY_ORDER.map((cat) => (
          <a
            key={cat}
            href={`#cat-${cat}`}
            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors"
            style={{ color: "#8b0031" }}
          >
            {tCat(cat)}
          </a>
        ))}
      </nav>

      {CATEGORY_ORDER.map((cat) => (
        <CategorySection
          key={cat}
          category={cat}
          products={byCategory.get(cat)!.sort((a, b) => a.display_order - b.display_order)}
          locale={locale}
          title={tCat(cat)}
          emptyLabel={t("coming_soon")}
        />
      ))}
    </div>
  );
}
