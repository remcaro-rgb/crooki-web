import { getTranslations } from "next-intl/server";
import CheckoutClient from "@/components/order/CheckoutClient";

export default async function PedidoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <CheckoutClient locale={locale} />;
}
