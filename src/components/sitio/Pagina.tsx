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
 * Se probó un doblez de hoja en 3D para los cambios de capítulo y se
 * descartó: con una sola foto plana no hay forma de que parezca papel, y
 * un giro rígido se ve como un cuadro. Un fundido corto envejece mejor.
 *
 * `default="none"` evita que se anime en transiciones que no son un cambio
 * de página (una revelación de Suspense, un refresco).
 */
export function Pagina({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="hoja-entra" exit="hoja-sale" default="none">
      {children}
    </ViewTransition>
  );
}
