export type Locale = "es" | "en";

export type Category =
  | "galletas"
  | "cajas"
  | "helados"
  | "especiales"
  | "salados"
  | "malteadas"
  | "bebidas-frias"
  | "bebidas-calientes";

export const CATEGORY_ORDER: Category[] = [
  "galletas",
  "cajas",
  "helados",
  "especiales",
  "salados",
  "malteadas",
  "bebidas-frias",
  "bebidas-calientes",
];

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
  category: Category;
  available: boolean;
  display_order: number;
  created_at: string;
  product_images: ProductImage[];
}

export interface CartItem {
  product: Product;
  quantity: number;
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
