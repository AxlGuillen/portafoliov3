import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "@/components/marca/Logo";
import { Link } from "@/i18n/navigation";

/** Barra funcional sobre el fondo del lector. Cuatro rutas, ni una más. */
export async function Nav() {
  const t = await getTranslations();
  const locale = await getLocale();
  const otro = locale === "es" ? "en" : "es";

  const enlaces = [
    { href: "/proyectos", texto: t("nav.proyectos") },
    { href: "/blog", texto: t("nav.blog") },
    { href: "/sobre-mi", texto: t("nav.sobreMi") },
  ] as const;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-12">
      <Link href="/" className="flex items-center gap-3 text-papel">
        <Logo size={40} />
        <span className="font-display text-lg tracking-wide">4XL</span>
      </Link>

      <nav className="flex flex-wrap items-center gap-6">
        {enlaces.map((enlace) => (
          <Link
            key={enlace.href}
            href={enlace.href}
            className="py-2 font-bold text-papel text-sm transition-colors hover:text-lima"
          >
            {enlace.texto}
          </Link>
        ))}
        <Link
          href="/contacto"
          className="bg-papel px-4 py-2.5 font-bold text-sm text-tinta transition-colors hover:bg-lima"
        >
          {t("nav.contacto")}
        </Link>
        <Link
          href="/"
          locale={otro}
          className="border-2 border-papel/40 px-3 py-2 font-bold text-papel/70 text-xs uppercase tracking-widest transition-colors hover:border-lima hover:text-lima"
        >
          {t("comun.cambiarIdioma")}
        </Link>
      </nav>
    </header>
  );
}
