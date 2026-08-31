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

type Props = { params: Promise<{ locale: string }> };

export default async function Inicio({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // El corte pertenece a la costura entre dos viñetas, no a una sola.
  const [apertura, destacado] = costura(9);
  const [blogIzquierda, personaje] = costura(7);

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-10 px-2 pb-16 sm:gap-12">
      {/* --- Página 1: la portada del capítulo --- */}
      <Hoja pagina="1 / 4">
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
            <div className="flex w-fit items-center gap-4 bg-tinta px-5 py-4">
              <Logo size={58} trazo="var(--color-papel)" />
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

            <Link
              href="/proyectos"
              className="group flex w-fit flex-wrap items-center gap-4 border-[3px] border-tinta bg-papel px-4 py-3 transition-colors hover:bg-lima"
            >
              <span className="font-bold">[{t("inicio.destacado")}]</span>
              <span className="font-bold text-sm underline-offset-4 group-hover:underline">
                {t("inicio.verCaso")} →
              </span>
            </Link>

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
      <Hoja pagina="2 / 4">
        <div className="flex flex-col gap-canal">
          {/* Blog: dos viñetas con cortes opuestos */}
          <div className="flex flex-col gap-canal sm:flex-row">
            <Panel
              forma={blogIzquierda}
              className="flex min-h-[190px] flex-1 flex-col gap-2 p-6"
            >
              <CajaNarracion fondo="tinta" className="self-start">
                {t("nav.blog")}
              </CajaNarracion>
              <p className="mt-1 font-bold text-lg leading-snug">
                [Título del último artículo]
              </p>
              <p className="font-hand text-base">[fecha] · 4 min</p>
              <Link
                href="/blog"
                className="mt-auto font-bold text-sm underline-offset-4 hover:underline"
              >
                {t("inicio.leer")} →
              </Link>
            </Panel>

            <Panel
              forma={corteArriba(7, "izquierda")}
              trama="puntos"
              className="flex min-h-[190px] flex-1 flex-col gap-2 p-6"
            >
              <p className="mt-2 font-bold text-lg leading-snug">
                [Título del artículo anterior]
              </p>
              <p className="font-hand text-base">[fecha] · 4 min</p>
              <Link
                href="/blog"
                className="mt-auto font-bold text-sm underline-offset-4 hover:underline"
              >
                {t("inicio.archivo")} →
              </Link>
            </Panel>
          </div>

          {/* Sobre mí: viñeta dominante con una inserta que rompe el borde */}
          <div className="relative">
            <Panel
              forma={personaje}
              trama="lineas"
              className="min-h-[320px] p-6 sm:min-h-[420px] sm:p-8"
            >
              <CajaNarracion>{t("nav.sobreMi")}</CajaNarracion>

              <div className="mt-12 max-w-md border-[3px] border-tinta border-dashed bg-papel/90 p-4 text-center sm:mt-20">
                <span className="font-bold text-xs uppercase tracking-widest">
                  Asset IA
                </span>
                <p className="mt-1 text-sm leading-snug">
                  Cuerpo entero en acción, en diagonal; la pierna rompe el borde
                  inferior del panel.
                </p>
              </div>

              <Sfx
                variante="papel"
                rotacion={-8}
                className="absolute top-16 right-8 text-4xl sm:text-5xl"
              >
                ¡FIUU!
              </Sfx>
            </Panel>

            {/* Va fuera del Panel: dentro, el recorte se la comería. */}
            <Link
              href="/sobre-mi"
              className="-bottom-4 absolute right-4 flex w-[230px] rotate-2 flex-col gap-1 border-[3.5px] border-tinta bg-papel px-4 py-3 shadow-[-6px_6px_0_rgba(17,17,17,0.2)] transition-colors hover:bg-lima sm:right-6"
            >
              <span className="font-hand text-base">Nada mal, ¿eh?</span>
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
          <div>
            <CajaNarracion fondo="tinta" className="mb-3">
              {t("inicio.losCasos")}
            </CajaNarracion>
            <div className="grid grid-cols-1 gap-canal sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3].map((numero) => (
                <Link key={numero} href="/proyectos" className="group">
                  <Panel
                    forma={corteAbajo(
                      6,
                      numero % 2 === 0 ? "izquierda" : "derecha",
                    )}
                    trama={numero === 2 ? "densa" : "puntos"}
                    className="flex min-h-[180px] flex-col justify-end p-4 transition-colors group-hover:bg-lima"
                  >
                    <span className="border-[3px] border-tinta bg-papel px-2 py-1 font-bold text-sm">
                      [Proyecto 0{numero}]
                    </span>
                  </Panel>
                </Link>
              ))}

              <Link href="/proyectos" className="group">
                <Panel
                  forma={corteAbajo(6, "izquierda")}
                  fondo="tinta"
                  className="flex min-h-[180px] flex-col justify-end p-4"
                >
                  <span className="absolute top-3 right-4 font-display text-2xl text-papel">
                    04★
                  </span>
                  <span className="border-[3px] border-tinta bg-papel px-2 py-1 font-bold text-sm text-tinta transition-colors group-hover:bg-lima">
                    [{t("inicio.elEspecial")}]
                  </span>
                </Panel>
              </Link>
            </div>
          </div>

          {/* Contacto: la única viñeta a color */}
          <Panel
            fondo="lima"
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
