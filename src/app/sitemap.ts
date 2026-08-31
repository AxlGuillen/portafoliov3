import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

/** Las rutas fijas. Los casos y artículos se añadirán al leer el MDX. */
const rutas = [
  "/",
  "/proyectos",
  "/blog",
  "/sobre-mi",
  "/sobre-mi/certificaciones",
  "/contacto",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return Promise.all(
    rutas.map(async (href) => {
      // Cada ruta se declara en los dos idiomas con su slug traducido:
      // es lo que le dice al buscador que son la misma página, no duplicados.
      const pares = await Promise.all(
        routing.locales.map(
          async (locale) =>
            [locale, siteUrl + (await getPathname({ locale, href }))] as const,
        ),
      );

      const languages = Object.fromEntries(pares);

      return {
        url: languages[routing.defaultLocale],
        alternates: { languages },
      };
    }),
  );
}
