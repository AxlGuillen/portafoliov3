import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const fondos = {
  papel: "bg-papel text-tinta",
  tinta: "bg-tinta text-papel",
} as const;

const variantes = {
  /** Rótulo corto: sección, ruta, fecha. */
  etiqueta: "px-3 py-1.5 font-bold text-xs uppercase tracking-wider",
  /** Voz del narrador: una o dos frases. */
  narracion: "px-4 py-2.5 text-sm leading-snug",
} as const;

type Props = {
  fondo?: keyof typeof fondos;
  variante?: keyof typeof variantes;
  as?: "p" | "div" | "span" | "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
};

/**
 * La caja rectangular con borde de tinta que se apoya sobre la viñeta: rótulo
 * de sección o voz del narrador. A diferencia del bocadillo, no la dice nadie.
 */
export function CajaNarracion({
  fondo = "papel",
  variante = "etiqueta",
  as: Etiqueta = "p",
  className,
  children,
}: Props) {
  return (
    <Etiqueta
      className={cn(
        "inline-block border-[3px] border-tinta",
        fondos[fondo],
        variantes[variante],
        className,
      )}
    >
      {children}
    </Etiqueta>
  );
}
