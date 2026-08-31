import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

type Props = {
  titulo: string;
  ruta: string;
  /** La sección de contacto es la única a color. */
  color?: boolean;
};

/** Marcador temporal mientras se maqueta cada sección. */
export async function SeccionPendiente({ titulo, ruta, color = false }: Props) {
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-[920px] px-2 pb-16">
      <div
        className={cn(
          "p-2.5 shadow-[0_22px_60px_rgba(0,0,0,0.6)]",
          color ? "bg-lima" : "bg-papel",
        )}
      >
        <div
          className={cn(
            "border-[3.5px] border-tinta p-8",
            !color && "trama-puntos",
          )}
        >
          <p className="inline-block border-[3px] border-tinta bg-papel px-3 py-1.5 font-bold text-xs uppercase tracking-wider">
            {ruta}
          </p>
          <h1 className="mt-6 font-display text-5xl leading-none md:text-6xl">
            {titulo}
          </h1>
          <p className="mt-4 font-hand text-lg">{t("comun.porMaquetar")}</p>
        </div>
      </div>
    </div>
  );
}
