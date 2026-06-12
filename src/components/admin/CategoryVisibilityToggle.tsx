"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Props {
  slug: string;
  initialVisible: boolean;
}

// Per-row switch on the admin category list: controls whether the category
// (and its products) appears on the customer pages.
export default function CategoryVisibilityToggle({ slug, initialVisible }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(initialVisible);
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    if (saving) return;
    const next = !visible;
    setVisible(next);
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .update({ visible: next })
      .eq("slug", slug);

    if (error) {
      setVisible(!next);
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success(next ? "Categoría visible en la web" : "Categoría oculta de la web");
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none" title="Visible en la web">
      <div className="relative">
        <input
          type="checkbox"
          checked={visible}
          onChange={handleToggle}
          disabled={saving}
          className="sr-only"
        />
        <div
          className="w-12 h-6 rounded-full transition-colors"
          style={{ backgroundColor: visible ? "#8b0031" : "#d1d5db", opacity: saving ? 0.6 : 1 }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
            style={{ transform: visible ? "translateX(26px)" : "translateX(2px)" }}
          />
        </div>
      </div>
      <span className="text-xs font-semibold w-12" style={{ color: visible ? "#8b0031" : "#9ca3af" }}>
        {visible ? "Visible" : "Oculta"}
      </span>
    </label>
  );
}
