import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // El arte a línea sufre con JPEG: AVIF y WebP conservan el trazo limpio.
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
