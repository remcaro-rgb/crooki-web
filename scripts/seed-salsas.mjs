#!/usr/bin/env node
// Seed the "Salsas" menu category and 6 salsa products into the production
// Supabase DB, then upload sample images and link them via product_images.
// Idempotent: re-running upserts the category and skips products that already
// exist (matched by name_es).

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "../.env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORY = {
  slug: "salsas",
  label_es: "Salsas",
  label_en: "Sauces",
  kind: "menu",
  display_order: 5,
};

const PRODUCTS = [
  {
    name_es: "Salsa de pistacho",
    name_en: "Pistachio sauce",
    description_es:
      "Salsa cremosa de pistacho, perfecta para acompañar helado, galletas o malteadas.",
    description_en:
      "Creamy pistachio sauce, perfect to top ice cream, cookies or milkshakes.",
    price: 3500,
    image: "pistachio-dream.jpg",
    display_order: 1,
  },
  {
    name_es: "Salsa de Lotus",
    name_en: "Lotus sauce",
    description_es:
      "Salsa de Lotus Biscoff con su inconfundible sabor a galleta caramelizada.",
    description_en:
      "Lotus Biscoff sauce with its signature caramelized cookie flavor.",
    price: 3500,
    image: "lotus-biscoff.jpg",
    display_order: 2,
  },
  {
    name_es: "Salsa de Kínder",
    name_en: "Kinder sauce",
    description_es:
      "Salsa cremosa inspirada en el chocolate Kínder, suave y dulce.",
    description_en:
      "Creamy sauce inspired by Kinder chocolate, smooth and sweet.",
    price: 3500,
    image: "klim-brigadeiro.jpg",
    display_order: 3,
  },
  {
    name_es: "Salsa de Milo crunch",
    name_en: "Milo crunch sauce",
    description_es:
      "Salsa de Milo con trocitos crunchy para una experiencia chocolatada con textura.",
    description_en:
      "Milo sauce with crunchy bits for a chocolaty experience with texture.",
    price: 3500,
    image: "milo-bomb.jpg",
    display_order: 4,
  },
  {
    name_es: "Salsa de Nutella",
    name_en: "Nutella sauce",
    description_es:
      "Clásica salsa de Nutella, avellana y chocolate en su mejor versión.",
    description_en: "Classic Nutella sauce — hazelnut and chocolate at their best.",
    price: 3500,
    image: "red-nutella.jpg",
    display_order: 5,
  },
  {
    name_es: "Salsa pistacho crunchy",
    name_en: "Crunchy pistachio sauce",
    description_es:
      "Salsa de pistacho con trocitos crunchy de pistacho para un toque extra de textura.",
    description_en:
      "Pistachio sauce with crunchy pistachio bits for an extra textural touch.",
    price: 3500,
    image: "pistachio-dream.jpg",
    display_order: 6,
  },
];

async function upsertCategory() {
  const { error } = await sb.from("categories").upsert(CATEGORY, { onConflict: "slug" });
  if (error) throw new Error(`Category upsert failed: ${error.message}`);
  console.log(`✓ Category upserted: ${CATEGORY.slug}`);
}

async function ensureProduct(p) {
  const { data: existing, error: selErr } = await sb
    .from("products")
    .select("id")
    .eq("name_es", p.name_es)
    .eq("category", "salsas")
    .maybeSingle();
  if (selErr) throw new Error(`Lookup failed for ${p.name_es}: ${selErr.message}`);

  if (existing) {
    console.log(`= ${p.name_es} already exists (${existing.id})`);
    return existing.id;
  }

  const { data: ins, error: insErr } = await sb
    .from("products")
    .insert({
      name_es: p.name_es,
      name_en: p.name_en,
      description_es: p.description_es,
      description_en: p.description_en,
      price: p.price,
      category: "salsas",
      available: true,
      display_order: p.display_order,
    })
    .select("id")
    .single();
  if (insErr) throw new Error(`Insert failed for ${p.name_es}: ${insErr.message}`);
  console.log(`+ ${p.name_es} created (${ins.id})`);
  return ins.id;
}

async function attachImage(productId, fileName) {
  if (!fileName) return;
  const localPath = join(__dirname, "../public/images", fileName);
  let buf;
  try {
    buf = readFileSync(localPath);
  } catch {
    console.warn(`! image file missing: ${localPath} — skipping`);
    return;
  }

  const { data: existingImg } = await sb
    .from("product_images")
    .select("id")
    .eq("product_id", productId)
    .maybeSingle();
  if (existingImg) {
    console.log(`= image already linked for ${productId}`);
    return;
  }

  const storagePath = `products/${productId}/${fileName}`;
  const { error: upErr } = await sb.storage
    .from("product-images")
    .upload(storagePath, buf, {
      contentType: fileName.endsWith(".png") ? "image/png" : "image/jpeg",
      upsert: true,
    });
  if (upErr) {
    console.warn(`! upload failed for ${fileName}: ${upErr.message}`);
    return;
  }

  const { data: { publicUrl } } = sb.storage
    .from("product-images")
    .getPublicUrl(storagePath);

  const { error: linkErr } = await sb.from("product_images").insert({
    product_id: productId,
    url: publicUrl,
    display_order: 0,
  });
  if (linkErr) {
    console.warn(`! product_images insert failed: ${linkErr.message}`);
    return;
  }
  console.log(`✓ image linked → ${publicUrl}`);
}

async function main() {
  await upsertCategory();
  for (const p of PRODUCTS) {
    const id = await ensureProduct(p);
    await attachImage(id, p.image);
  }
  console.log("\n✨ Salsas seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
