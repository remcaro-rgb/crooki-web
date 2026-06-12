// Temporary E2E fixtures for the 2026-06-12 feature batch. Creates clearly
// marked ZZTEST rows in the production DB; remove with cleanup-e2e-test-data.mjs.
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const die = (msg, error) => {
  console.error(msg, error);
  process.exit(1);
};

// Reference cookies + salsas to attach to the fixtures.
const { data: galletas, error: gErr } = await supabase
  .from("products")
  .select("id, name_es")
  .eq("category", "galletas")
  .order("display_order")
  .limit(1);
if (gErr || !galletas?.length) die("no galletas", gErr);

const { data: salsas, error: sErr } = await supabase
  .from("products")
  .select("id, name_es, price")
  .eq("category", "salsas")
  .order("display_order")
  .limit(2);
if (sErr || salsas?.length < 2) die("need 2 salsas", sErr);

// 1. Trivial caja: one eligible cookie, no gift cards → "+ Agregar" path.
const { data: caja, error: cajaErr } = await supabase
  .from("products")
  .insert({
    name_es: "ZZTEST Caja Sencilla",
    name_en: "ZZTEST Simple Box",
    description_es: "Producto temporal de prueba",
    description_en: "Temporary test product",
    price: 10000,
    category: "cajas",
    available: true,
    display_order: 999,
    box_cookie_count: 4,
    gift_card_price: null,
    gift_card_cake_price: null,
  })
  .select()
  .single();
if (cajaErr) die("caja insert", cajaErr);

const { error: bcErr } = await supabase.from("box_cookies").insert({
  box_id: caja.id,
  cookie_id: galletas[0].id,
  extra_price: 500,
  display_order: 0,
});
if (bcErr) die("box_cookies insert", bcErr);

// 2. Helado with two configured salsas → customer salsa picker path.
const { data: helado, error: hErr } = await supabase
  .from("products")
  .insert({
    name_es: "ZZTEST Helado",
    name_en: "ZZTEST Ice Cream",
    description_es: "Producto temporal de prueba",
    description_en: "Temporary test product",
    price: 12000,
    category: "helados",
    available: true,
    display_order: 999,
  })
  .select()
  .single();
if (hErr) die("helado insert", hErr);

const { error: hsErr } = await supabase.from("combo_salsas").insert(
  salsas.map((s, i) => ({
    combo_id: helado.id,
    salsa_id: s.id,
    extra_price: 3500,
    display_order: i,
  })),
);
if (hsErr) die("helado salsas insert", hsErr);

// 3. Test category for the visibility toggle.
const { error: catErr } = await supabase.from("categories").insert({
  slug: "zztest-categoria",
  label_es: "ZZTEST Categoría",
  label_en: "ZZTEST Category",
  kind: "menu",
  display_order: 999,
  visible: true,
});
if (catErr) die("category insert", catErr);

const { data: catProd, error: cpErr } = await supabase
  .from("products")
  .insert({
    name_es: "ZZTEST Producto Categoría",
    name_en: "ZZTEST Category Product",
    description_es: "Producto temporal de prueba",
    description_en: "Temporary test product",
    price: 5000,
    category: "zztest-categoria",
    available: true,
    display_order: 0,
  })
  .select()
  .single();
if (cpErr) die("category product insert", cpErr);

// Reference info for the test run: an existing combo with includes_salsa.
const { data: combos } = await supabase
  .from("products")
  .select("id, name_es, includes_salsa")
  .eq("category", "combos");

console.log(
  JSON.stringify(
    {
      cajaId: caja.id,
      heladoId: helado.id,
      catProductId: catProd.id,
      cookie: galletas[0],
      salsas,
      combos,
    },
    null,
    2,
  ),
);
