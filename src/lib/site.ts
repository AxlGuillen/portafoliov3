/**
 * URL pública del sitio, sin barra final.
 * Se define en NEXT_PUBLIC_SITE_URL (ver .env.example). En local cae a
 * localhost para que los metadatos, el sitemap y robots.txt sean coherentes.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";
