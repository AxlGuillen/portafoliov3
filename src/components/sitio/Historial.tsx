import { getTranslations } from "next-intl/server";
import { CajaNarracion } from "@/components/manga/CajaNarracion";
import type { Historial as Datos } from "@/lib/proyectos";

/** Altura del área de barras en unidades del viewBox. */
const ALTO = 100;

/**
 * El ritmo de trabajo de un proyecto: una barra por semana, a la altura de
 * sus commits. Cuenta lo que un "periodo" no dice —los arranques, los
 * parones y las semanas de entrega— con datos que salen del propio git.
 *
 * Es SVG a mano y no una librería: cuatro rectángulos negros sobre papel no
 * necesitan más, y así se pintan en el servidor sin JavaScript.
 */
export async function Historial({
  datos,
  locale,
}: {
  datos: Datos;
  locale: string;
}) {
  const t = await getTranslations();

  const maximo = Math.max(...datos.semanas.map((s) => s.commits));
  const pico = datos.semanas.find((s) => s.commits === maximo) ?? null;

  // UTC: una fecha "2026-01-23" es medianoche UTC y en UTC−6 sería el día 22.
  const mesAnio = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
  const diaMes = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
  });

  const desde = mesAnio.format(new Date(datos.desde));
  const hasta = mesAnio.format(new Date(datos.hasta));
  const resumen = t("proyectos.historialResumen", {
    total: datos.total,
    desde,
    hasta,
    pico: maximo,
  });

  return (
    <figure className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <CajaNarracion as="figcaption">
          {t("proyectos.historial")}
        </CajaNarracion>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-4xl leading-none sm:text-5xl">
            {datos.total}
          </span>
          <span className="font-bold text-sm">commits</span>
        </p>
      </div>

      {/* Las barras escalan con el ancho; los textos van fuera para que no. */}
      <svg
        data-historial=""
        viewBox={`0 0 ${datos.semanas.length} ${ALTO}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={resumen}
        className="block h-24 w-full sm:h-32"
      >
        <title>{resumen}</title>
        {datos.semanas.map((semana, indice) => {
          if (semana.commits === 0) return null;
          const alto = (semana.commits / maximo) * ALTO;
          return (
            <rect
              key={semana.inicio}
              x={indice + 0.15}
              y={ALTO - alto}
              width={0.7}
              height={alto}
              fill="var(--color-tinta)"
            />
          );
        })}
      </svg>

      <div className="flex justify-between gap-4 border-tinta border-t-[3px] pt-2 font-bold text-[11px] uppercase tracking-[0.12em]">
        <span>{desde}</span>
        <span className="text-right">{hasta}</span>
      </div>

      {pico ? (
        <p className="font-hand text-base">
          {t("proyectos.pico", {
            commits: maximo,
            semana: diaMes.format(new Date(pico.inicio)),
          })}
        </p>
      ) : null}
    </figure>
  );
}
