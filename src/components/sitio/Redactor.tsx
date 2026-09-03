"use client";

import { useState } from "react";

/**
 * Redacta el mensaje y lo entrega al cliente de correo del visitante.
 *
 * No es un formulario: no hay envío, no hay servidor y no hay clave de nadie
 * que pueda caducar. Por eso el botón dice «abrir el correo» y no «enviar»,
 * y por eso es un <a> de verdad —se puede abrir aparte o copiar la dirección—
 * en lugar de un botón con onClick.
 */

/** Los mailto largos se truncan solos en algunos clientes de escritorio. */
const LIMITE = 1200;

type Textos = {
  nombre: string;
  mensaje: string;
  marcador: string;
  abrir: string;
  sinCorreo: string;
  copiar: string;
  copiado: string;
};

export function Redactor({
  correo,
  textos,
}: {
  correo: string;
  textos: Textos;
}) {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [copiado, setCopiado] = useState(false);

  const firma = nombre.trim();
  const cuerpo = firma ? `${mensaje.trim()}\n\n— ${firma}` : mensaje.trim();
  const asunto = firma ? `4XL — ${firma}` : "4XL";
  const enlace = `mailto:${correo}?subject=${encodeURIComponent(
    asunto,
  )}&body=${encodeURIComponent(cuerpo)}`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(cuerpo);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* Sin portapapeles el texto sigue a la vista para copiarlo a mano. */
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="nombre"
          className="font-bold text-[11px] uppercase tracking-[0.12em]"
        >
          {textos.nombre}
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          maxLength={80}
          autoComplete="name"
          className="border-[3px] border-tinta bg-papel px-4 py-3 text-base outline-none focus-visible:bg-lima"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="mensaje"
          className="font-bold text-[11px] uppercase tracking-[0.12em]"
        >
          {textos.mensaje}
        </label>
        <textarea
          id="mensaje"
          value={mensaje}
          onChange={(evento) => setMensaje(evento.target.value)}
          rows={6}
          maxLength={LIMITE}
          placeholder={textos.marcador}
          className="resize-y border-[3px] border-tinta bg-papel px-4 py-3 text-base outline-none placeholder:text-tinta/45 focus-visible:bg-lima"
        />
        {/* El tope avisa antes de llegar, para que nadie pierda una frase. */}
        {mensaje.length > LIMITE - 200 ? (
          <span className="self-end font-hand text-base">
            {mensaje.length}/{LIMITE}
          </span>
        ) : null}
      </div>

      <a
        href={enlace}
        className="w-fit bg-tinta px-6 py-4 font-display text-base text-lima transition-transform hover:-rotate-1 sm:text-lg"
      >
        {textos.abrir} →
      </a>

      {/* No hay forma fiable de saber si el correo abrió, así que la salida
          alternativa está siempre a la vista en vez de aparecer al fallar. */}
      <p className="text-sm leading-snug">
        {textos.sinCorreo}{" "}
        <a href={`mailto:${correo}`} className="font-bold underline">
          {correo}
        </a>
        .{" "}
        <button
          type="button"
          onClick={copiar}
          className="font-bold underline underline-offset-2"
        >
          {copiado ? textos.copiado : textos.copiar}
        </button>
      </p>
    </div>
  );
}
