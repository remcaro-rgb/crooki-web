// Removes the ZZTEST fixtures created by setup-e2e-test-data.mjs.
// product child rows (box_cookies / combo_salsas / product_images) cascade.
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const { data: products, error: pErr } = await supabase
  .from("products")
  .delete()
  .like("name_es", "ZZTEST%")
  .select("id, name_es");
if (pErr) console.error("products delete:", pErr);
else console.log("deleted products:", products.map((p) => p.name_es));

const { data: cats, error: cErr } = await supabase
  .from("categories")
  .delete()
  .like("slug", "zztest%")
  .select("slug");
if (cErr) console.error("categories delete:", cErr);
else console.log("deleted categories:", cats.map((c) => c.slug));
