"use client";

import { useMemo, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Loader2, Upload, X, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { CategoryKind, CategoryRow, Product } from "@/lib/types";

interface Props {
  locale: string;
  mode: "create" | "edit";
  product?: Product;
  categories: CategoryRow[];
  initialKind?: CategoryKind;
  initialCategory?: string;
}

export default function ProductFormClient({
  locale,
  mode,
  product,
  categories,
  initialKind = "menu",
  initialCategory,
}: Props) {
  const t = useTranslations("admin");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [existingImages, setExistingImages] = useState(product?.product_images ?? []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Determine kind from the product's category (edit) or the URL hint (create).
  const productKind: CategoryKind = useMemo(() => {
    const match = categories.find((c) => c.slug === product?.category);
    return (match?.kind as CategoryKind) ?? initialKind;
  }, [categories, product?.category, initialKind]);

  const [kind, setKind] = useState<CategoryKind>(productKind);

  const categoriesForKind = useMemo(
    () => categories.filter((c) => c.kind === kind).sort((a, b) => a.display_order - b.display_order),
    [categories, kind],
  );

  const [form, setForm] = useState({
    name_es: product?.name_es ?? "",
    name_en: product?.name_en ?? "",
    description_es: product?.description_es ?? "",
    description_en: product?.description_en ?? "",
    price: product?.price?.toString() ?? "",
    category:
      product?.category ??
      initialCategory ??
      categories.find((c) => c.kind === initialKind)?.slug ??
      "",
    available: product?.available ?? true,
    display_order: product?.display_order?.toString() ?? "0",
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    const supabase = createClient();
    await supabase.from("product_images").delete().eq("id", imageId);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const uploadImages = async (productId: string) => {
    if (!newImageFiles.length) return;
    const supabase = createClient();

    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i];
      const ext = file.name.split(".").pop();
      const path = `products/${productId}/${Date.now()}-${i}.${ext}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });

      if (error) {
        toast.error(`Error subiendo imagen: ${error.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);

      await supabase.from("product_images").insert({
        product_id: productId,
        url: publicUrl,
        display_order: existingImages.length + i,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name_es.trim()) {
      toast.error("El nombre en español es requerido");
      return;
    }
    setLoading(true);

    if (!form.category) {
      toast.error("La categoría es requerida");
      return;
    }

    try {
      const supabase = createClient();
      const productData = {
        name_es: form.name_es,
        name_en: form.name_en,
        description_es: form.description_es,
        description_en: form.description_en,
        price: parseFloat(form.price) || 0,
        category: form.category,
        available: form.available,
        display_order: parseInt(form.display_order) || 0,
      };

      let productId = product?.id;

      if (mode === "create") {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
        if (error) throw error;
        productId = data.id;
      } else if (productId) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", productId);
        if (error) throw error;
      }

      if (productId) {
        setUploadingImages(true);
        await uploadImages(productId);
        setUploadingImages(false);
      }

      toast.success(mode === "create" ? "Producto creado exitosamente" : "Producto actualizado");
      router.push(`/${locale}/admin`);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error al guardar el producto");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.id) return;
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      toast.error("Error al eliminar el producto");
    } else {
      toast.success("Producto eliminado");
      router.push(`/${locale}/admin`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <a
        href={`/${locale}/admin`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al panel
      </a>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black" style={{ color: "#8b0031" }}>
          {mode === "create" ? t("new_product") : t("edit_product")}
        </h1>
        {mode === "edit" && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {t("delete")}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Spanish Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("product_name")} *</label>
            <input
              type="text"
              value={form.name_es}
              onChange={(e) => setForm({ ...form, name_es: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
              placeholder="Caramelo Salado"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("product_name_en")}</label>
            <input
              type="text"
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
              placeholder="Salted Caramel"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("product_description")}</label>
            <textarea
              value={form.description_es}
              onChange={(e) => setForm({ ...form, description_es: e.target.value })}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all resize-none"
              placeholder="Galleta de masa suave con relleno de caramelo salado..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("product_description_en")}</label>
            <textarea
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all resize-none"
              placeholder="Soft dough cookie with salted caramel filling..."
            />
          </div>
        </div>

        {/* Kind + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Tipo</label>
            <div className="flex gap-2">
              {(["menu", "merch"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setKind(k);
                    const first = categories.find((c) => c.kind === k);
                    if (first) setForm((f) => ({ ...f, category: first.slug }));
                  }}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-colors border"
                  style={{
                    backgroundColor: kind === k ? "#8b0031" : "transparent",
                    color: kind === k ? "#ffffff" : "#8b0031",
                    borderColor: kind === k ? "#8b0031" : "#e5e7eb",
                  }}
                >
                  {k === "menu" ? "Menú" : "Merch"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Categoría *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all bg-white"
              required
            >
              <option value="">Seleccionar categoría…</option>
              {categoriesForKind.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label_es}
                </option>
              ))}
            </select>
            {categoriesForKind.length === 0 && (
              <p className="text-xs text-red-600 mt-1">
                No hay categorías para este tipo. Crea una primero.
              </p>
            )}
          </div>
        </div>

        {/* Price + Order + Available */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("product_price")} *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
              placeholder="1500"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Orden de display</label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
              min="0"
            />
          </div>
          <div className="flex flex-col justify-center">
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("product_available")}</label>
            <label className="flex items-center gap-3 cursor-pointer mt-1">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="sr-only"
                />
                <div
                  className="w-12 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: form.available ? "#8b0031" : "#d1d5db" }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: form.available ? "translateX(26px)" : "translateX(2px)" }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {form.available ? "Disponible" : "Agotado"}
              </span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700">{t("product_images")}</label>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt=""
                    className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New image previews */}
          {newImagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {newImagePreviews.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt=""
                    className="w-24 h-24 rounded-xl object-cover border-2 border-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload zone */}
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">{t("drag_drop")}</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 text-white font-bold py-4 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#8b0031" }}
          >
            {(loading || uploadingImages) && <Loader2 className="w-5 h-5 animate-spin" />}
            {uploadingImages ? "Subiendo imágenes..." : loading ? "Guardando..." : t("save")}
          </button>
          <a
            href={`/${locale}/admin`}
            className="px-8 flex items-center justify-center font-semibold border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            {t("cancel")}
          </a>
        </div>
      </form>
    </div>
  );
}
