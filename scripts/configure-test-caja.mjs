// One-shot helper: configure "Caja 3 galletas" with eligible cookies + gift
// card prices so we can exercise the BoxConfigurator end-to-end. Idempotent.
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

const CAJA_NAME = "Caja 3 galletas "; // trailing space matches prod data

const { data: caja, error: cajaErr } = await sb
  .from("products")
  .select("id, name_es")
  .eq("name_es", CAJA_NAME)
  .maybeSingle();

if (cajaErr || !caja) {
  console.error(`${CAJA_NAME} not found.`, cajaErr);
  console.log("Available cajas:");
  const { data } = await sb.from("products").select("name_es").eq("category", "cajas");
  console.log(data);
  process.exit(1);
}
console.log(`Configuring caja: ${caja.name_es} (${caja.id})`);

// Set capacity = 3 (matches the product name) + gift card prices
await sb
  .from("products")
  .update({
    box_cookie_count: 3,
    gift_card_price: 5000,
    gift_card_cake_price: 35000,
  })
  .eq("id", caja.id);

const { data: galletas } = await sb
  .from("products")
  .select("id, name_es, price")
  .eq("category", "galletas")
  .order("display_order")
  .limit(6);

await sb.from("box_cookies").delete().eq("box_id", caja.id);

const rows = galletas.map((g, i) => ({
  box_id: caja.id,
  cookie_id: g.id,
  // Premium cookies (pistacho, lotus) get $3000 extra; rest are $0.
  extra_price: /pistach|lotus/i.test(g.name_es) ? 3000 : 0,
  display_order: i,
}));

const { error: bcErr } = await sb.from("box_cookies").insert(rows);
if (bcErr) throw bcErr;

console.log(`box_cookie_count: 3`);
console.log(`gift_card_price: $5000  |  gift_card_cake_price: $35000`);
console.log(`\nInserted ${rows.length} cookies:`);
console.log(rows.map((r, i) => `  ${i + 1}. ${galletas[i].name_es} (+$${r.extra_price})`).join("\n"));
console.log("\n✓ Caja configured.");
