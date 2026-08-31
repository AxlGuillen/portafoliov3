import { getTranslations, setRequestLocale } from "next-intl/server";
import { SeccionPendiente } from "@/components/sitio/SeccionPendiente";

type Props = { params: Promise<{ locale: string }> };

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
