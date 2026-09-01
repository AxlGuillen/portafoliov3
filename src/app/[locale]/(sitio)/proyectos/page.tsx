import { getTranslations, setRequestLocale } from "next-intl/server";
import { Arte } from "@/components/manga/Arte";
import { CajaNarracion } from "@/components/manga/CajaNarracion";
import { corteAbajo, corteArriba } from "@/components/manga/formas";
import { Hoja } from "@/components/manga/Hoja";
import { Panel } from "@/components/manga/Panel";
import { Sfx } from "@/components/manga/Sfx";
import { Link } from "@/i18n/navigation";
import { listarProyectos } from "@/lib/proyectos";

type Props = { params: Promise<{ locale: string }> };

export default async function Proyectos({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const proyectos = await listarProyectos(locale);

  const [destacado, ...resto] = proyectos;

  return (
    <div className="mx-auto max-w-[920px] px-2 pb-16">
      <Hoja>
        <div className="flex flex-col gap-canal">
          {/* Cabecera */}
          <Panel
            trama="lineas"
            className="relative flex min-h-[150px] flex-col justify-end p-6 sm:min-h-[180px] sm:p-8"
          >
            <CajaNarracion className="absolute top-5 left-5 sm:top-6 sm:left-6">
              {t("nav.proyectos")}
            </CajaNarracion>
            <h1 className="w-fit bg-tinta px-4 py-2 font-display text-4xl text-papel leading-none sm:text-5xl">
              {t("proyectos.titulo")}
            </h1>
            <p className="mt-2 w-fit border-[3px] border-tinta bg-papel px-3 py-1.5 font-hand text-base">
              {t("proyectos.cuantos", { total: proyectos.length })}
            </p>
          </Panel>

          {/* El destacado, a lo ancho */}
          {destacado ? (
            <Link
              href={{
                pathname: "/proyectos/[slug]",
                params: { slug: destacado.slug },
              }}
              className="group block"
            >
              <Panel
                forma={corteAbajo(6)}
                trama={destacado.portada ? undefined : "puntos"}
                className="flex min-h-[380px] flex-col justify-end p-6 transition-colors group-hover:bg-lima sm:min-h-[440px] sm:p-8"
              >
                {destacado.portada ? (
                  <Arte
                    src={destacado.portada}
                    alt={t("proyectos.captura", { proyecto: destacado.titulo })}
                    filtro="captura"
                    posicion="left top"
                    prioridad
                  />
                ) : null}

                <Sfx
                  rotacion={-6}
                  className="absolute top-5 right-6 text-3xl sm:text-4xl"
                >
                  ¡PAM!
                </Sfx>
                <FichaProyecto proyecto={destacado} grande />
              </Panel>
            </Link>
          ) : null}

          {/* El resto */}
          <div className="grid grid-cols-1 gap-canal sm:grid-cols-3">
            {resto.map((proyecto, indice) => (
              <Link
                key={proyecto.slug}
                href={{
                  pathname: "/proyectos/[slug]",
                  params: { slug: proyecto.slug },
                }}
                className="group block"
              >
                <Panel
                  forma={
                    indice % 2 === 0
                      ? corteArriba(7, "derecha")
                      : corteArriba(7, "izquierda")
                  }
                  trama={
                    proyecto.portada
                      ? undefined
                      : indice === 1
                        ? "densa"
                        : undefined
                  }
                  className="flex h-full min-h-[330px] flex-col justify-end p-5 transition-colors group-hover:bg-lima"
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

                  <FichaProyecto proyecto={proyecto} />
                </Panel>
              </Link>
            ))}
          </div>
        </div>
      </Hoja>
    </div>
  );
}

function FichaProyecto({
  proyecto,
  grande = false,
}: {
  proyecto: Awaited<ReturnType<typeof listarProyectos>>[number];
  grande?: boolean;
}) {
  return (
    <div className="border-[3px] border-tinta bg-papel p-4">
      <p className="font-bold text-[11px] uppercase tracking-[0.12em]">
        {proyecto.periodo}
      </p>
      <p
        className={`mt-1 font-display leading-none ${grande ? "text-3xl sm:text-4xl" : "text-2xl"}`}
      >
        {proyecto.titulo}
      </p>
      <p className="mt-2 text-sm leading-snug">{proyecto.subtitulo}</p>
      {grande ? (
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed">
          {proyecto.resumen}
        </p>
      ) : null}
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {proyecto.stack.slice(0, grande ? 5 : 3).map((pieza) => (
          <li
            key={pieza}
            className="border-2 border-tinta px-2 py-0.5 font-bold text-[11px]"
          >
            {pieza}
          </li>
        ))}
      </ul>
    </div>
  );
}
