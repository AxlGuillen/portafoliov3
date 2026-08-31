import { getTranslations, setRequestLocale } from "next-intl/server";
import { SeccionPendiente } from "@/components/sitio/SeccionPendiente";

type Props = { params: Promise<{ locale: string }> };

export default async function Blog({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return <SeccionPendiente titulo={t("nav.blog")} ruta={`/${locale}/blog`} />;
}
