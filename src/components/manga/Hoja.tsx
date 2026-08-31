import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Numeración al pie, como en un tomo: "1 / 4". */
  pagina?: string;
  className?: string;
  children: ReactNode;
};

/**
 * La hoja de papel sobre el fondo del lector. Cada hoja es una página de manga
 * completa; en móvil ocupa todo el ancho y las viñetas se leen en vertical.
 */
export function Hoja({ pagina, className, children }: Props) {
  return (
    <section
      className={cn(
        "bg-papel p-2 shadow-[0_22px_60px_rgba(0,0,0,0.6)] sm:p-2.5",
        className,
      )}
    >
      {children}
      {pagina ? (
        <p className="mt-3 text-center font-bold text-tinta/55 text-xs tracking-[0.16em]">
          — {pagina} —
        </p>
      ) : null}
    </section>
  );
}
