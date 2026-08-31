import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  /** Qué se ve en la ilustración. Es contenido, no adorno: descríbelo. */
  alt: string;
  /**
   * Punto focal del recorte, en la sintaxis de `object-position`.
   * Importa porque la misma imagen se ve apaisada en escritorio y casi
   * cuadrada en móvil: aquí se decide qué parte sobrevive al recorte.
   */
  posicion?: string;
  /** `cubrir` llena la viñeta recortando; `contener` muestra la imagen entera. */
  ajuste?: "cubrir" | "contener";
  /**
   * `captura` pasa una captura de pantalla a blanco y negro de alto contraste
   * para que conviva con la tinta. Al ir en CSS y no en el archivo, puedes
   * sustituir el PNG cuando rediseñes y se convierte solo.
   */
  filtro?: "captura";
  /** Actívalo en la ilustración visible al abrir la página. */
  prioridad?: boolean;
  className?: string;
};

/**
 * La ilustración que llena una viñeta.
 *
 * Va en z negativo por debajo del borde de tinta del `Panel`, de modo que el
 * marco siempre queda por encima del dibujo y el contenido por encima de todo.
 */
export function Arte({
  src,
  alt,
  posicion = "center",
  ajuste = "cubrir",
  filtro,
  prioridad = false,
  className,
}: Props) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 -z-20 overflow-hidden",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 940px) 100vw, 920px"
        priority={prioridad}
        className={cn(
          ajuste === "contener" ? "object-contain" : "object-cover",
          filtro === "captura" && "contrast-[1.35] grayscale",
        )}
        style={{ objectPosition: posicion }}
      />
    </span>
  );
}
