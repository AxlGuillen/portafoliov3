import { defineRouting } from "next-intl/routing";

/**
 * Las claves son las rutas internas (las carpetas dentro de app/[locale]).
 * Los valores son las rutas públicas por idioma: los slugs se traducen,
 * no solo el texto, porque es lo que cuenta para posicionamiento.
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/proyectos": { es: "/proyectos", en: "/projects" },
    "/proyectos/[slug]": { es: "/proyectos/[slug]", en: "/projects/[slug]" },
    "/blog": { es: "/blog", en: "/blog" },
    "/blog/[slug]": { es: "/blog/[slug]", en: "/blog/[slug]" },
    "/sobre-mi": { es: "/sobre-mi", en: "/about" },
    "/sobre-mi/certificaciones": {
      es: "/sobre-mi/certificaciones",
      en: "/about/certifications",
    },
    "/contacto": { es: "/contacto", en: "/contact" },
  },
});

export type Locale = (typeof routing.locales)[number];
