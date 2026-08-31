import { getTranslations, setRequestLocale } from "next-intl/server";
import { Logo } from "@/components/marca/Logo";

type Props = { params: Promise<{ locale: string }> };

export default async function Inicio({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-[920px] px-2 pb-16">
      {/* La hoja de manga sobre el fondo oscuro del lector. */}
      <div className="bg-papel p-2.5 shadow-[0_22px_60px_rgba(0,0,0,0.6)]">
        {/* Viñeta de apertura: el corte diagonal se hará con el componente
            Panel; por ahora esto sólo comprueba tramas, tipografías e idioma. */}
        <div className="trama-lineas relative border-[3.5px] border-tinta p-8">
          <p className="inline-block border-[3px] border-tinta bg-papel px-3 py-1.5 font-bold text-xs uppercase tracking-wider">
            {t("inicio.rol")} — 2026
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Logo size={96} trazo="#111111" />
            <h1 className="font-display text-6xl leading-none tracking-tight md:text-7xl">
              AXL
              <br />
              GUILLEN
            </h1>
          </div>

          <p className="mt-6 inline-block bg-tinta px-4 py-2 font-display text-lg text-papel">
            {t("inicio.lema")}
          </p>

          <p className="mt-6 max-w-md bg-papel/90 font-hand text-lg">
            Andamiaje listo. Aquí entra la primera página de manga.
          </p>
        </div>

        <p className="mt-3 text-center font-bold text-tinta/55 text-xs tracking-[0.16em]">
          — 1 / 4 —
        </p>
      </div>
    </div>
  );
}
