import { ImageResponse } from "next/og";

export const alt = "Axl Guillen — 4XL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const lemas: Record<string, string> = {
  es: "Historias dibujadas en código",
  en: "Stories drawn in code",
};

const roles: Record<string, string> = {
  es: "Desarrollador",
  en: "Developer",
};

/**
 * La tarjeta que se ve al compartir el enlace en redes o mensajería.
 *
 * Se dibuja aquí en vez de guardarse como archivo para que no se desincronice
 * de la marca. Sin `clip-path`: el generador de imágenes no lo soporta, así que
 * la diagonal se hace con un bloque girado.
 */
export default async function Imagen({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lema = lemas[locale] ?? lemas.es;
  const rol = roles[locale] ?? roles.es;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#111111",
        position: "relative",
        overflow: "hidden",
        padding: "0 80px",
      }}
    >
      {/* La diagonal de tinta: el corte que separa dos viñetas. */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -260,
          width: 620,
          height: 900,
          background: "#ffffff",
          opacity: 0.06,
          transform: "rotate(18deg)",
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: se rasteriza a PNG; el texto alternativo va en el export `alt` */}
        <svg viewBox="0 0 120 120" width="104" height="104">
          <rect width="120" height="120" rx="27" fill="#ffffff" />
          <g fill="#111111" transform="translate(8,14)">
            <path d="M0 52 H104 V66 H0 Z" />
            <path d="M66 0 H80 V78 H104 V92 H66 V20 L26 60 H6 Z" />
          </g>
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 8,
            color: "#ffffff",
            textTransform: "uppercase",
          }}
        >
          {rol}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 40,
          fontSize: 118,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: -3,
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex" }}>AXL</div>
        <div style={{ display: "flex" }}>GUILLEN</div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 44,
          alignSelf: "flex-start",
          background: "#ffffff",
          color: "#111111",
          padding: "16px 28px",
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        {lema}
      </div>
    </div>,
    size,
  );
}
