import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SeccionPendiente } from "@/components/sitio/SeccionPendiente";

import { metadatosDe } from "@/lib/metadatos";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return metadatosDe({
    href: "/contacto",
    locale,
    descripcion: t("meta.contacto"),
  });
}

export default async function Contacto({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <SeccionPendiente
      titulo={t("nav.contacto")}
      ruta={locale === "es" ? "/es/contacto" : "/en/contact"}
      color
    />
  );
}
