import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { bocadillo, estallido, type LadoCola } from "./formas";
import { Panel } from "./Panel";

/**
 * Zona útil de texto, en porcentajes del propio bocadillo.
 *
 * Va con `inset` y no con relleno porque el relleno en porcentaje se calcula
 * sobre el CONTENEDOR, no sobre el elemento: dentro de una viñeta ancha, un
 * `px-[16%]` daría cientos de píxeles y reventaría la burbuja. El `inset` de
 * un hijo absoluto sí se mide contra el bocadillo.
 */
const zonas = {
  "abajo-izquierda": "inset-[12%_16%_30%_16%]",
  "abajo-derecha": "inset-[12%_16%_30%_16%]",
  "arriba-izquierda": "inset-[30%_16%_12%_16%]",
  "arriba-derecha": "inset-[30%_16%_12%_16%]",
  grito: "inset-[22%]",
  sinCola: "inset-[14%]",
} as const;

type Props = {
  /** De dónde sale la cola. Se integra en el contorno, no se pega encima. */
  cola?: LadoCola;
  /** `habla`: elipse con cola. `grito`: estallido de picos, sin cola. */
  tipo?: "habla" | "grito";
  fondo?: "papel" | "tinta";
  grosor?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Bocadillo de diálogo.
 *
 * Reutiliza `Panel`: cuerpo y cola salen de una sola lista de puntos, así que
 * el contorno de tinta es continuo y no hay costura donde nace la punta.
 */
export function Bocadillo({
  cola = "abajo-izquierda",
  tipo = "habla",
  fondo = "papel",
  grosor = 3,
  className,
  children,
}: Props) {
  const esGrito = tipo === "grito";

  return (
    <Panel
      forma={esGrito ? estallido() : bocadillo(cola)}
      fondo={fondo}
      grosor={grosor}
      className={className}
    >
      <span
        className={cn(
          "absolute grid place-items-center text-center font-bold leading-tight",
          esGrito ? zonas.grito : zonas[cola],
        )}
      >
        {children}
      </span>
    </Panel>
  );
}
