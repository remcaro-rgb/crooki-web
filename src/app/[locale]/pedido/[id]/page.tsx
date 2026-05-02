import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Package, ArrowLeft, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "573027190084"; // Número de Crooki sin + ni espacios

function buildWhatsAppMessage(order: {
  id: string;
  customer_name: string;
  customer_address: string;
  notes: string;
  total: number;
  order_items: { product_name: string; quantity: number; unit_price: number }[];
}) {
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

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "confirmation" });
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const whatsappUrl = buildWhatsAppMessage(order);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-lg w-full text-center">

        {/* Ícono de éxito */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: "#8b003115" }}
        >
          <CheckCircle2 className="w-14 h-14" style={{ color: "#8b0031" }} />
        </div>

        {/* Título */}
        <h1 className="text-4xl font-black mb-3" style={{ color: "#8b0031" }}>
          {t("title")}
        </h1>
        <p className="text-gray-600 text-lg mb-2">{t("subtitle")}</p>
        <p className="text-gray-400 text-sm mb-8">
          {t("order_number")}:{" "}
          <span className="font-mono font-bold text-gray-700">
            {order.id.slice(0, 8).toUpperCase()}
          </span>
        </p>

        {/* Resumen del pedido */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5" style={{ color: "#8b0031" }} />
            <h2 className="font-bold">Resumen</h2>
          </div>
          <div className="space-y-2 mb-4">
            {order.order_items.map(
              (item: {
                id: string;
                product_name: string;
                quantity: number;
                unit_price: number;
              }) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product_name}{" "}
                    <span className="text-gray-400">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold">
                    ${(item.unit_price * item.quantity).toLocaleString("es-CO")}
                  </span>
                </div>
              )
            )}
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-black text-xl" style={{ color: "#8b0031" }}>
              ${order.total.toLocaleString("es-CO")}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t text-sm text-gray-500 space-y-1">
            <p>
              <strong>Cliente:</strong> {order.customer_name}
            </p>
            <p>
              <strong>Dirección:</strong> {order.customer_address}
            </p>
            {order.notes && (
              <p>
                <strong>Notas:</strong> {order.notes}
              </p>
            )}
          </div>
        </div>

        {/* Aviso WhatsApp */}
        <div
          className="rounded-2xl p-4 mb-6 text-sm text-left"
          style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
        >
          <p className="font-semibold text-green-800 mb-1">
            📱 Confirma tu pedido por WhatsApp
          </p>
          <p className="text-green-700">
            Toca el botón de abajo para enviarnos tu pedido por WhatsApp. Lo
            procesaremos de inmediato y te confirmamos el tiempo de entrega.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 text-white font-bold py-4 rounded-full transition-opacity hover:opacity-90 text-lg"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-5 h-5" />
            {t("whatsapp_confirm")}
          </a>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 font-semibold py-4 rounded-full border transition-colors hover:bg-gray-50 text-sm"
            style={{ borderColor: "#8b0031", color: "#8b0031" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
