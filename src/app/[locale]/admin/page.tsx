import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Package, ShoppingBag, Plus } from "lucide-react";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  const [{ data: products }, { data: orders }] = await Promise.all([
    supabase
      .from("products")
      .select("*, product_images(*)")
      .order("display_order"),
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending: t("order_pending"),
    confirmed: t("order_confirmed"),
    delivered: t("order_delivered"),
    cancelled: t("order_cancelled"),
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black" style={{ color: "#8b0031" }}>
          {t("dashboard")}
        </h1>
        <Link
          href={`/${locale}/admin/productos/nuevo`}
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 text-sm"
          style={{ backgroundColor: "#8b0031" }}
        >
          <Plus className="w-4 h-4" />
          {t("new_product")}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <Package className="w-8 h-8 mx-auto mb-2" style={{ color: "#8b0031" }} />
          <div className="text-3xl font-black">{products?.length ?? 0}</div>
          <div className="text-gray-500 text-sm">{t("products")}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <ShoppingBag className="w-8 h-8 mx-auto mb-2" style={{ color: "#8b0031" }} />
          <div className="text-3xl font-black">{orders?.length ?? 0}</div>
          <div className="text-gray-500 text-sm">{t("orders")}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-black text-yellow-600">
            {orders?.filter(o => o.status === "pending").length ?? 0}
          </div>
          <div className="text-gray-500 text-sm">{t("order_pending")}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-black text-green-600">
            {orders?.filter(o => o.status === "delivered").length ?? 0}
          </div>
          <div className="text-gray-500 text-sm">{t("order_delivered")}</div>
        </div>
      </div>

      {/* Products section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t("products")}</h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {!products?.length ? (
            <div className="p-8 text-center text-gray-400">{t("no_products")}</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {p.product_images?.[0]?.url ? (
                      <img src={p.product_images[0].url} alt={p.name_es} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍪</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{p.name_es}</p>
                    <p className="text-gray-500 text-sm">${p.price.toLocaleString()} · {p.available ? "✅ Disponible" : "❌ Agotado"}</p>
                  </div>
                  <Link
                    href={`/${locale}/admin/productos/${p.id}/editar`}
                    className="text-sm font-semibold px-4 py-1.5 border rounded-full hover:bg-gray-100 transition-colors"
                    style={{ borderColor: "#8b0031", color: "#8b0031" }}
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orders section */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t("orders")}</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {!orders?.length ? (
            <div className="p-8 text-center text-gray-400">{t("no_orders")}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-6 py-3 font-semibold text-gray-600">ID</th>
                    <th className="px-6 py-3 font-semibold text-gray-600">Cliente</th>
                    <th className="px-6 py-3 font-semibold text-gray-600">Total</th>
                    <th className="px-6 py-3 font-semibold text-gray-600">Estado</th>
                    <th className="px-6 py-3 font-semibold text-gray-600">Fecha</th>
                    <th className="px-6 py-3 font-semibold text-gray-600">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-gray-400 text-xs">{order.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 font-bold">${order.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline client component for status updates
function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  // This needs to be client-side, we'll handle it via a separate component
  return (
    <span className="text-xs text-gray-400 italic">—</span>
  );
}
