import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SeccionPendiente } from "@/components/sitio/SeccionPendiente";

import { metadatosDe } from "@/lib/metadatos";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return metadatosDe({
    href: "/blog",
    locale,
    descripcion: t("meta.blog"),
  });
}

export default async function Blog({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return <SeccionPendiente titulo={t("nav.blog")} ruta={`/${locale}/blog`} />;
}
