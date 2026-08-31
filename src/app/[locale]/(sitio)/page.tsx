import { getTranslations, setRequestLocale } from "next-intl/server";
import { Bocadillo } from "@/components/manga/Bocadillo";
import { CajaNarracion } from "@/components/manga/CajaNarracion";
import { costura } from "@/components/manga/formas";
import { Panel } from "@/components/manga/Panel";
import { Sfx } from "@/components/manga/Sfx";
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
            <CajaNarracion>{t("inicio.rol")} — 2026</CajaNarracion>

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

            <Sfx rotacion={9} className="absolute top-6 right-10 text-6xl">
              ¡TAK!
            </Sfx>

            <Bocadillo
              cola="abajo-izquierda"
              className="absolute right-8 bottom-10 h-[150px] w-[190px] text-sm"
            >
              ¿LISTO? PASA LA PÁGINA.
            </Bocadillo>
          </Panel>

          <Panel
            as="section"
            forma={destacado}
            trama="puntos"
            className="h-[420px] p-8"
          >
            <Sfx variante="papel" rotacion={-5} className="text-5xl">
              ¡ZUUM!
            </Sfx>

            <div className="mt-20 max-w-sm border-[3px] border-tinta border-dashed bg-papel/90 p-4 text-center">
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

            <Bocadillo
              tipo="grito"
              fondo="tinta"
              className="absolute top-8 right-8 h-[170px] w-[170px] text-lg"
            >
              ¡EL CASO 04!
            </Bocadillo>

            <CajaNarracion
              variante="narracion"
              fondo="tinta"
              className="absolute right-8 bottom-8 max-w-xs"
            >
              Cada viñeta lleva a su sección.
            </CajaNarracion>
          </Panel>
        </div>

        <p className="mt-3 text-center font-bold text-tinta/55 text-xs tracking-[0.16em]">
          — 1 / 4 —
        </p>
      </div>
    </div>
  );
}
