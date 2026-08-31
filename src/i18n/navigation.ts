import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Usa SIEMPRE este Link, no el de next/link: es el que traduce el slug
 * al idioma activo. Con rutas dinámicas el href va en forma de objeto:
 * <Link href={{ pathname: "/proyectos/[slug]", params: { slug } }}>
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
