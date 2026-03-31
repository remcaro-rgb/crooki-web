import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Package, ArrowLeft } from "lucide-react";

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: "#8b003115" }}
        >
          <CheckCircle2 className="w-14 h-14" style={{ color: "#8b0031" }} />
        </div>

        {/* Title */}
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

        {/* Order details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-8">
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
                    {item.product_name} x{item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${(item.unit_price * item.quantity).toLocaleString()}
                  </span>
                </div>
              )
            )}
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-black text-xl" style={{ color: "#8b0031" }}>
              ${order.total.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t text-sm text-gray-500 space-y-1">
            <p>
              <strong>Cliente:</strong> {order.customer_name}
            </p>
            <p>
              <strong>Dirección:</strong> {order.customer_address}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-white font-bold py-4 rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#8b0031" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
