import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { routing } from "@/i18n/routing";

const raiz = path.join(process.cwd(), "content");

const Perfil = z.object({
  nombre: z.string(),
  rol: z.string(),
  ubicacion: z.string(),
  estudios: z.string(),
  resumen: z.string(),
  /** El empleo. Es el dato principal para quien recluta y no puede faltar. */
  trabajo: z.object({
    empresa: z.string(),
    puesto: z.string(),
    desde: z.string(),
    texto: z.string(),
  }),
  /**
   * La trayectoria por etapas y no por fechas: cuenta cómo crecio el alcance
   * —de paginas a procesos a herramientas a infraestructura— que es lo que un
   * listado de años no dice.
   */
  etapas: z.array(
    z.object({
      momento: z.string(),
      titulo: z.string(),
      texto: z.string(),
    }),
  ),
  /** Cifras comprobables. Cuatro, por la regla del 4. */
  cifras: z.array(z.object({ valor: z.string(), etiqueta: z.string() })),
  /** Tecnología con el número de proyectos detrás, en vez de porcentajes. */
  stack: z.array(z.object({ nombre: z.string(), proyectos: z.number() })),
  certificaciones: z
    .array(
      z.object({
        nombre: z.string(),
        emisor: z.string(),
        anio: z.number(),
        credencial: z.string().optional(),
      }),
    )
    .default([]),
});

export type Perfil = z.infer<typeof Perfil> & {
  contenido: string;
  traducido: boolean;
};

async function leerArchivo(locale: string) {
  try {
    const crudo = await fs.readFile(
      path.join(raiz, locale, "sobre-mi.mdx"),
      "utf8",
    );
    return matter(crudo);
  } catch {
    return null;
  }
}

export async function obtenerPerfil(locale: string): Promise<Perfil | null> {
  const propio = await leerArchivo(locale);
  const archivo = propio ?? (await leerArchivo(routing.defaultLocale));
  if (!archivo) return null;

  const perfil = Perfil.safeParse(archivo.data);
  if (!perfil.success) {
    throw new Error(
      `Perfil inválido en sobre-mi.mdx: ${perfil.error.issues
        .map((i) => `${i.path.join(".")} ${i.message}`)
        .join("; ")}`,
    );
  }

  return {
    ...perfil.data,
    contenido: archivo.content,
    traducido: propio !== null,
  };
}
