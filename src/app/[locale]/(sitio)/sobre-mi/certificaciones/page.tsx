import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SeccionPendiente } from "@/components/sitio/SeccionPendiente";

import { metadatosDe } from "@/lib/metadatos";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return metadatosDe({
    href: "/sobre-mi/certificaciones",
    locale,
    descripcion: t("meta.certificaciones"),
  });
}

export default async function Certificaciones({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SeccionPendiente
      titulo={locale === "es" ? "Certificaciones" : "Certifications"}
      ruta={
        locale === "es"
          ? "/es/sobre-mi/certificaciones"
          : "/en/about/certifications"
      }
    />
  );
}
