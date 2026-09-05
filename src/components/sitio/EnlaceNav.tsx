"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Props = {
  href: "/proyectos" | "/blog" | "/sobre-mi" | "/contacto";
  /** Clases que se añaden cuando esta es la sección actual. */
  activo: string;
  className?: string;
  children: ReactNode;
};

/**
 * Enlace del menú que sabe si es la sección actual. Una ficha de proyecto
 * cuenta como "Proyectos": la sección es el capítulo, no la página exacta.
 */
export function EnlaceNav({ href, activo, className, children }: Props) {
  const ruta = usePathname();
  const esActual = ruta === href || ruta.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={esActual ? "page" : undefined}
      className={cn(className, esActual && activo)}
    >
      {children}
    </Link>
  );
}
