import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Nav } from "@/components/sitio/Nav";

export default async function SitioLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Debe llamarse en cada layout y página, no solo en el raíz: si falta aquí,
  // el Nav lee traducciones antes de tiempo y la ruta pasa a dinámica.
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      {/* El hueco inferior deja sitio a la barra fija de móvil. */}
      <main className="pb-24 sm:pb-0">{children}</main>
    </>
  );
}
