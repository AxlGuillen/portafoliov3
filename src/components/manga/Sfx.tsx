import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Giro en grados. Ninguna onomatopeya va recta. */
  rotacion?: number;
  /** `tinta`: letra negra perfilada en blanco. `papel`: al revés. */
  variante?: "tinta" | "papel";
  grosorContorno?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Onomatopeya. Es texto de verdad, no adorno: se lee, se traduce y un lector
 * de pantalla la anuncia, igual que en la página impresa.
 */
export function Sfx({
  rotacion = -6,
  variante = "tinta",
  grosorContorno = 2,
  className,
  children,
}: Props) {
  const contorno =
    variante === "tinta" ? "var(--color-papel)" : "var(--color-tinta)";

  return (
    <span
      className={cn(
        "inline-block font-display text-5xl leading-none",
        variante === "tinta" ? "text-tinta" : "text-papel",
        className,
      )}
      style={{
        transform: `rotate(${rotacion}deg)`,
        WebkitTextStrokeWidth: `${grosorContorno}px`,
        WebkitTextStrokeColor: contorno,
        // Sin esto el contorno se come el interior de la letra.
        paintOrder: "stroke fill",
      }}
    >
      {children}
    </span>
  );
}
