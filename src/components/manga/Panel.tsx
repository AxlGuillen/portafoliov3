import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type Forma, formaAClipPath, plena } from "./formas";

const tramas = {
  puntos: "trama-puntos",
  densa: "trama-densa",
  lineas: "trama-lineas",
  velocidad: "trama-velocidad",
} as const;

const fondos = {
  papel: "bg-papel text-tinta",
  tinta: "bg-tinta text-papel",
  lima: "bg-lima text-tinta",
} as const;

/** Color del trazo por defecto según el fondo: la tinta se ve sobre el papel. */
const trazoPorFondo = {
  papel: "var(--color-tinta)",
  tinta: "var(--color-papel)",
  lima: "var(--color-tinta)",
} as const;

type PanelProps = {
  /** Silueta de la viñeta. Ver `formas.ts`. Por defecto, rectángulo completo. */
  forma?: Forma;
  /** Trama de semitono del fondo. Se pinta en CSS, nunca en la imagen. */
  trama?: keyof typeof tramas;
  fondo?: keyof typeof fondos;
  /** Grosor del borde de tinta en píxeles. */
  grosor?: number;
  /** Color del borde. Por defecto, el que contrasta con el fondo. */
  trazo?: string;
  /** Sin borde: para viñetas que solo aportan mancha o trama. */
  sinBorde?: boolean;
  as?: "div" | "article" | "section" | "li" | "aside";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Una viñeta de manga.
 *
 * La caja de maquetación sigue siendo rectangular —por eso el grid la coloca y
 * las container queries funcionan— y la silueta se dibuja dentro: `clip-path`
 * recorta fondo y contenido, y un `<polygon>` pinta el borde de tinta. Ambos
 * salen de la misma `forma`.
 *
 * El borde va en SVG y no en `border` por dos razones: `clip-path` se comería
 * un borde CSS, y un trazo vectorial se puede sustituir más adelante por una
 * línea irregular de pincel.
 *
 * Los hijos son hijos directos, así que `className="grid"` o `"flex"` sobre el
 * propio Panel funcionan como esperas.
 */
export function Panel({
  forma = plena,
  trama,
  fondo = "papel",
  grosor = 3.5,
  trazo,
  sinBorde = false,
  as: Etiqueta = "div",
  className,
  style,
  children,
}: PanelProps) {
  return (
    <Etiqueta
      className={cn("relative isolate", fondos[fondo], className)}
      style={{ clipPath: formaAClipPath(forma), ...style }}
    >
      {trama ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            tramas[trama],
          )}
        />
      ) : null}

      {sinBorde ? null : (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        >
          <title>Borde de la viñeta</title>
          <polygon
            points={forma}
            fill="none"
            stroke={trazo ?? trazoPorFondo[fondo]}
            /* Doble grosor: el clip-path se come la mitad exterior del trazo,
               así que lo que queda dentro mide exactamente `grosor`. */
            strokeWidth={grosor * 2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      {children}
    </Etiqueta>
  );
}
