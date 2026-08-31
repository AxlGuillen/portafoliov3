import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "@/components/marca/Logo";
import { Link } from "@/i18n/navigation";

/**
 * Navegación. Cuatro rutas, ni una más.
 *
 * En escritorio va arriba, como el encabezado de un tomo. En móvil las cuatro
 * rutas bajan a una barra fija: apiladas arriba se partían en varias líneas y
 * empujaban la primera viñeta fuera de la pantalla.
 */
export async function Nav() {
  const t = await getTranslations();
  const locale = await getLocale();
  const otro = locale === "es" ? "en" : "es";

  const rutas = [
    { href: "/proyectos", texto: t("nav.proyectos") },
    { href: "/blog", texto: t("nav.blog") },
    { href: "/sobre-mi", texto: t("nav.sobreMi") },
    { href: "/contacto", texto: t("nav.contacto") },
  ] as const;

  return (
    <>
      <header className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
        <Link href="/" className="flex items-center gap-3 text-papel">
          <Logo size={38} />
          <span className="font-display text-lg tracking-wide">4XL</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 sm:flex">
            {rutas.slice(0, 3).map((ruta) => (
              <Link
                key={ruta.href}
                href={ruta.href}
                className="py-2 font-bold text-papel text-sm transition-colors hover:text-lima"
              >
                {ruta.texto}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="bg-papel px-4 py-2.5 font-bold text-sm text-tinta transition-colors hover:bg-lima"
            >
              {t("nav.contacto")}
            </Link>
          </nav>

          <Link
            href="/"
            locale={otro}
            className="border-2 border-papel/40 px-3 py-2 font-bold text-papel/70 text-xs uppercase tracking-widest transition-colors hover:border-lima hover:text-lima"
          >
            {t("comun.cambiarIdioma")}
          </Link>
        </div>
      </header>

      {/* Barra inferior fija: la navegación real en móvil. */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-papel border-t-[3px] bg-tinta sm:hidden">
        {rutas.map((ruta, indice) => (
          <Link
            key={ruta.href}
            href={ruta.href}
            className={`px-1 py-4 text-center font-bold text-[11px] text-papel ${
              indice > 0 ? "border-papel/25 border-l-2" : ""
            } ${indice === 3 ? "text-lima" : ""}`}
          >
            {ruta.texto}
          </Link>
        ))}
      </nav>
    </>
  );
}
