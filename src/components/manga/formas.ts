/**
 * Siluetas de viñeta.
 *
 * Una forma es una lista de puntos en coordenadas normalizadas: `"x,y x,y ..."`
 * con x e y de 0 a 100, sea cual sea el tamaño real de la viñeta. Del mismo
 * string salen el recorte del contenido y el borde de tinta, así que nunca
 * pueden desincronizarse.
 */
export type Forma = string;

/** Rectángulo completo, sin cortes. */
export const plena: Forma = "0,0 100,0 100,100 0,100";

type Hacia = "derecha" | "izquierda";

/**
 * El borde INFERIOR se inclina: sube `caida` unidades hacia el lado indicado.
 * Para la viñeta que queda arriba de una costura.
 */
export function corteAbajo(caida = 12, hacia: Hacia = "derecha"): Forma {
  return hacia === "derecha"
    ? `0,0 100,0 100,${100 - caida} 0,100`
    : `0,0 100,0 100,100 0,${100 - caida}`;
}

/**
 * El borde SUPERIOR se inclina con la misma pendiente que `corteAbajo`.
 * Para la viñeta que queda debajo de una costura.
 */
export function corteArriba(caida = 12, hacia: Hacia = "derecha"): Forma {
  return hacia === "derecha"
    ? `0,${caida} 100,0 100,100 0,100`
    : `0,0 100,${caida} 100,100 0,100`;
}

/**
 * Las dos formas de una costura: el corte pertenece a la unión entre dos
 * viñetas, no a una sola. Declararlo aquí una vez evita que se desincronicen.
 *
 * ```tsx
 * const [arriba, abajo] = costura(12);
 * ```
 *
 * Ojo: las coordenadas son porcentajes de cada viñeta, así que las dos
 * diagonales solo salen paralelas si ambas tienen la MISMA altura. Si difieren,
 * ajusta la caída de la más baja en proporción a esa diferencia.
 */
export function costura(caida = 12, hacia: Hacia = "derecha"): [Forma, Forma] {
  return [corteAbajo(caida, hacia), corteArriba(caida, hacia)];
}

/** Convierte una forma en el `clip-path` equivalente. */
export function formaAClipPath(forma: Forma): string {
  const puntos = forma
    .trim()
    .split(/\s+/)
    .map((punto) => {
      const [x, y] = punto.split(",");
      return `${x}% ${y}%`;
    });

  return `polygon(${puntos.join(", ")})`;
}
