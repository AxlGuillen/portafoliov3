"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Las cuatro secciones, en el orden del menú. El número sale de aquí. */
const secciones = [
  { clave: "proyectos", ruta: "/proyectos", nombre: "nav.proyectos" },
  { clave: "blog", ruta: "/blog", nombre: "nav.blog" },
  { clave: "sobre-mi", ruta: "/sobre-mi", nombre: "nav.sobreMi" },
  { clave: "contacto", ruta: "/contacto", nombre: "nav.contacto" },
] as const;

type Clave = (typeof secciones)[number]["clave"];

/** Altura de la barra más un margen: donde empieza a leerse la página. */
const BAJO_LA_BARRA = 96;

/**
 * El rótulo de capítulo en la barra: "02 — Blog".
 *
 * En la portada cambia al bajar; las viñetas se anuncian con `data-seccion`.
 * En las páginas interiores es la ruta, sin más. Antes de la primera sección
 * —la cubierta— no dice nada.
 *
 * La sección activa es la que cruza la "línea de lectura", y esa línea no es
 * fija: arranca justo bajo la barra y baja hasta el pie de la pantalla a
 * medida que se llega al final. Con una línea fija bajo la barra, la última
 * sección nunca se activaría: su borde superior no alcanza a pasar por ahí
 * porque la página se acaba antes.
 *
 * Es información, no adorno: con `prefers-reduced-motion` el texto cambia
 * igual, solo que sin el fundido.
 */
export function Indicador() {
  const t = useTranslations();
  const ruta = usePathname();
  const enPortada = ruta === "/";

  const [activa, setActiva] = useState<Clave | null>(null);
  const rotulo = useRef<HTMLSpanElement>(null);

  const fija =
    secciones.find((s) => ruta === s.ruta || ruta.startsWith(`${s.ruta}/`))
      ?.clave ?? null;
  const seccion = enPortada ? activa : fija;

  useGSAP(
    () => {
      if (!enPortada) return;

      const hitos = gsap.utils.toArray<HTMLElement>("main [data-seccion]");

      const medir = (progreso: number) => {
        const linea =
          BAJO_LA_BARRA + (window.innerHeight - BAJO_LA_BARRA) * progreso;
        // La sección activa es la última que la línea ya alcanzó, no la que
        // cruza justo ahora: así el rótulo no se apaga en los canales entre
        // viñetas. Solo queda vacío antes de la primera, en la cubierta.
        let alcanzada: Clave | null = null;
        for (const hito of hitos) {
          if (hito.getBoundingClientRect().top <= linea) {
            alcanzada = hito.dataset.seccion as Clave;
          }
        }
        setActiva(alcanzada);
      };

      // Un solo disparador sobre toda la página: `progress` va de 0 arriba
      // a 1 al final, y es lo que hace bajar la línea de lectura.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (disparador) => medir(disparador.progress),
        onRefresh: (disparador) => medir(disparador.progress),
      });
    },
    { dependencies: [ruta] },
  );

  useGSAP(
    () => {
      if (!rotulo.current) return;
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          rotulo.current,
          { y: 6, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
        );
      });
    },
    { dependencies: [seccion] },
  );

  const indice = secciones.findIndex((s) => s.clave === seccion);
  if (indice === -1) return null;

  return (
    <span
      ref={rotulo}
      className="whitespace-nowrap font-bold text-[11px] text-papel/75 uppercase tracking-[0.14em]"
    >
      <span className="font-display text-papel text-xs tracking-normal">
        0{indice + 1}
      </span>{" "}
      — {t(secciones[indice].nombre)}
    </span>
  );
}
