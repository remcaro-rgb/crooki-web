import { getTranslations } from "next-intl/server";
import AdminLoginClient from "@/components/admin/AdminLoginClient";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AdminLoginClient locale={locale} />;
}
