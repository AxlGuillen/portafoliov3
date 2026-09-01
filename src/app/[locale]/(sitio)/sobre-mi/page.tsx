import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SeccionPendiente } from "@/components/sitio/SeccionPendiente";

import { metadatosDe } from "@/lib/metadatos";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return metadatosDe({
    href: "/sobre-mi",
    locale,
    descripcion: t("meta.sobreMi"),
  });
}

export default async function SobreMi({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <SeccionPendiente
      titulo={t("nav.sobreMi")}
      ruta={locale === "es" ? "/es/sobre-mi" : "/en/about"}
    />
  );
}
