-- Add product category column
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'galletas'
    CHECK (category IN (
      'galletas',
      'cajas',
      'helados',
      'especiales',
      'salados',
      'malteadas',
      'bebidas-frias',
      'bebidas-calientes'
    ));

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
