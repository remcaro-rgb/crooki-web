-- Cajas de galletas feature: per-box configuration of how many cookies the
-- customer must pick, which cookies are eligible (with optional extras), and
-- two optional add-ons (gift card; gift card + birthday cake).

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS box_cookie_count INT NOT NULL DEFAULT 2
    CHECK (box_cookie_count >= 2),
  ADD COLUMN IF NOT EXISTS gift_card_price NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS gift_card_cake_price NUMERIC(10, 2);

CREATE TABLE IF NOT EXISTS box_cookies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cookie_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  extra_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (box_id, cookie_id)
);

CREATE INDEX IF NOT EXISTS idx_box_cookies_box ON box_cookies(box_id);

ALTER TABLE box_cookies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "box_cookies public read" ON box_cookies;
CREATE POLICY "box_cookies public read" ON box_cookies
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "box_cookies authenticated write" ON box_cookies;
CREATE POLICY "box_cookies authenticated write" ON box_cookies
  FOR ALL USING (auth.role() = 'authenticated');
