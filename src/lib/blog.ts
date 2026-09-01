import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import tiempoDeLectura from "reading-time";
import { z } from "zod";
import { routing } from "@/i18n/routing";

const raiz = path.join(process.cwd(), "content");

const Cabecera = z.object({
  titulo: z.string(),
  resumen: z.string(),
  /** ISO `YYYY-MM-DD`. Ordena el archivo, del más reciente al más antiguo. */
  fecha: z.string(),
  tema: z.string(),
});

export type Articulo = z.infer<typeof Cabecera> & {
  slug: string;
  /** Minutos de lectura, calculados del texto y no declarados a mano. */
  minutos: number;
  /** Falso cuando este idioma aún no tiene traducción y se sirve el original. */
  traducido: boolean;
};

export type ArticuloCompleto = Articulo & { contenido: string };

function carpeta(locale: string) {
  return path.join(raiz, locale, "blog");
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

export async function obtenerArticulo(
  locale: string,
  slug: string,
): Promise<ArticuloCompleto | null> {
  const propio = await leerArchivo(locale, slug);
  const archivo = propio ?? (await leerArchivo(routing.defaultLocale, slug));
  if (!archivo) return null;

  const cabecera = Cabecera.safeParse(archivo.data);
  if (!cabecera.success) {
    throw new Error(
      `Cabecera inválida en ${slug}.mdx: ${cabecera.error.issues
        .map((i) => `${i.path.join(".")} ${i.message}`)
        .join("; ")}`,
    );
  }

  return {
    ...cabecera.data,
    slug,
    minutos: Math.max(1, Math.round(tiempoDeLectura(archivo.content).minutes)),
    traducido: propio !== null,
    contenido: archivo.content,
  };
}

async function nombresEn(idiomas: readonly string[]) {
  const nombres = new Set<string>();
  for (const idioma of idiomas) {
    try {
      const archivos = await fs.readdir(carpeta(idioma));
      for (const archivo of archivos) {
        if (archivo.endsWith(".mdx"))
          nombres.add(archivo.replace(/\.mdx$/, ""));
      }
    } catch {
      // Un idioma sin carpeta de blog no es un error: aún no tiene artículos.
    }
  }
  return [...nombres];
}

export async function listarArticulos(locale: string): Promise<Articulo[]> {
  const nombres = await nombresEn([locale, routing.defaultLocale]);
  const articulos = await Promise.all(
    nombres.map((slug) => obtenerArticulo(locale, slug)),
  );

  return articulos
    .filter((a): a is ArticuloCompleto => a !== null)
    .map(({ contenido: _contenido, ...resto }) => resto)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function slugsDeArticulos() {
  return nombresEn(routing.locales);
}
