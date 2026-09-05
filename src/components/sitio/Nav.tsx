import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "@/components/marca/Logo";
import { BarraPegajosa } from "@/components/sitio/BarraPegajosa";
import { EnlaceNav } from "@/components/sitio/EnlaceNav";
import { Indicador } from "@/components/sitio/Indicador";
import { Link } from "@/i18n/navigation";

/**
 * Navegación. Cuatro rutas, ni una más.
 *
 * Se alinea con la columna de la historieta (920px), no con el viewport: si no,
 * el logo queda flotando lejos del papel y la barra parece de otra página.
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
      <BarraPegajosa>
        <header className="mx-auto flex max-w-[920px] items-center justify-between gap-4 px-2 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-3 text-papel">
            <Logo size={38} />
            <span className="font-display text-lg tracking-wide">4XL</span>
          </Link>

          {/* El rótulo de capítulo va en el hueco entre logo y menú, no
              centrado sobre la cabecera: así nunca se solapa con el menú. */}
          <div className="hidden min-w-0 flex-1 justify-center min-[400px]:flex">
            <Indicador />
          </div>

          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-5 sm:flex">
              {rutas.slice(0, 3).map((ruta) => (
                <EnlaceNav
                  key={ruta.href}
                  href={ruta.href}
                  className="py-2 font-bold text-papel text-sm transition-colors hover:text-lima"
                  activo="underline decoration-[3px] underline-offset-[7px]"
                >
                  {ruta.texto}
                </EnlaceNav>
              ))}
              {/* En contacto, la única sección a color, el botón se pone lima. */}
              <EnlaceNav
                href="/contacto"
                className="bg-papel px-4 py-2.5 font-bold text-sm text-tinta transition-colors hover:bg-lima"
                activo="bg-lima"
              >
                {t("nav.contacto")}
              </EnlaceNav>
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
      </BarraPegajosa>

      {/* Barra inferior fija: la navegación real en móvil. */}
      <nav
        style={{ viewTransitionName: "barra-movil" }}
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-papel border-t-[3px] bg-tinta sm:hidden"
      >
        {rutas.map((ruta, indice) => (
          <EnlaceNav
            key={ruta.href}
            href={ruta.href}
            className={`px-1 py-4 text-center font-bold text-[11px] ${
              indice > 0 ? "border-papel/25 border-l-2" : ""
            } ${indice === 3 ? "text-lima" : "text-papel"}`}
            activo={indice === 3 ? "bg-lima text-tinta" : "bg-papel text-tinta"}
          >
            {ruta.texto}
          </EnlaceNav>
        ))}
      </nav>
    </>
  );
}
