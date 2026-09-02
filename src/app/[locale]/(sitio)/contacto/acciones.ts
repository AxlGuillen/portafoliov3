"use server";

import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import { z } from "zod";

const CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const Mensaje = z.object({
  nombre: z.string().trim().min(2).max(80),
  correo: z.string().trim().regex(CORREO),
  mensaje: z.string().trim().min(10).max(4000),
  /**
   * Trampa para bots: el campo va oculto y ninguna persona lo rellena.
   * Si llega con algo, se descarta sin decir por qué.
   */
  telefono: z.string().max(0),
});

export type EstadoEnvio = {
  estado: "inicial" | "enviado" | "error";
  mensaje?: string;
};

export async function enviarMensaje(
  _anterior: EstadoEnvio,
  datos: FormData,
): Promise<EstadoEnvio> {
  const locale = String(datos.get("locale") ?? "es");
  const t = await getTranslations({ locale });

  const analisis = Mensaje.safeParse({
    nombre: datos.get("nombre"),
    correo: datos.get("correo"),
    mensaje: datos.get("mensaje"),
    telefono: datos.get("telefono") ?? "",
  });

  if (!analisis.success) {
    // Al bot se le responde lo mismo que a un formulario mal llenado.
    return { estado: "error", mensaje: t("contacto.errorDatos") };
  }

  const clave = process.env.RESEND_API_KEY;
  const destino = process.env.CORREO_DESTINO;

  if (!clave || !destino) {
    return { estado: "error", mensaje: t("contacto.errorEnvio") };
  }

  const { nombre, correo, mensaje } = analisis.data;

  try {
    const resend = new Resend(clave);
    const { error } = await resend.emails.send({
      from: process.env.CORREO_REMITENTE ?? "4XL <onboarding@resend.dev>",
      to: destino,
      replyTo: correo,
      subject: `4XL — mensaje de ${nombre}`,
      text: `De: ${nombre} <${correo}>\n\n${mensaje}`,
    });

    if (error) {
      return { estado: "error", mensaje: t("contacto.errorEnvio") };
    }
  } catch {
    return { estado: "error", mensaje: t("contacto.errorEnvio") };
  }

  return { estado: "enviado", mensaje: t("contacto.gracias") };
}
