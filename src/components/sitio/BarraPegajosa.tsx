"use client";

import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Envoltorio que fija la barra arriba y le cambia el aspecto al bajar.
 *
 * Arriba del todo va suelta, sin fondo ni línea, porque el papel aún no ha
 * llegado y la barra se lee sobre el fondo del lector. En cuanto la hoja blanca
 * empieza a pasar por debajo, la barra se opaca y saca una línea de tinta: sin
 * eso, el texto blanco del menú quedaría blanco sobre papel blanco.
 *
 * No se puede hacer solo con CSS todavía: no hay selector de "está pegada", y
 * las animaciones ligadas al scroll aún no están en todos los navegadores.
 */
export function BarraPegajosa({ children }: { children: ReactNode }) {
  const [desplazado, setDesplazado] = useState(false);

  useEffect(() => {
    const alDesplazar = () => setDesplazado(window.scrollY > 24);
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  return (
    <div
      style={{ viewTransitionName: "barra" }}
      className={cn(
        "sticky top-0 z-40 border-b-2 transition-colors duration-300 motion-reduce:transition-none",
        desplazado
          ? "border-papel/30 bg-lector/95 backdrop-blur-sm"
          : "border-transparent bg-transparent",
      )}
    >
      {children}
    </div>
  );
}
