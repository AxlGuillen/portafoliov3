import { type ReactNode, ViewTransition } from "react";

/**
 * Pasar de página.
 *
 * Envuelve el contenido de cada página para que, al cambiar de ruta, la hoja
 * saliente se funda y la entrante suba un poco. Lo anima el navegador con la
 * View Transitions API a través del `<ViewTransition>` de React: sin
 * interceptar clics ni retrasar la navegación, y el botón atrás funciona
 * igual. Donde el navegador no la soporta, la página cambia en seco, como
 * hasta ahora.
 *
 * Va en cada `page.tsx`, no en el layout: el layout persiste entre rutas y
 * ahí nunca hay salida ni entrada que animar. Los tiempos y el respeto a
 * `prefers-reduced-motion` viven en `globals.css`, sección "Pasar de página".
 *
 * Dos maneras de pasar: al cambiar de capítulo desde el menú (los enlaces
 * llevan `transitionTypes={["capitulo"]}`) la hoja se dobla como en un
 * libro: se levanta por el borde derecho y gira sobre el lomo izquierdo. En
 * cualquier otra navegación —entrar a una ficha, volver atrás— solo se
 * funde: acercarse a un caso no es pasar página.
 *
 * `default="none"` evita que se anime en transiciones que no son un cambio
 * de página (una revelación de Suspense, un refresco).
 */
export function Pagina({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      // Cambiar de capítulo desde el menú dobla la hoja; cualquier otra
      // navegación (entrar a una ficha, el botón atrás) solo la funde.
      enter={{ capitulo: "hoja-entra-bajo-doblez", default: "hoja-entra" }}
      exit={{ capitulo: "hoja-dobla", default: "hoja-sale" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
