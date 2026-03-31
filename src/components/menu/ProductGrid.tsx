"use client";

import { useTranslations } from "next-intl";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, Plus, Check } from "lucide-react";
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

  return (
    <div className="group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-72 overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Price badge */}
        <div
          className="absolute top-4 right-4 text-white font-black text-sm px-3 py-1.5 rounded-full shadow-lg"
          style={{ backgroundColor: "#8b0031" }}
        >
          ${product.price.toLocaleString()}
        </div>
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-base bg-black/60 px-5 py-2 rounded-full">
              {t("sold_out")}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="font-black text-2xl mb-2 leading-tight">{name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
          {description}
        </p>
        {product.available ? (
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-full transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: added ? "#16a34a" : "#8b0031" }}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                ¡Agregado!
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {t("add_to_cart")}
              </>
            )}
          </button>
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

export default function ProductGrid({ products, locale }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-6xl mb-4">🍪</div>
        <p className="text-xl font-semibold">Próximamente...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
