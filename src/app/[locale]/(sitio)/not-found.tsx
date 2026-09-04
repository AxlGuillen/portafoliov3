import fs from "node:fs/promises";
import path from "node:path";
import { getTranslations } from "next-intl/server";
import { Arte } from "@/components/manga/Arte";
import { CajaNarracion } from "@/components/manga/CajaNarracion";
import { corteArriba, costura } from "@/components/manga/formas";
import { Hoja } from "@/components/manga/Hoja";
import { Panel } from "@/components/manga/Panel";
import { Sfx } from "@/components/manga/Sfx";
import { Link } from "@/i18n/navigation";

const secciones = [
  { href: "/proyectos", clave: "nav.proyectos" },
  { href: "/blog", clave: "nav.blog" },
  { href: "/sobre-mi", clave: "nav.sobreMi" },
  { href: "/contacto", clave: "nav.contacto" },
] as const;

/**
 * Busca la ilustración por convención, igual que las portadas de proyecto:
 * soltar `public/vinetas/404-arriba.avif` basta para que aparezca. Mientras
 * no exista, la viñeta se pinta con trama y conserva su hueco.
 */
async function buscarVineta(nombre: string) {
  const relativa = `/vinetas/${nombre}.avif`;
  try {
    await fs.access(path.join(process.cwd(), "public", relativa));
    return relativa;
  } catch {
    return null;
  }
}

/** Solo en desarrollo: recuerda qué archivo llena el hueco. */
function Hueco({ nombre }: { nombre: string }) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <span className="absolute right-5 bottom-4 font-hand text-base text-tinta/60">
      public/vinetas/{nombre}.avif
    </span>
  );
}

export default async function NoEncontrada() {
  const t = await getTranslations();
  const [arriba, centro] = costura(8);
  const [arteArriba, arteAbajo] = await Promise.all([
    buscarVineta("404-arriba"),
    buscarVineta("404-abajo"),
  ]);

  return (
    <div className="mx-auto max-w-[920px] px-2 pb-16">
      <Hoja>
        <div className="flex flex-col gap-canal">
          {/* Viñeta superior: el hueco para la ilustración */}
          <Panel
            forma={arriba}
            trama={arteArriba ? undefined : "densa"}
            className="relative min-h-[240px] sm:min-h-[320px]"
          >
            {arteArriba ? (
              <Arte
                src={arteArriba}
                alt={t("noEncontrada.arteArriba")}
                prioridad
              />
            ) : (
              <Hueco nombre="404-arriba" />
            )}
            <CajaNarracion className="absolute top-5 left-5 sm:top-6 sm:left-6">
              {t("noEncontrada.etiqueta")}
            </CajaNarracion>
            <Sfx
              rotacion={7}
              className="absolute top-6 right-6 text-5xl sm:text-6xl"
            >
              {t("noEncontrada.sfx")}
            </Sfx>
          </Panel>

          {/* La explicación y las cuatro salidas */}
          <Panel forma={centro} className="p-6 pt-12 sm:p-8 sm:pt-16">
            <h1 className="font-display text-4xl leading-none sm:text-5xl">
              {t("noEncontrada.titulo")}
            </h1>
            <p className="mt-4 max-w-[52ch] text-base leading-snug sm:text-lg">
              {t("noEncontrada.texto")}
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-canal sm:grid-cols-4">
              {secciones.map((seccion) => (
                <li key={seccion.href}>
                  <Link href={seccion.href} className="group block">
                    <Panel className="p-4 transition-colors group-hover:bg-tinta group-hover:text-papel">
                      <span className="font-display text-lg leading-none">
                        {t(seccion.clave)} →
                      </span>
                    </Panel>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Viñeta inferior: el segundo hueco */}
          <Panel
            forma={corteArriba(6, "izquierda")}
            trama={arteAbajo ? undefined : "densa"}
            className="relative min-h-[200px] sm:min-h-[260px]"
          >
            {arteAbajo ? (
              <Arte src={arteAbajo} alt={t("noEncontrada.arteAbajo")} />
            ) : (
              <Hueco nombre="404-abajo" />
            )}
          </Panel>
        </div>
      </Hoja>
    </div>
  );
}
