import { requireAdmin } from "@/lib/admin-auth";
import CategoryFormClient from "@/components/admin/CategoryFormClient";

export default async function NewCategoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdmin(locale);
  return <CategoryFormClient locale={locale} mode="create" />;
}
