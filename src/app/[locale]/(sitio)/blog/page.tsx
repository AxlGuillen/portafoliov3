import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CajaNarracion } from "@/components/manga/CajaNarracion";
import { corteAbajo, corteArriba } from "@/components/manga/formas";
import { Hoja } from "@/components/manga/Hoja";
import { Panel } from "@/components/manga/Panel";
import { Pagina } from "@/components/sitio/Pagina";
import { Link } from "@/i18n/navigation";
import { listarArticulos } from "@/lib/blog";
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
  const articulos = await listarArticulos(locale);

  const fecha = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Pagina>
      <div className="mx-auto max-w-[920px] px-2 pb-16">
        <Hoja>
          <div className="flex flex-col gap-canal">
            <Panel
              trama="lineas"
              className="relative flex min-h-[150px] flex-col justify-end p-6 sm:min-h-[180px] sm:p-8"
            >
              <CajaNarracion className="absolute top-5 left-5 sm:top-6 sm:left-6">
                {t("nav.blog")}
              </CajaNarracion>
              <h1 className="w-fit bg-tinta px-4 py-2 font-display text-4xl text-papel leading-none sm:text-5xl">
                {t("blog.titulo")}
              </h1>
              <p className="mt-2 w-fit border-[3px] border-tinta bg-papel px-3 py-1.5 font-hand text-base">
                {t("blog.cuantos", { total: articulos.length })}
              </p>
            </Panel>

            {articulos.map((articulo, indice) => (
              <Link
                key={articulo.slug}
                href={{
                  pathname: "/blog/[slug]",
                  params: { slug: articulo.slug },
                }}
                className="group block"
              >
                <Panel
                  forma={
                    indice % 2 === 0
                      ? corteAbajo(5)
                      : corteArriba(5, "izquierda")
                  }
                  trama={indice % 2 === 0 ? undefined : "puntos"}
                  className="flex flex-col gap-2 p-6 transition-colors group-hover:bg-lima sm:p-8"
                >
                  <p className="font-bold text-[11px] uppercase tracking-[0.12em]">
                    {fecha.format(new Date(articulo.fecha))} ·{" "}
                    {t("blog.minutos", { minutos: articulo.minutos })}
                  </p>
                  <p className="max-w-[24ch] font-display text-2xl leading-tight sm:max-w-none sm:text-3xl">
                    {articulo.titulo}
                  </p>
                  <p className="max-w-[62ch] text-sm leading-relaxed sm:text-base">
                    {articulo.resumen}
                  </p>
                  <span className="mt-1 font-bold text-sm underline-offset-4 group-hover:underline">
                    {t("inicio.leer")} →
                  </span>
                </Panel>
              </Link>
            ))}
          </div>
        </Hoja>
      </div>
    </Pagina>
  );
}
