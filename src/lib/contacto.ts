import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { routing } from "@/i18n/routing";

const raiz = path.join(process.cwd(), "content");

const Contacto = z.object({
  titulo: z.string(),
  entradilla: z.string(),
  /** Dirección a la que redacta el botón del bloc. */
  correo: z.string(),
  /** Los canales directos. Un enlace funciona siempre, sin intermediarios. */
  canales: z.array(
    z.object({
      nombre: z.string(),
      valor: z.string(),
      url: z.string(),
    }),
  ),
});

export type Contacto = z.infer<typeof Contacto> & {
  contenido: string;
  traducido: boolean;
};

async function leerArchivo(locale: string) {
  try {
    const crudo = await fs.readFile(
      path.join(raiz, locale, "contacto.mdx"),
      "utf8",
    );
    return matter(crudo);
  } catch {
    return null;
  }
}

export async function obtenerContacto(
  locale: string,
): Promise<Contacto | null> {
  const propio = await leerArchivo(locale);
  const archivo = propio ?? (await leerArchivo(routing.defaultLocale));
  if (!archivo) return null;

  const datos = Contacto.safeParse(archivo.data);
  if (!datos.success) {
    throw new Error(
      `Contacto inválido en contacto.mdx: ${datos.error.issues
        .map((i) => `${i.path.join(".")} ${i.message}`)
        .join("; ")}`,
    );
  }

  return {
    ...datos.data,
    contenido: archivo.content,
    traducido: propio !== null,
  };
}
