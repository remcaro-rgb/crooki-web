-- Combos feature: per-combo cookie & salsa whitelists with optional extra prices.
--
-- A "combo" is a `products` row in category 'combos'. The two junction tables
-- below describe what cookies the customer may pick (one) and what salsas the
-- customer may add (one included if includes_salsa, plus zero+ extra).

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS includes_salsa BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS combo_cookies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cookie_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  extra_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (combo_id, cookie_id)
);

CREATE TABLE IF NOT EXISTS combo_salsas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  salsa_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  extra_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (combo_id, salsa_id)
);

CREATE INDEX IF NOT EXISTS idx_combo_cookies_combo ON combo_cookies(combo_id);
CREATE INDEX IF NOT EXISTS idx_combo_salsas_combo ON combo_salsas(combo_id);

ALTER TABLE combo_cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_salsas  ENABLE ROW LEVEL SECURITY;

-- Public read so the menu page can fetch combo configurations.
DROP POLICY IF EXISTS "combo_cookies public read" ON combo_cookies;
CREATE POLICY "combo_cookies public read" ON combo_cookies
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "combo_cookies authenticated write" ON combo_cookies;
CREATE POLICY "combo_cookies authenticated write" ON combo_cookies
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "combo_salsas public read" ON combo_salsas;
CREATE POLICY "combo_salsas public read" ON combo_salsas
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "combo_salsas authenticated write" ON combo_salsas;
CREATE POLICY "combo_salsas authenticated write" ON combo_salsas
  FOR ALL USING (auth.role() = 'authenticated');
