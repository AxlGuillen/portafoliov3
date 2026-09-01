import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

type Ruta = Parameters<typeof getPathname>[0]["href"];

/**
 * Construye los metadatos de una página, con su canónica y los `hreflang` de
 * todos los idiomas.
 *
 * Se centraliza aquí porque los enlaces alternos son lo que le dice al buscador
 * que /es/proyectos y /en/projects son la misma página y no contenido
 * duplicado — y repetir eso a mano en cada ruta es garantía de olvidarlo.
 */
export async function metadatosDe({
  href,
  locale,
  titulo,
  descripcion,
}: {
  href: Ruta;
  locale: string;
  titulo?: string;
  descripcion: string;
}): Promise<Metadata> {
  const pares = await Promise.all(
    routing.locales.map(
      async (idioma) =>
        [
          idioma,
          siteUrl + (await getPathname({ locale: idioma, href })),
        ] as const,
    ),
  );

  const languages = Object.fromEntries(pares);
  const canonica = languages[locale] ?? languages[routing.defaultLocale];

  return {
    ...(titulo ? { title: titulo } : {}),
    description: descripcion,
    alternates: {
      canonical: canonica,
      languages,
    },
    openGraph: {
      ...(titulo ? { title: titulo } : {}),
      description: descripcion,
      url: canonica,
      siteName: "4XL",
      locale,
      type: "website",
      // Se referencia a mano: al declarar `openGraph` en la propia página,
      // Next deja de añadir sola la imagen del archivo de convención.
      images: [
        {
          url: `${siteUrl}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Axl Guillen — 4XL",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      ...(titulo ? { title: titulo } : {}),
      description: descripcion,
      images: [`${siteUrl}/${locale}/opengraph-image`],
    },
  };
}
