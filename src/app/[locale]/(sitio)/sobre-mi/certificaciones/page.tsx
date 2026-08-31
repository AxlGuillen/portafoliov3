import { setRequestLocale } from "next-intl/server";
import { SeccionPendiente } from "@/components/sitio/SeccionPendiente";

type Props = { params: Promise<{ locale: string }> };

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
