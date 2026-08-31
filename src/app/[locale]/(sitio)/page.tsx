import { getTranslations, setRequestLocale } from "next-intl/server";
import { costura } from "@/components/manga/formas";
import { Panel } from "@/components/manga/Panel";
import { Logo } from "@/components/marca/Logo";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function Inicio({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // El corte pertenece a la costura entre las dos viñetas, no a una sola.
  // Ambas miden lo mismo, así que las diagonales salen paralelas.
  const [apertura, destacado] = costura(11);

  return (
    <div className="mx-auto max-w-[920px] px-2 pb-16">
      {/* La hoja de manga sobre el fondo oscuro del lector. */}
      <div className="bg-papel p-2.5 shadow-[0_22px_60px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-canal">
          <Panel
            as="section"
            forma={apertura}
            trama="lineas"
            className="h-[420px] p-8"
          >
            <p className="inline-block border-[3px] border-tinta bg-papel px-3 py-1.5 font-bold text-xs uppercase tracking-wider">
              {t("inicio.rol")} — 2026
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Logo size={88} />
              <h1 className="font-display text-6xl leading-none tracking-tight">
                AXL
                <br />
                GUILLEN
              </h1>
            </div>

            <p className="mt-6 inline-block bg-tinta px-4 py-2 font-display text-lg text-papel">
              {t("inicio.lema")}
            </p>
          </Panel>

          <Panel
            as="section"
            forma={destacado}
            trama="puntos"
            className="h-[420px] p-8"
          >
            <p className="rotate-[-5deg] font-display text-5xl text-papel [-webkit-text-stroke:2px_var(--color-tinta)]">
              ¡ZUUM!
            </p>

            <div className="mt-24 max-w-sm border-[3px] border-dashed border-tinta bg-papel/90 p-4 text-center">
              <span className="font-bold text-xs uppercase tracking-widest">
                Asset IA
              </span>
              <p className="mt-1 text-sm leading-snug">
                Contrapicado del proyecto destacado, mucho negro.
              </p>
            </div>

            <div className="mt-6 inline-flex items-center gap-4 border-[3px] border-tinta bg-papel px-4 py-3">
              <span className="font-bold">[Proyecto destacado]</span>
              <Link
                href="/proyectos"
                className="font-bold text-sm underline-offset-4 hover:underline"
              >
                {t("nav.proyectos")} →
              </Link>
            </div>
          </Panel>
        </div>

        <p className="mt-3 text-center font-bold text-tinta/55 text-xs tracking-[0.16em]">
          — 1 / 4 —
        </p>
      </div>
    </div>
  );
}
