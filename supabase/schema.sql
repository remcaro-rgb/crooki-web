-- Crooki Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT '',
  description_es TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'galletas'
    CHECK (category IN (
      'galletas',
      'cajas',
      'helados',
      'especiales',
      'salados',
      'malteadas',
      'bebidas-frias',
      'bebidas-calientes'
    )),
  available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  notes TEXT DEFAULT '',
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  product_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: public read, authenticated write
CREATE POLICY "Products public read" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products authenticated write" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Product images: public read, authenticated write
CREATE POLICY "Product images public read" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Product images authenticated write" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');

-- Orders: authenticated can read all, anyone can insert
CREATE POLICY "Orders insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders authenticated read" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Orders authenticated update" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Order items: anyone can insert (part of order creation), authenticated can read
CREATE POLICY "Order items insert" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Order items authenticated read" ON order_items
  FOR SELECT USING (auth.role() = 'authenticated');

-- Storage bucket for product images
-- Run this AFTER creating the bucket named 'product-images' in Supabase dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies (run after bucket creation)
-- Allow public read
CREATE POLICY "Product images storage public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Product images storage authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Product images storage authenticated delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Seed data: Initial products
INSERT INTO products (name_es, name_en, description_es, description_en, price, available, display_order)
VALUES
  ('Caramelo Salado', 'Salted Caramel',
   'Galleta de masa suave con un irresistible relleno de caramelo salado y trocitos de sal marina. Una explosión de sabores dulces y salados en cada mordida.',
   'Soft dough cookie with an irresistible salted caramel filling and sea salt flakes. An explosion of sweet and salty flavors in every bite.',
   1800, true, 1),

  ('Pistachio Dream', 'Pistachio Dream',
   'Galleta con masa de pistacho y relleno de crema de pistacho. El sabor más sofisticado de nuestra colección, con textura cremosa y un toque verde natural.',
   'Pistachio dough cookie with pistachio cream filling. The most sophisticated flavor in our collection, with a creamy texture and natural green hue.',
   2000, true, 2),

  ('Lotus Biscoff', 'Lotus Biscoff',
   'Galleta con masa de Biscoff y relleno de crema Lotus. Para los fanáticos de esta icónica galleta belga, ahora en versión jumbo y artesanal.',
   'Biscoff dough cookie with Lotus cream filling. For fans of this iconic Belgian cookie, now in jumbo artisan version.',
   1900, true, 3),

  ('Milo Bomb', 'Milo Bomb',
   'Galleta de chocolate con fudge de Milo. Una bomba de sabor chocolatado con la infaltable milo de tu infancia. Reconfortante y adictiva.',
   'Chocolate cookie with Milo fudge. A chocolate flavor bomb with the nostalgic Milo from your childhood. Comforting and addictive.',
   1800, true, 4),

  ('Red Nutella', 'Red Nutella',
   'Galleta de masa roja de terciopelo con corazón de Nutella. El contraste perfecto entre la masa de red velvet y el relleno de avellanas y chocolate.',
   'Red velvet dough cookie with Nutella heart. The perfect contrast between red velvet dough and hazelnut chocolate filling.',
   1900, true, 5),

  ('Lemon Bliss', 'Lemon Bliss',
   'Galleta cítrica de limón con crema de limón y ralladura fresca. Fresca, vibrante y equilibrada. El sabor más refrescante de nuestra colección.',
   'Citrus lemon cookie with lemon cream and fresh zest. Fresh, vibrant and balanced. The most refreshing flavor in our collection.',
   1700, true, 6),

  ('Red Velvet Cookies and Cream', 'Red Velvet Cookies and Cream',
   'Galleta de red velvet con relleno de crema Oreo y cookies trituradas. Una combinación irresistible de texturas y sabores que te dejará queriendo más.',
   'Red velvet cookie with Oreo cream filling and crushed cookies. An irresistible combination of textures and flavors that will leave you wanting more.',
   1900, true, 7),

  ('Oreo Cookies and Cream', 'Oreo Cookies and Cream',
   'Galleta de chocolate con crema de Oreo y trocitos de Oreo en la masa. El sabor clásico favorito de todos en versión galleta artesanal gigante.',
   'Chocolate cookie with Oreo cream and Oreo chunks in the dough. Everyone''s classic favorite flavor in a giant artisan cookie version.',
   1800, true, 8),

  ('Chocolate Chips', 'Chocolate Chips',
   'La clásica galleta de chips de chocolate en su máxima expresión. Masa suave por dentro, levemente crujiente por fuera, con chips de chocolate de primera calidad.',
   'The classic chocolate chip cookie at its finest. Soft inside, slightly crispy outside, with premium quality chocolate chips.',
   1600, true, 9),

  ('Klim Brigadeiro', 'Klim Brigadeiro',
   'Galleta inspirada en el brigadeiro brasileño con leche Klim. Dulce, cremosa e irresistiblemente adictiva. El sabor latinoamericano que todos amamos.',
   'Cookie inspired by the Brazilian brigadeiro with Klim milk powder. Sweet, creamy and irresistibly addictive. The Latin American flavor we all love.',
   1900, true, 10);

-- Link product images to local files (these will need to be uploaded to Supabase Storage)
-- After uploading to Supabase Storage, update the URLs accordingly.
-- For now, products are created without images - upload via admin panel.
