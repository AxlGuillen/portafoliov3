/**
 * Inventario de imágenes: qué espera el sitio, qué hay y qué falta.
 *
 *   bun run assets
 *
 * La lista no está escrita a mano: los casos y artículos salen de `content/`
 * y las viñetas de los nombres que las páginas buscan por convención. Así,
 * al añadir un caso nuevo, su portada aparece aquí como pendiente sin tocar
 * este archivo. Sale con código 1 si falta algo obligatorio, para poder
 * usarlo como puerta antes de publicar.
 */
import fs from "node:fs";
import path from "node:path";

const publico = path.join(process.cwd(), "public");
const contenido = path.join(process.cwd(), "content", "es");
const extensiones = ["avif", "webp", "jpg", "jpeg", "png"];

type Fila = {
  grupo: string;
  ruta: string;
  hay: boolean;
  obligatorio: boolean;
  nota: string;
};

const filas: Fila[] = [];

/** Existe `public/<base>.<ext>` con alguna de las extensiones aceptadas. */
function alguna(base: string) {
  return extensiones.find((ext) =>
    fs.existsSync(path.join(publico, `${base}.${ext}`)),
  );
}

function slugs(carpeta: string) {
  const ruta = path.join(contenido, carpeta);
  if (!fs.existsSync(ruta)) return [];
  return fs
    .readdirSync(ruta)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

/** Cuenta imágenes sueltas en `public/<carpeta>/`. */
function cuantas(carpeta: string) {
  const ruta = path.join(publico, carpeta);
  if (!fs.existsSync(ruta)) return 0;
  return fs
    .readdirSync(ruta)
    .filter((f) => extensiones.includes(path.extname(f).slice(1).toLowerCase()))
    .length;
}

// --- Viñetas de portada y 404 (nombres fijos que buscan las páginas) -------
const vinetas: [string, boolean, string][] = [
  ["vinetas/inicio-apertura", true, "portada: tú junto al árbol"],
  ["vinetas/inicio-destacado", true, "portada: de espaldas al monitor"],
  ["vinetas/inicio-sobre-mi", true, "portada y sobre mí: el escritorio"],
  ["vinetas/404-arriba", true, "404, viñeta superior"],
  ["vinetas/404-abajo", true, "404, viñeta inferior"],
  ["vinetas/contacto", false, "contacto: hoy es texto sobre tinta"],
];
for (const [base, obligatorio, nota] of vinetas) {
  const ext = alguna(base);
  filas.push({
    grupo: "Viñetas",
    ruta: ext ? `${base}.${ext}` : `${base}.avif`,
    hay: Boolean(ext),
    obligatorio,
    nota,
  });
}

// --- Proyectos: portada obligatoria, galería opcional ---------------------
for (const slug of slugs("proyectos")) {
  const ext = alguna(`proyectos/${slug}`);
  filas.push({
    grupo: "Proyectos · portada",
    ruta: ext ? `proyectos/${slug}.${ext}` : `proyectos/${slug}.jpg`,
    hay: Boolean(ext),
    obligatorio: true,
    nota: "tarjeta en portada y en la lista",
  });
  const n = cuantas(`proyectos/${slug}`);
  filas.push({
    grupo: "Proyectos · galería",
    ruta: `proyectos/${slug}/`,
    hay: n > 0,
    obligatorio: false,
    nota: n > 0 ? `${n} capturas en la ficha` : "capturas dentro de la ficha",
  });
}

// --- Blog: portada opcional ------------------------------------------------
for (const slug of slugs("blog")) {
  const ext = alguna(`blog/${slug}`);
  filas.push({
    grupo: "Blog · portada",
    ruta: ext ? `blog/${slug}.${ext}` : `blog/${slug}.avif`,
    hay: Boolean(ext),
    obligatorio: false,
    nota: "aún sin uso en el diseño",
  });
}

// --- Salida ------------------------------------------------------------------
const ordenDeGrupos = [...new Set(filas.map((f) => f.grupo))];
filas.sort(
  (a, b) => ordenDeGrupos.indexOf(a.grupo) - ordenDeGrupos.indexOf(b.grupo),
);
let grupoAnterior = "";
for (const fila of filas) {
  if (fila.grupo !== grupoAnterior) {
    console.log(`\n${fila.grupo}`);
    grupoAnterior = fila.grupo;
  }
  const marca = fila.hay ? "✓" : fila.obligatorio ? "✗" : "·";
  const etiqueta = fila.hay ? "" : fila.obligatorio ? "FALTA  " : "opcional ";
  console.log(
    `  ${marca} public/${fila.ruta.padEnd(40)} ${etiqueta}${fila.nota}`,
  );
}

const faltan = filas.filter((f) => f.obligatorio && !f.hay);
const opcionales = filas.filter((f) => !f.obligatorio && !f.hay);
console.log(
  `\n${faltan.length} obligatorias por entregar · ${opcionales.length} opcionales sin usar\n`,
);
process.exit(faltan.length > 0 ? 1 : 0);
