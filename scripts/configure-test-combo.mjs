// One-shot helper to wire up a combo with cookie/salsa configurations so we
// can exercise the customer-facing configurator end-to-end. Idempotent.
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "../.env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const COMBO_NAME = "Galleta con helado ";

const { data: combo, error: comboErr } = await sb
  .from("products")
  .select("id, name_es")
  .eq("name_es", COMBO_NAME)
  .single();
if (comboErr || !combo) {
  console.error("Combo not found:", comboErr);
  process.exit(1);
}
console.log(`Configuring combo: ${combo.name_es} (${combo.id})`);

await sb.from("products").update({ includes_salsa: true }).eq("id", combo.id);

const { data: galletas } = await sb
  .from("products")
  .select("id, name_es, price")
  .eq("category", "galletas")
  .order("display_order")
  .limit(5);

const { data: salsas } = await sb
  .from("products")
  .select("id, name_es, price")
  .eq("category", "salsas")
  .order("display_order");

await sb.from("combo_cookies").delete().eq("combo_id", combo.id);
await sb.from("combo_salsas").delete().eq("combo_id", combo.id);

const cookieRows = galletas.map((g, i) => ({
  combo_id: combo.id,
  cookie_id: g.id,
  // Premium cookies (pistacho, lotus) get $3000 extra; rest are $0 — matches
  // the "+$3000 sabor premium" pattern from the menu.
  extra_price: /pistach|lotus/i.test(g.name_es) ? 3000 : 0,
  display_order: i,
}));

const salsaRows = salsas.map((s, i) => ({
  combo_id: combo.id,
  salsa_id: s.id,
  extra_price: s.price, // default to salsa's own price per spec
  display_order: i,
}));

const { error: ccErr } = await sb.from("combo_cookies").insert(cookieRows);
if (ccErr) throw ccErr;
console.log(`Inserted ${cookieRows.length} cookies:`);
console.log(cookieRows.map((r, i) => `  ${i + 1}. ${galletas[i].name_es} (+$${r.extra_price})`).join("\n"));

const { error: csErr } = await sb.from("combo_salsas").insert(salsaRows);
if (csErr) throw csErr;
console.log(`\nInserted ${salsaRows.length} salsas:`);
console.log(salsaRows.map((r, i) => `  ${i + 1}. ${salsas[i].name_es} (+$${r.extra_price})`).join("\n"));

console.log("\n✓ Combo configured. includes_salsa=true.");
