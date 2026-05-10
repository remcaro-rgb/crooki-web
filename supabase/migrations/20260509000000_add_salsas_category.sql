-- Add "Salsas" menu category and seed 6 salsa products.
-- Display order 5 sits between Brownies/Combos (4) and Malteadas (6).
-- Unit price is $3.500 (matches existing helado salsa add-on price).

INSERT INTO categories (slug, label_es, label_en, kind, display_order)
VALUES ('salsas', 'Salsas', 'Sauces', 'menu', 5)
ON CONFLICT (slug) DO UPDATE
  SET label_es = EXCLUDED.label_es,
      label_en = EXCLUDED.label_en,
      kind = EXCLUDED.kind,
      display_order = EXCLUDED.display_order;

INSERT INTO products (name_es, name_en, description_es, description_en, price, category, available, display_order)
VALUES
  ('Salsa de pistacho', 'Pistachio sauce',
   'Salsa cremosa de pistacho, perfecta para acompañar helado, galletas o malteadas.',
   'Creamy pistachio sauce, perfect to top ice cream, cookies or milkshakes.',
   3500, 'salsas', true, 1),

  ('Salsa de Lotus', 'Lotus sauce',
   'Salsa de Lotus Biscoff con su inconfundible sabor a galleta caramelizada.',
   'Lotus Biscoff sauce with its signature caramelized cookie flavor.',
   3500, 'salsas', true, 2),

  ('Salsa de Kínder', 'Kinder sauce',
   'Salsa cremosa inspirada en el chocolate Kínder, suave y dulce.',
   'Creamy sauce inspired by Kinder chocolate, smooth and sweet.',
   3500, 'salsas', true, 3),

  ('Salsa de Milo crunch', 'Milo crunch sauce',
   'Salsa de Milo con trocitos crunchy para una experiencia chocolatada con textura.',
   'Milo sauce with crunchy bits for a chocolaty experience with texture.',
   3500, 'salsas', true, 4),

  ('Salsa de Nutella', 'Nutella sauce',
   'Clásica salsa de Nutella, avellana y chocolate en su mejor versión.',
   'Classic Nutella sauce — hazelnut and chocolate at their best.',
   3500, 'salsas', true, 5),

  ('Salsa pistacho crunchy', 'Crunchy pistachio sauce',
   'Salsa de pistacho con trocitos crunchy de pistacho para un toque extra de textura.',
   'Pistachio sauce with crunchy pistachio bits for an extra textural touch.',
   3500, 'salsas', true, 6);
