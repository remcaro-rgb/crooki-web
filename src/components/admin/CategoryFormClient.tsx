"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { CategoryKind, CategoryRow } from "@/lib/types";

interface Props {
  locale: string;
  mode: "create" | "edit";
  category?: CategoryRow;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryFormClient({ locale, mode, category }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slug: category?.slug ?? "",
    label_es: category?.label_es ?? "",
    label_en: category?.label_en ?? "",
    kind: (category?.kind ?? "menu") as CategoryKind,
    display_order: category?.display_order?.toString() ?? "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label_es.trim()) {
      toast.error("El nombre en español es requerido");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const row = {
      slug: form.slug || slugify(form.label_es),
      label_es: form.label_es,
      label_en: form.label_en || form.label_es,
      kind: form.kind,
      display_order: parseInt(form.display_order) || 0,
    };

    const { error } =
      mode === "create"
        ? await supabase.from("categories").insert(row)
        : await supabase
            .from("categories")
            .update(row)
            .eq("slug", category!.slug);

    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success(mode === "create" ? "Categoría creada" : "Categoría actualizada");
      router.push(`/admin/categorias`);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!category) return;
    if (
      !confirm(
        `¿Eliminar la categoría "${category.label_es}"? Los productos asignados quedarán sin categoría y no se mostrarán.`,
      )
    )
      return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("slug", category.slug);
    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success("Categoría eliminada");
      router.push(`/admin/categorias`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <a
        href={`/${locale}/admin/categorias`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a categorías
      </a>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black" style={{ color: "#8b0031" }}>
          {mode === "create" ? "Nueva categoría" : "Editar categoría"}
        </h1>
        {mode === "edit" && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">Tipo</label>
          <div className="flex gap-2">
            {(["menu", "merch"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setForm({ ...form, kind: k })}
                disabled={mode === "edit"}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold border transition-colors disabled:opacity-60"
                style={{
                  backgroundColor: form.kind === k ? "#8b0031" : "transparent",
                  color: form.kind === k ? "#ffffff" : "#8b0031",
                  borderColor: form.kind === k ? "#8b0031" : "#e5e7eb",
                }}
              >
                {k === "menu" ? "Menú" : "Merch"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">Nombre (Español) *</label>
          <input
            type="text"
            value={form.label_es}
            onChange={(e) => setForm({ ...form, label_es: e.target.value })}
            required
            placeholder="Galletas"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">Nombre (Inglés)</label>
          <input
            type="text"
            value={form.label_en}
            onChange={(e) => setForm({ ...form, label_en: e.target.value })}
            placeholder="Cookies"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">
              Slug {mode === "edit" && <span className="text-gray-400 text-xs">(no editable)</span>}
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              disabled={mode === "edit"}
              placeholder="galletas"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 font-mono disabled:bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-1">
              Se genera desde el nombre si está vacío. Solo minúsculas, números y guiones.
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Orden de display</label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              min="0"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 text-white font-bold py-4 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#8b0031" }}
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <a
            href={`/${locale}/admin/categorias`}
            className="px-8 py-4 rounded-full border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
