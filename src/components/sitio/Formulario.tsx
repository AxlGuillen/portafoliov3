"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  type EstadoEnvio,
  enviarMensaje,
} from "@/app/[locale]/(sitio)/contacto/acciones";

type Textos = {
  nombre: string;
  correo: string;
  mensaje: string;
  marcador: string;
  enviar: string;
  enviando: string;
};

const inicial: EstadoEnvio = { estado: "inicial" };

function Boton({ textos }: { textos: Textos }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit bg-tinta px-6 py-4 font-display text-base text-lima transition-transform hover:-rotate-1 disabled:opacity-60 sm:text-lg"
    >
      {pending ? textos.enviando : `${textos.enviar} →`}
    </button>
  );
}

export function Formulario({
  locale,
  textos,
}: {
  locale: string;
  textos: Textos;
}) {
  const [estado, accion] = useActionState(enviarMensaje, inicial);

  return (
    <form action={accion} className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />

      {/* Trampa para bots: oculta a la vista y al lector de pantalla. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          name="telefono"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="nombre"
          className="font-bold text-[11px] uppercase tracking-[0.12em]"
        >
          {textos.nombre}
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          maxLength={80}
          autoComplete="name"
          className="border-[3px] border-tinta bg-papel px-4 py-3 text-base outline-none focus-visible:bg-lima"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="correo"
          className="font-bold text-[11px] uppercase tracking-[0.12em]"
        >
          {textos.correo}
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          required
          autoComplete="email"
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
          name="mensaje"
          required
          rows={6}
          minLength={10}
          maxLength={4000}
          placeholder={textos.marcador}
          className="resize-y border-[3px] border-tinta bg-papel px-4 py-3 text-base outline-none placeholder:text-tinta/45 focus-visible:bg-lima"
        />
      </div>

      <Boton textos={textos} />

      {/* <output> ya anuncia el resultado a los lectores de pantalla. */}
      {estado.estado === "inicial" ? null : (
        <output
          className={`border-[3px] border-tinta px-4 py-3 font-bold text-sm ${
            estado.estado === "enviado"
              ? "bg-tinta text-lima"
              : "bg-papel text-tinta"
          }`}
        >
          {estado.mensaje}
        </output>
      )}
    </form>
  );
}
