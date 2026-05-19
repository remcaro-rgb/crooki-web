export const WHATSAPP_NUMBER = "573027190084";

export interface WhatsAppOrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface WhatsAppOrder {
  id: string;
  customer_name: string;
  customer_address: string;
  notes: string | null;
  total: number;
  order_items: WhatsAppOrderItem[];
}

export function buildWhatsAppOrderUrl(order: WhatsAppOrder): string {
  const orderId = order.id.slice(0, 8).toUpperCase();

  const itemLines = order.order_items
    .map(
      (item) =>
        `  • ${item.product_name} x${item.quantity} — $${(item.unit_price * item.quantity).toLocaleString("es-CO")}`
    )
    .join("\n");

  const message = [
    `🍪 *Nuevo pedido Crooki*`,
    ``,
    `*Pedido #${orderId}*`,
    ``,
    `*Productos:*`,
    itemLines,
    ``,
    `*Total: $${order.total.toLocaleString("es-CO")}*`,
    ``,
    `*Cliente:* ${order.customer_name}`,
    `*Dirección:* ${order.customer_address}`,
    order.notes ? `*Notas:* ${order.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
