import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { CajaNarracion } from "@/components/manga/CajaNarracion";
import { corteAbajo } from "@/components/manga/formas";
import { Hoja } from "@/components/manga/Hoja";
import { Panel } from "@/components/manga/Panel";
import { componentesMdx } from "@/components/mdx/componentes";
import { Pagina } from "@/components/sitio/Pagina";
import { Link } from "@/i18n/navigation";
import { obtenerArticulo, slugsDeArticulos } from "@/lib/blog";
import { metadatosDe } from "@/lib/metadatos";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await slugsDeArticulos();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const articulo = await obtenerArticulo(locale, slug);
  if (!articulo) return {};

  return metadatosDe({
    href: { pathname: "/blog/[slug]", params: { slug } },
    locale,
    titulo: articulo.titulo,
    descripcion: articulo.resumen,
  });
}

export default async function Articulo({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const articulo = await obtenerArticulo(locale, slug);
  if (!articulo) notFound();

  const fecha = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(articulo.fecha));

  return (
    <Pagina>
      <div className="mx-auto max-w-[920px] px-2 pb-16">
        <Hoja>
          <div className="flex flex-col gap-canal">
            <Panel
              forma={corteAbajo(6)}
              trama="lineas"
              className="relative flex min-h-[200px] flex-col justify-end p-6 sm:min-h-[240px] sm:p-8"
            >
              <CajaNarracion className="absolute top-5 left-5 sm:top-6 sm:left-6">
                {fecha} · {t("blog.minutos", { minutos: articulo.minutos })}
              </CajaNarracion>

              <h1 className="w-fit max-w-[22ch] bg-tinta px-4 py-2 font-display text-3xl text-papel leading-tight sm:text-4xl">
                {articulo.titulo}
              </h1>
            </Panel>

            <Panel as="article" className="p-6 sm:p-10">
              {articulo.traducido ? null : (
                <CajaNarracion variante="narracion" className="mb-8 block">
                  {t("blog.sinTraducir")}
                </CajaNarracion>
              )}
              <p className="mb-8 max-w-[62ch] border-tinta border-l-[5px] pl-5 font-hand text-lg leading-relaxed">
                {articulo.resumen}
              </p>
              <MDXRemote
                source={articulo.contenido}
                components={componentesMdx}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            </Panel>

            <Panel fondo="tinta" className="p-6 sm:p-8">
              <Link
                href="/blog"
                className="font-display text-lg text-papel transition-colors hover:text-lima"
              >
                ← {t("blog.todos")}
              </Link>
            </Panel>
          </div>
        </Hoja>
      </div>
    </Pagina>
  );
}
