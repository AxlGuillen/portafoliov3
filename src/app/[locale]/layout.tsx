import type { Metadata } from "next";
import { Archivo_Black, Gochi_Hand, Karla } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-src",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla-src",
  display: "swap",
});

const gochi = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gochi-src",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Solo existen los idiomas de `generateStaticParams`; cualquier otro valor
 * del segmento es 404 sin renderizar nada. Hace falta porque las rutas con
 * punto (/favicon.ico, /apple-touch-icon.png) no pasan por el proxy de
 * idiomas y llegan aquí con `locale = "favicon.ico"`; el `notFound()` de
 * abajo no basta, porque la página se renderiza en paralelo al layout y
 * `Intl.DateTimeFormat("favicon.ico")` reventaba antes con un RangeError.
 */
export const dynamicParams = false;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Axl Guillen — 4XL",
    template: "%s — 4XL",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Habilita el renderizado estático de este segmento.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${karla.variable} ${gochi.variable}`}
    >
      <body className="antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
