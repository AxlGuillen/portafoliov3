import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { routing } from "@/i18n/routing";

const raiz = path.join(process.cwd(), "content");

/**
 * Los datos que toda ficha de proyecto debe traer.
 *
 * Se valida al leer y no al pintar: si a un MDX le falta un campo, el fallo
 * sale en la compilación con el nombre del archivo, no en blanco en la página.
 */
const Ficha = z.object({
  titulo: z.string(),
  subtitulo: z.string(),
  resumen: z.string(),
  cliente: z.string().optional(),
  tipo: z.enum(["aplicacion", "herramienta", "sitio"]),
  periodo: z.string(),
  stack: z.array(z.string()),
  enlace: z.string().optional(),
  repo: z.string().optional(),
  destacado: z.boolean().optional().default(false),
  orden: z.number(),
});

export type Ficha = z.infer<typeof Ficha>;

export type Proyecto = Ficha & {
  slug: string;
  /** Captura de portada, si existe `public/proyectos/<slug>.(jpg|png)`. */
  portada: string | null;
  /** Falso cuando este idioma aún no tiene traducción y se sirve el original. */
  traducido: boolean;
};

export type ProyectoCompleto = Proyecto & { contenido: string };

function carpeta(locale: string) {
  return path.join(raiz, locale, "proyectos");
}

/**
 * Busca la captura de portada por convención: `public/proyectos/<slug>.jpg`.
 * Se descubre en vez de declararse para que soltar el archivo baste, sin tener
 * que acordarse de tocar tambien el frontmatter.
 */
async function buscarPortada(slug: string) {
  for (const ext of ["jpg", "png", "avif", "webp"]) {
    const relativa = `/proyectos/${slug}.${ext}`;
    try {
      await fs.access(path.join(process.cwd(), "public", relativa));
      return relativa;
    } catch {
      // Probamos la siguiente extensión.
    }
  }
  return null;
}

async function leerArchivo(locale: string, slug: string) {
  try {
    const crudo = await fs.readFile(
      path.join(carpeta(locale), `${slug}.mdx`),
      "utf8",
    );
    return matter(crudo);
  } catch {
    return null;
  }
}

/**
 * Lee un proyecto en el idioma pedido y, si aún no está traducido, cae al
 * idioma por defecto. Es preferible servir el caso en español que dejar la
 * ruta inglesa vacía; `traducido` permite avisarlo en la interfaz.
 */
export async function obtenerProyecto(
  locale: string,
  slug: string,
): Promise<ProyectoCompleto | null> {
  const propio = await leerArchivo(locale, slug);
  const archivo = propio ?? (await leerArchivo(routing.defaultLocale, slug));
  if (!archivo) return null;

  const ficha = Ficha.safeParse(archivo.data);
  if (!ficha.success) {
    throw new Error(
      `Ficha inválida en ${slug}.mdx: ${ficha.error.issues
        .map((i) => `${i.path.join(".")} ${i.message}`)
        .join("; ")}`,
    );
  }

  return {
    ...ficha.data,
    slug,
    portada: await buscarPortada(slug),
    traducido: propio !== null,
    contenido: archivo.content,
  };
}

export async function listarProyectos(locale: string): Promise<Proyecto[]> {
  const nombres = new Set<string>();
  for (const idioma of [locale, routing.defaultLocale]) {
    try {
      const archivos = await fs.readdir(carpeta(idioma));
      for (const archivo of archivos) {
        if (archivo.endsWith(".mdx"))
          nombres.add(archivo.replace(/\.mdx$/, ""));
      }
    } catch {
      // Un idioma sin carpeta de contenido no es un error: aún no tiene casos.
    }
  }

  const proyectos = await Promise.all(
    [...nombres].map((slug) => obtenerProyecto(locale, slug)),
  );

  return proyectos
    .filter((p): p is ProyectoCompleto => p !== null)
    .map(({ contenido: _contenido, ...resto }) => resto)
    .sort((a, b) => a.orden - b.orden);
}

export async function proyectoDestacado(locale: string) {
  const proyectos = await listarProyectos(locale);
  return proyectos.find((p) => p.destacado) ?? proyectos[0] ?? null;
}

export async function slugsDeProyectos(): Promise<string[]> {
  const todos = new Set<string>();
  for (const locale of routing.locales) {
    try {
      const archivos = await fs.readdir(carpeta(locale));
      for (const archivo of archivos) {
        if (archivo.endsWith(".mdx")) todos.add(archivo.replace(/\.mdx$/, ""));
      }
    } catch {
      // Idioma sin contenido propio.
    }
  }
  return [...todos];
}
