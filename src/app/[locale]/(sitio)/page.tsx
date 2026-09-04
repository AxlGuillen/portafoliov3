import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Arte } from "@/components/manga/Arte";
import { Bocadillo } from "@/components/manga/Bocadillo";
import { CajaNarracion } from "@/components/manga/CajaNarracion";
import { corteAbajo, corteArriba, costura } from "@/components/manga/formas";
import { Hoja } from "@/components/manga/Hoja";
import { Panel } from "@/components/manga/Panel";
import { Sfx } from "@/components/manga/Sfx";
import { Logo } from "@/components/marca/Logo";
import { Link } from "@/i18n/navigation";
import { listarArticulos } from "@/lib/blog";
import { metadatosDe } from "@/lib/metadatos";
import { listarProyectos } from "@/lib/proyectos";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return metadatosDe({
    href: "/",
    locale,
    descripcion: t("meta.inicio"),
  });
}

export default async function Inicio({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const proyectos = await listarProyectos(locale);
  const [ultimo, anterior] = await listarArticulos(locale);
  const fecha = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const proyectoDestacado = proyectos.find((p) => p.destacado) ?? proyectos[0];

  // El corte pertenece a la costura entre dos viñetas, no a una sola.
  const [apertura, destacado] = costura(9);
  const [blogIzquierda, personaje] = costura(7);

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-10 px-2 pb-16 sm:gap-12">
      {/* --- Página 1: la portada del capítulo --- */}
      <Hoja pagina="1 / 2">
        <div className="relative flex flex-col gap-canal">
          <Panel
            forma={apertura}
            className="flex min-h-[360px] flex-col justify-end p-6 sm:min-h-[460px] sm:p-8 lg:pl-[172px]"
          >
            <Arte
              src="/vinetas/inicio-apertura.avif"
              alt="Axl Guillen apoyado en el tronco de un árbol en un parque, ilustrado a tinta"
              posicion="55% 28%"
              prioridad
            />

            <CajaNarracion className="absolute top-5 left-5 sm:top-6 sm:left-6">
              {t("inicio.rol")} — 2026
            </CajaNarracion>

            <Sfx
              rotacion={9}
              className="absolute top-3 right-5 text-4xl sm:top-5 sm:right-8 sm:text-6xl"
            >
              ¡TAK!
            </Sfx>

            {/* Sobre el dibujo, el texto necesita fondo sólido: es lo que hace
                el manga con los rótulos, y aquí además garantiza contraste. */}
            <div className="w-fit bg-tinta px-5 py-4">
              <h1 className="font-display text-4xl text-papel leading-none tracking-tight sm:text-5xl">
                AXL
                <br />
                GUILLEN
              </h1>
            </div>

            <p className="mt-2 w-fit border-[3px] border-tinta bg-papel px-4 py-2 font-display text-base sm:text-lg">
              {t("inicio.lema")}
            </p>

            <Bocadillo
              cola="abajo-izquierda"
              className="absolute top-16 right-6 hidden h-[140px] w-[180px] text-sm lg:block"
            >
              {t("inicio.pasaPagina")}
            </Bocadillo>
          </Panel>

          <Panel
            forma={destacado}
            seccion="proyectos"
            className="flex min-h-[320px] flex-col justify-end p-6 sm:min-h-[420px] sm:p-8 lg:pl-[172px]"
          >
            <Arte
              src="/vinetas/inicio-destacado.avif"
              alt="Axl Guillen de espaldas frente a un monitor que muestra el panel del sistema DYMMSA, ilustrado a tinta"
              posicion="60% center"
            />

            <Sfx
              variante="papel"
              rotacion={-5}
              className="absolute top-5 left-5 text-4xl sm:top-6 sm:left-8 sm:text-5xl lg:left-[172px]"
            >
              ¡ZUUM!
            </Sfx>

            {proyectoDestacado ? (
              <Link
                href={{
                  pathname: "/proyectos/[slug]",
                  params: { slug: proyectoDestacado.slug },
                }}
                className="group flex w-fit flex-wrap items-center gap-4 border-[3px] border-tinta bg-papel px-4 py-3 transition-colors hover:bg-lima"
              >
                <span className="font-bold">{proyectoDestacado.titulo}</span>
                <span className="font-bold text-sm underline-offset-4 group-hover:underline">
                  {t("inicio.verCaso")} →
                </span>
              </Link>
            ) : null}

            <CajaNarracion
              variante="narracion"
              fondo="tinta"
              className="absolute right-6 bottom-6 hidden max-w-xs lg:block"
            >
              {t("inicio.narrador")}
            </CajaNarracion>
          </Panel>

          {/* Rótulo de capítulo: vertical y cruzando la costura, como en un tomo. */}
          <div className="pointer-events-none absolute top-[26%] left-5 hidden w-[118px] flex-col items-center gap-4 bg-tinta py-5 shadow-[6px_6px_0_rgba(17,17,17,0.25)] lg:flex">
            <Logo size={60} trazo="var(--color-papel)" />
            <span className="font-display text-lg text-papel tracking-[0.18em] [writing-mode:vertical-rl]">
              {t("inicio.volumen")}
            </span>
          </div>
        </div>
      </Hoja>

      {/* --- Página 2: las secciones --- */}
      <Hoja pagina="2 / 2">
        <div className="flex flex-col gap-canal">
          {/* Blog: dos viñetas con cortes opuestos */}
          <div
            data-seccion="blog"
            className="flex flex-col gap-canal sm:flex-row"
          >
            <Panel
              forma={blogIzquierda}
              className="flex min-h-[190px] flex-1 flex-col gap-2 p-6"
            >
              <CajaNarracion fondo="tinta" className="self-start">
                {t("nav.blog")}
              </CajaNarracion>
              {ultimo ? (
                <>
                  <p className="mt-1 font-bold text-lg leading-snug">
                    {ultimo.titulo}
                  </p>
                  <p className="font-hand text-base">
                    {fecha.format(new Date(ultimo.fecha))} ·{" "}
                    {t("blog.minutos", { minutos: ultimo.minutos })}
                  </p>
                  <Link
                    href={{
                      pathname: "/blog/[slug]",
                      params: { slug: ultimo.slug },
                    }}
                    className="mt-auto font-bold text-sm underline-offset-4 hover:underline"
                  >
                    {t("inicio.leer")} →
                  </Link>
                </>
              ) : null}
            </Panel>

            <Panel
              forma={corteArriba(7, "izquierda")}
              trama="puntos"
              className="flex min-h-[190px] flex-1 flex-col gap-2 p-6"
            >
              {anterior ? (
                <>
                  <p className="mt-2 font-bold text-lg leading-snug">
                    {anterior.titulo}
                  </p>
                  <p className="font-hand text-base">
                    {fecha.format(new Date(anterior.fecha))} ·{" "}
                    {t("blog.minutos", { minutos: anterior.minutos })}
                  </p>
                </>
              ) : null}
              <Link
                href="/blog"
                className="mt-auto font-bold text-sm underline-offset-4 hover:underline"
              >
                {t("inicio.archivo")} →
              </Link>
            </Panel>
          </div>

          {/* Sobre mí: viñeta dominante con una inserta que rompe el borde */}
          <div data-seccion="sobre-mi" className="relative">
            {/* La viñeta callada de la página: sin onomatopeya. Tres paneles
                ruidosos seguidos cansan; el manga alterna. */}
            <Panel
              forma={personaje}
              className="min-h-[320px] p-6 sm:min-h-[420px] sm:p-8"
            >
              <Arte
                src="/vinetas/inicio-sobre-mi.avif"
                alt="Escritorio de trabajo visto desde arriba: monitor, torre, teclado y silla, ilustrado a tinta"
                posicion="center 45%"
              />

              <CajaNarracion>{t("nav.sobreMi")}</CajaNarracion>
            </Panel>

            {/* Va fuera del Panel: dentro, el recorte se la comería. */}
            <Link
              href="/sobre-mi"
              className="-bottom-4 absolute right-4 flex w-[230px] rotate-2 flex-col gap-1 border-[3.5px] border-tinta bg-papel px-4 py-3 shadow-[-6px_6px_0_rgba(17,17,17,0.2)] transition-colors hover:bg-lima sm:right-6"
            >
              <span className="font-hand text-base">
                {t("inicio.aquiPasaTodo")}
              </span>
              <span className="font-bold text-sm">{t("nav.sobreMi")} →</span>
            </Link>
          </div>

          {/* Ráfaga: separador narrativo hacia los casos */}
          <Panel
            trama="velocidad"
            className="mt-4 grid min-h-[74px] place-items-center px-4"
          >
            <Sfx
              variante="papel"
              rotacion={-3}
              className="text-3xl sm:text-4xl"
            >
              ¡GO GO GO GO!
            </Sfx>
          </Panel>

          {/* Los cuatro casos */}
          <div data-seccion="proyectos">
            <CajaNarracion fondo="tinta" className="mb-3">
              {t("inicio.losCasos")}
            </CajaNarracion>
            <div className="grid grid-cols-1 gap-canal sm:grid-cols-2 lg:grid-cols-4">
              {proyectos.slice(0, 4).map((proyecto, indice) => {
                const esElCuarto = indice === 3;
                return (
                  <Link
                    key={proyecto.slug}
                    href={{
                      pathname: "/proyectos/[slug]",
                      params: { slug: proyecto.slug },
                    }}
                    className="group"
                  >
                    <Panel
                      forma={corteAbajo(
                        6,
                        indice % 2 === 0 ? "derecha" : "izquierda",
                      )}
                      fondo={esElCuarto ? "tinta" : "papel"}
                      trama={
                        proyecto.portada || esElCuarto
                          ? undefined
                          : indice === 1
                            ? "densa"
                            : "puntos"
                      }
                      className="flex min-h-[180px] flex-col justify-end p-4"
                    >
                      {proyecto.portada ? (
                        <Arte
                          src={proyecto.portada}
                          alt={t("proyectos.captura", {
                            proyecto: proyecto.titulo,
                          })}
                          filtro="captura"
                          posicion="left top"
                        />
                      ) : null}

                      {esElCuarto ? (
                        <span className="absolute top-3 right-4 font-display text-2xl text-papel">
                          04★
                        </span>
                      ) : null}
                      <span className="border-[3px] border-tinta bg-papel px-2 py-1 font-bold text-sm text-tinta transition-colors group-hover:bg-lima">
                        {proyecto.titulo}
                      </span>
                    </Panel>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contacto: la única viñeta a color */}
          <Panel
            fondo="lima"
            seccion="contacto"
            className="mt-2 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[11px] uppercase tracking-[0.14em]">
                04 — {t("nav.contacto")}
              </span>
              <span className="font-display text-3xl leading-none sm:text-4xl">
                {t("inicio.hablemos")}
              </span>
            </div>
            <Link
              href="/contacto"
              className="bg-tinta px-6 py-4 font-display text-base text-lima transition-transform hover:-rotate-1 sm:text-lg"
            >
              {t("nav.contacto")} →
            </Link>
          </Panel>
        </div>
      </Hoja>
    </div>
  );
}
