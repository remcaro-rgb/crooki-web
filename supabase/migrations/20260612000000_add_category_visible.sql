-- Category visibility: admins can hide a whole category from the customer
-- pages (menu / merch / home featured) without deleting it. Hidden categories
-- and their products stay fully editable in the admin panel.

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS visible BOOLEAN NOT NULL DEFAULT true;
