export type Locale = "es" | "en";

export type CategoryKind = "menu" | "merch";

// Kept as string so admin-created categories work without a TS change.
// The seeded menu order below only controls the legacy mock fallback.
export type Category = string;

export const CATEGORY_ORDER: string[] = [
  "galletas",
  "cajas",
  "helados",
  "especiales",
  "salados",
  "malteadas",
  "bebidas-frias",
  "bebidas-calientes",
];

export interface CategoryRow {
  slug: string;
  label_es: string;
  label_en: string;
  kind: CategoryKind;
  display_order: number;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  display_order: number;
}

export interface Product {
  id: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  price: number;
  category: string;
  available: boolean;
  display_order: number;
  created_at: string;
  product_images: ProductImage[];
  // Combo-specific fields. `includes_salsa` is meaningful only for combos.
  // The two arrays are populated when the combo product is loaded with its
  // configuration; they're optional everywhere else.
  includes_salsa?: boolean;
  combo_cookies?: ComboCookieRow[];
  combo_salsas?: ComboSalsaRow[];
}

export interface ComboCookieRow {
  id: string;
  combo_id: string;
  cookie_id: string;
  extra_price: number;
  display_order: number;
}

export interface ComboSalsaRow {
  id: string;
  combo_id: string;
  salsa_id: string;
  extra_price: number;
  display_order: number;
}

// Customer's combo configuration captured in the cart.
export interface ComboSelection {
  cookieId: string;
  cookieName: string;
  cookieExtra: number;
  includedSalsaId?: string;
  includedSalsaName?: string;
  additionalSalsas: Array<{
    salsaId: string;
    salsaName: string;
    quantity: number;
    extraPrice: number;
  }>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  // Stable identifier — required for combos so two same-product cart lines with
  // different selections don't collapse. For non-combo products this equals
  // `product.id`.
  lineId: string;
  combo?: ComboSelection;
  // Per-unit price including all customization extras. Falls back to
  // `product.price` if absent.
  unitPrice?: number;
}

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  notes: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items: OrderItem[];
}
