import { notFound } from "next/navigation";

/**
 * Recoge toda URL que ninguna otra ruta reconozca y la manda al 404 propio.
 *
 * Hace falta porque la etiqueta <html> vive en app/[locale]/layout.tsx y no
 * hay layout raíz: sin este comodín, Next respondería con su 404 genérico,
 * sin hoja, sin navegación y sin idioma —justo lo que la segunda regla
 * prohíbe: el botón atrás nunca expulsa del sitio.
 */
export default function Comodin() {
  notFound();
}
