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
import { Link } from "@/i18n/navigation";
import { metadatosDe } from "@/lib/metadatos";
import { obtenerProyecto, slugsDeProyectos } from "@/lib/proyectos";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await slugsDeProyectos();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const proyecto = await obtenerProyecto(locale, slug);
  if (!proyecto) return {};

  return metadatosDe({
    href: { pathname: "/proyectos/[slug]", params: { slug } },
    locale,
    titulo: proyecto.titulo,
    descripcion: proyecto.resumen,
  });
}

export default async function Caso({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const proyecto = await obtenerProyecto(locale, slug);
  if (!proyecto) notFound();

  return (
    <div className="mx-auto max-w-[920px] px-2 pb-16">
      <Hoja>
        <div className="flex flex-col gap-canal">
          {/* Portada del caso */}
          <Panel
            forma={corteAbajo(7)}
            trama="lineas"
            className="relative flex min-h-[220px] flex-col justify-end p-6 sm:min-h-[260px] sm:p-8"
          >
            <CajaNarracion className="absolute top-5 left-5 sm:top-6 sm:left-6">
              {proyecto.periodo}
            </CajaNarracion>

            <h1 className="w-fit bg-tinta px-4 py-2 font-display text-4xl text-papel leading-none sm:text-5xl">
              {proyecto.titulo}
            </h1>
            <p className="mt-2 w-fit border-[3px] border-tinta bg-papel px-3 py-1.5 font-bold text-sm sm:text-base">
              {proyecto.subtitulo}
            </p>
          </Panel>

          {/* Ficha técnica */}
          <Panel className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
            <ul className="flex flex-wrap gap-2">
              {proyecto.stack.map((pieza) => (
                <li
                  key={pieza}
                  className="border-2 border-tinta px-2.5 py-1 font-bold text-xs"
                >
                  {pieza}
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 flex-wrap gap-3">
              {proyecto.enlace ? (
                <a
                  href={proyecto.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-[3px] border-tinta bg-papel px-4 py-2 font-bold text-sm transition-colors hover:bg-lima"
                >
                  {t("proyectos.verEnVivo")} ↗
                </a>
              ) : null}
              {proyecto.repo ? (
                <a
                  href={proyecto.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-[3px] border-tinta bg-papel px-4 py-2 font-bold text-sm transition-colors hover:bg-lima"
                >
                  {t("proyectos.codigo")} ↗
                </a>
              ) : null}
            </div>
          </Panel>

          {/* El caso, en sus cuatro partes */}
          <Panel as="article" className="p-6 sm:p-10">
            {proyecto.traducido ? null : (
              <CajaNarracion variante="narracion" className="mb-8 block">
                {t("proyectos.sinTraducir")}
              </CajaNarracion>
            )}
            <MDXRemote
              source={proyecto.contenido}
              components={componentesMdx}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </Panel>

          <Panel fondo="tinta" className="p-6 sm:p-8">
            <Link
              href="/proyectos"
              className="font-display text-lg text-papel transition-colors hover:text-lima"
            >
              ← {t("proyectos.todos")}
            </Link>
          </Panel>
        </div>
      </Hoja>
    </div>
  );
}
