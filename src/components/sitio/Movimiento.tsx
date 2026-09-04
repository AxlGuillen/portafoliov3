"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "@/i18n/navigation";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * El movimiento de la página: las viñetas aparecen al llegar a ellas y las
 * onomatopeyas estallan. Sutil y una sola vez, como pasar la hoja.
 *
 * Reglas que lo mantienen a raya:
 *
 * - Solo se mueve lo que está por debajo del pliegue al cargar. Lo visible
 *   al abrir se pinta ya en su sitio: nada parpadea, y sin JavaScript la
 *   página es idéntica menos el movimiento.
 * - `prefers-reduced-motion` lo apaga entero. Va por `matchMedia` de GSAP y
 *   no por CSS porque GSAP escribe estilos en línea y el CSS no los frena.
 * - No toca el layout: solo opacidad y transformaciones, que no relayout.
 *
 * Las viñetas se reconocen por `data-vineta` (lo pone `Panel`) y las
 * onomatopeyas por `data-sfx` (lo pone `Sfx`). Una viñeta dentro de otra no
 * se anima aparte: se mueve con su madre.
 */
export function Movimiento() {
  const ruta = usePathname();

  useGSAP(
    () => {
      const medios = gsap.matchMedia();

      medios.add("(prefers-reduced-motion: no-preference)", () => {
        // Sin viewport medible (pestaña oculta, previsualización) no hay
        // pliegue que respetar: mejor no mover nada que esconderlo todo.
        const pliegue = window.innerHeight;
        if (!pliegue) return;

        const porDebajo = (elemento: Element) =>
          elemento.getBoundingClientRect().top > pliegue;

        const vinetas = gsap.utils
          .toArray<HTMLElement>("main [data-vineta]")
          .filter(
            (vineta) =>
              !vineta.parentElement?.closest("[data-vineta]") &&
              porDebajo(vineta),
          );

        for (const vineta of vinetas) {
          gsap.from(vineta, {
            opacity: 0,
            y: 28,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: { trigger: vineta, start: "top 88%", once: true },
          });
        }

        // Las barras del historial crecen desde la base, de izquierda a
        // derecha. Se animan los atributos y no un transform: el SVG está
        // estirado con preserveAspectRatio="none" y un scaleY se deformaría.
        for (const grafica of gsap.utils
          .toArray<SVGSVGElement>("main [data-historial]")
          .filter(porDebajo)) {
          const barras = grafica.querySelectorAll("rect");
          for (const barra of barras) {
            gsap.from(barra, {
              attr: { y: grafica.viewBox.baseVal.height, height: 0 },
              duration: 0.6,
              ease: "power3.out",
              // Escalonado por posición y no por índice de barra: así las
              // semanas vacías, que no tienen barra, también cuentan.
              delay: Number(barra.getAttribute("x")) * 0.025,
              scrollTrigger: { trigger: grafica, start: "top 85%", once: true },
            });
          }
        }

        const onomatopeyas = gsap.utils
          .toArray<HTMLElement>("main [data-sfx]")
          .filter(porDebajo);

        for (const sfx of onomatopeyas) {
          gsap.from(sfx, {
            opacity: 0,
            scale: 0.6,
            duration: 0.4,
            ease: "back.out(2.2)",
            transformOrigin: "50% 60%",
            scrollTrigger: { trigger: sfx, start: "top 85%", once: true },
          });
        }
      });
    },
    // Al cambiar de ruta, useGSAP revierte lo anterior y vuelve a medir.
    { dependencies: [ruta] },
  );

  return null;
}
