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

// ---------------------------------------------------------------------------
// Bocadillos
// ---------------------------------------------------------------------------

const redondo = (n: number) => Math.round(n * 10) / 10;

/** Punto sobre una elipse inscrita, en grados (0 = derecha, 90 = abajo). */
function enElipse(
  grados: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
) {
  const rad = (grados * Math.PI) / 180;
  return `${redondo(cx + rx * Math.cos(rad))},${redondo(cy + ry * Math.sin(rad))}`;
}

/** Elipse inscrita en toda la caja, aproximada con `lados` puntos. */
export function elipse(lados = 44): Forma {
  return Array.from({ length: lados }, (_, i) =>
    enElipse((360 / lados) * i, 50, 50, 50, 50),
  ).join(" ");
}

export type LadoCola =
  | "abajo-izquierda"
  | "abajo-derecha"
  | "arriba-izquierda"
  | "arriba-derecha";

const anguloDeCola: Record<LadoCola, number> = {
  "abajo-derecha": 62,
  "abajo-izquierda": 118,
  "arriba-izquierda": 242,
  "arriba-derecha": 298,
};

/**
 * Bocadillo de diálogo: elipse con la cola integrada en el mismo contorno.
 *
 * La cola tiene que caber DENTRO de la caja, porque `clip-path` no puede pintar
 * fuera de ella; por eso el cuerpo se encoge y deja sitio en ese lado. El
 * componente compensa con relleno para que el texto no se meta en la punta.
 */
export function bocadillo(cola?: LadoCola, lados = 44): Forma {
  if (!cola) return elipse(lados);

  const haciaArriba = cola.startsWith("arriba");
  const ry = 39;
  const cy = haciaArriba ? 100 - ry : ry;

  const centro = anguloDeCola[cola];
  const apertura = 14;
  const desde = centro - apertura;
  const hasta = centro + apertura;

  const puntaX = redondo(50 + 50 * Math.cos((centro * Math.PI) / 180) * 0.62);
  const punta = `${puntaX},${haciaArriba ? 0 : 100}`;

  const puntos: string[] = [];
  let colaPuesta = false;

  for (let i = 0; i < lados; i++) {
    const grados = (360 / lados) * i;
    if (!colaPuesta && grados > desde && grados < hasta) {
      puntos.push(
        enElipse(desde, 50, cy, 50, ry),
        punta,
        enElipse(hasta, 50, cy, 50, ry),
      );
      colaPuesta = true;
    }
    if (grados <= desde || grados >= hasta) {
      puntos.push(enElipse(grados, 50, cy, 50, ry));
    }
  }

  return puntos.join(" ");
}

/** Estallido de grito: picos alternando radio exterior e interior. */
export function estallido(picos = 14, hundido = 0.76): Forma {
  return Array.from({ length: picos * 2 }, (_, i) => {
    const grados = (180 / picos) * i - 90;
    const radio = i % 2 === 0 ? 1 : hundido;
    return enElipse(grados, 50, 50, 50 * radio, 50 * radio);
  }).join(" ");
}
