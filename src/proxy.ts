import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// En Next.js 16 este archivo se llama proxy.ts (antes middleware.ts).
export default createMiddleware(routing);

export const config = {
  // Todo salvo API, internos de Next y archivos con extensión.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
