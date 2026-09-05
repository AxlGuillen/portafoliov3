import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Arte } from "@/components/manga/Arte";
import { CajaNarracion } from "@/components/manga/CajaNarracion";
import { corteAbajo, costura } from "@/components/manga/formas";
import { Hoja } from "@/components/manga/Hoja";
import { Panel } from "@/components/manga/Panel";
import { componentesMdx } from "@/components/mdx/componentes";
import { Pagina } from "@/components/sitio/Pagina";
import { metadatosDe } from "@/lib/metadatos";
import { obtenerPerfil } from "@/lib/perfil";

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

  const perfil = await obtenerPerfil(locale);
  if (!perfil) notFound();

  const [retrato, cifras] = costura(8);

  return (
    <Pagina>
      <div className="mx-auto max-w-[920px] px-2 pb-16">
        <Hoja>
          <div className="flex flex-col gap-canal">
            {/* Portada: el escritorio, con la identidad encima */}
            <Panel
              forma={retrato}
              className="flex min-h-[320px] flex-col justify-end p-6 sm:min-h-[400px] sm:p-8"
            >
              <Arte
                src="/vinetas/inicio-sobre-mi.avif"
                alt={t("sobreMi.arte")}
                posicion="center 45%"
                prioridad
              />

              <CajaNarracion className="absolute top-5 left-5 sm:top-6 sm:left-6">
                {perfil.rol}
              </CajaNarracion>

              <h1 className="w-fit bg-tinta px-4 py-3 font-display text-4xl text-papel leading-none sm:text-5xl">
                {perfil.nombre}
              </h1>
              <p className="mt-2 w-fit border-[3px] border-tinta bg-papel px-4 py-2 font-display text-base sm:text-lg">
                {perfil.resumen}
              </p>
            </Panel>

            {/* Cuatro cifras comprobables, en lugar de barras de porcentaje */}
            <Panel forma={cifras} fondo="tinta" className="p-6 sm:p-8">
              <p className="mb-5 font-bold text-[11px] text-papel uppercase tracking-[0.14em]">
                {t("sobreMi.construido")}
              </p>
              <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {perfil.cifras.map((cifra) => (
                  <div key={cifra.etiqueta} className="flex flex-col gap-1">
                    <dt className="font-display text-4xl text-papel leading-none sm:text-5xl">
                      {cifra.valor}
                    </dt>
                    <dd className="text-papel/80 text-sm leading-snug">
                      {cifra.etiqueta}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>

            {/* La trayectoria por etapas: cuenta como crecio el alcance, que es
              lo que un listado de fechas no dice. */}
            <div>
              <CajaNarracion fondo="tinta" className="mb-3">
                {t("sobreMi.trayectoria")}
              </CajaNarracion>
              <ol className="grid grid-cols-1 gap-canal sm:grid-cols-2 lg:grid-cols-4">
                {perfil.etapas.map((etapa, indice) => (
                  <li key={etapa.titulo}>
                    <Panel
                      forma={corteAbajo(
                        6,
                        indice % 2 === 0 ? "derecha" : "izquierda",
                      )}
                      trama={indice % 2 === 0 ? "puntos" : undefined}
                      className="flex h-full flex-col gap-2 p-5"
                    >
                      <span className="font-hand text-base">
                        {etapa.momento}
                      </span>
                      <span className="font-display text-xl leading-none">
                        {etapa.titulo}
                      </span>
                      <span className="text-sm leading-snug">
                        {etapa.texto}
                      </span>
                    </Panel>
                  </li>
                ))}
              </ol>
            </div>

            {/* Cómo trabajo */}
            <Panel as="article" className="p-6 sm:p-10">
              {perfil.traducido ? null : (
                <CajaNarracion variante="narracion" className="mb-8 block">
                  {t("sobreMi.sinTraducir")}
                </CajaNarracion>
              )}
              <MDXRemote
                source={perfil.contenido}
                components={componentesMdx}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            </Panel>

            {/* Stack con evidencia y datos de ficha */}
            <div className="flex flex-col gap-canal sm:flex-row">
              <Panel
                forma={corteAbajo(6)}
                trama="puntos"
                className="flex-1 p-6 sm:p-8"
              >
                <p className="mb-4 font-bold text-[11px] uppercase tracking-[0.14em]">
                  {t("sobreMi.stack")}
                </p>
                <ul className="flex flex-col gap-2">
                  {perfil.stack.map((pieza) => (
                    <li
                      key={pieza.nombre}
                      className="flex items-baseline justify-between gap-4 border-tinta border-b-2 pb-1.5"
                    >
                      <span className="font-bold text-sm">{pieza.nombre}</span>
                      <span className="shrink-0 font-hand text-base">
                        {t("sobreMi.enProyectos", { total: pieza.proyectos })}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
                <div>
                  <p className="font-bold text-[11px] uppercase tracking-[0.14em]">
                    {t("sobreMi.trabajoActual")}
                  </p>
                  <p className="mt-1 font-bold text-lg leading-snug">
                    {perfil.trabajo.empresa} · {perfil.trabajo.puesto}
                  </p>
                  <p className="mt-1 text-sm leading-snug">
                    {perfil.trabajo.texto}
                  </p>
                  <p className="mt-1 font-hand text-base">
                    {perfil.trabajo.desde}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[11px] uppercase tracking-[0.14em]">
                    {t("sobreMi.estudios")}
                  </p>
                  <p className="mt-1 font-bold text-lg leading-snug">
                    {perfil.estudios}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[11px] uppercase tracking-[0.14em]">
                    {t("sobreMi.donde")}
                  </p>
                  <p className="mt-1 font-bold text-lg leading-snug">
                    {perfil.ubicacion}
                  </p>
                </div>

                {perfil.certificaciones.length > 0 ? (
                  <div>
                    <p className="font-bold text-[11px] uppercase tracking-[0.14em]">
                      {t("nav.certificaciones")}
                    </p>
                    <ul className="mt-2 flex flex-col gap-2">
                      {perfil.certificaciones.map((certificacion) => (
                        <li key={certificacion.nombre} className="text-sm">
                          <span className="font-bold">
                            {certificacion.nombre}
                          </span>
                          <span className="block text-tinta/70">
                            {certificacion.emisor} · {certificacion.anio}
                          </span>
                          {certificacion.credencial ? (
                            <a
                              href={certificacion.credencial}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-xs underline underline-offset-2"
                            >
                              {t("sobreMi.credencial")} ↗
                            </a>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Panel>
            </div>
          </div>
        </Hoja>
      </div>
    </Pagina>
  );
}
