import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Bocadillo } from "@/components/manga/Bocadillo";
import { CajaNarracion } from "@/components/manga/CajaNarracion";
import { costura } from "@/components/manga/formas";
import { Hoja } from "@/components/manga/Hoja";
import { Panel } from "@/components/manga/Panel";
import { Sfx } from "@/components/manga/Sfx";
import { componentesMdx } from "@/components/mdx/componentes";
import { Redactor } from "@/components/sitio/Redactor";
import { obtenerContacto } from "@/lib/contacto";
import { metadatosDe } from "@/lib/metadatos";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return metadatosDe({
    href: "/contacto",
    locale,
    descripcion: t("meta.contacto"),
  });
}

export default async function Contacto({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const contacto = await obtenerContacto(locale);
  if (!contacto) notFound();

  const [portada, cuerpo] = costura(8);

  return (
    /* La única página a color del sitio: la hoja entera es lima. */
    <div className="mx-auto max-w-[920px] px-2 pb-16">
      <Hoja className="bg-lima">
        <div className="flex flex-col gap-canal">
          <Panel
            forma={portada}
            fondo="tinta"
            className="relative flex min-h-[200px] flex-col justify-end p-6 sm:min-h-[240px] sm:p-8"
          >
            <CajaNarracion
              fondo="tinta"
              className="absolute top-5 left-5 border-lima text-lima sm:top-6 sm:left-6"
            >
              {t("nav.contacto")}
            </CajaNarracion>

            <Sfx
              variante="papel"
              rotacion={9}
              className="absolute top-6 right-6 text-4xl sm:text-5xl"
            >
              {t("sfx.alFin")}
            </Sfx>

            <h1 className="font-display text-4xl text-lima leading-none sm:text-5xl">
              {contacto.titulo}
            </h1>
            <p className="mt-3 max-w-[46ch] text-base text-papel sm:text-lg">
              {contacto.entradilla}
            </p>
          </Panel>

          <div className="flex flex-col gap-canal lg:flex-row">
            {/* El bloc: redacta el mensaje y lo pasa al correo */}
            <Panel
              forma={cuerpo}
              className="flex-[1.4] p-6 pt-12 sm:p-8 sm:pt-16"
            >
              <div className="mb-6 max-w-[58ch]">
                <MDXRemote
                  source={contacto.contenido}
                  components={componentesMdx}
                  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                />
              </div>

              <Redactor
                correo={contacto.correo}
                textos={{
                  nombre: t("contacto.nombre"),
                  mensaje: t("contacto.mensaje"),
                  marcador: t("contacto.marcador"),
                  abrir: t("contacto.abrir"),
                  sinCorreo: t("contacto.sinCorreo"),
                  copiar: t("contacto.copiar"),
                  copiado: t("contacto.copiado"),
                }}
              />
            </Panel>

            {/* Los canales directos: un enlace funciona siempre, sin depender
                del cliente de correo. Por eso van al mismo nivel y no debajo. */}
            <div className="flex flex-1 flex-col gap-canal">
              <CajaNarracion fondo="tinta" className="self-start">
                {t("contacto.directo")}
              </CajaNarracion>

              {contacto.canales.map((canal) => (
                <a
                  key={canal.nombre}
                  href={canal.url}
                  {...(canal.url.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group block"
                >
                  <Panel className="flex flex-col gap-1 p-5 transition-colors group-hover:bg-tinta group-hover:text-lima">
                    <span className="font-bold text-[11px] uppercase tracking-[0.12em]">
                      {canal.nombre}
                    </span>
                    <span className="break-all font-display text-lg leading-tight">
                      {canal.valor}
                    </span>
                  </Panel>
                </a>
              ))}

              <Bocadillo
                cola="arriba-derecha"
                fondo="tinta"
                className="mt-2 hidden h-[150px] w-full text-papel text-sm lg:block"
              >
                {t("contacto.bocadillo")}
              </Bocadillo>
            </div>
          </div>
        </div>
      </Hoja>
    </div>
  );
}
