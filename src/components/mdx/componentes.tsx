import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Cómo se dibuja el texto de un caso dentro de la hoja de papel.
 *
 * Se define aquí y no con un plugin de tipografía para que la prosa use el
 * mismo vocabulario que el resto de la página: los títulos son rótulos de
 * tinta, no encabezados genéricos.
 */
export const componentesMdx: MDXComponents = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-12 mb-5 inline-block bg-tinta px-4 py-2 font-display text-2xl text-papel tracking-wide first:mt-0 sm:text-3xl"
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-8 mb-3 font-bold text-lg uppercase tracking-wider"
      {...props}
    >
      {children}
    </h3>
  ),

  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-5 max-w-[62ch] text-base leading-relaxed" {...props}>
      {children}
    </p>
  ),

  strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-bold" {...props}>
      {children}
    </strong>
  ),

  em: ({ children, ...props }: ComponentPropsWithoutRef<"em">) => (
    <em className="font-hand text-lg not-italic" {...props}>
      {children}
    </em>
  ),

  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="mb-5 max-w-[62ch] list-disc space-y-2 pl-6 leading-relaxed marker:text-tinta"
      {...props}
    >
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mb-5 max-w-[62ch] list-decimal space-y-2 pl-6 leading-relaxed marker:font-bold"
      {...props}
    >
      {children}
    </ol>
  ),

  a: ({ children, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:bg-lima"
      {...props}
    >
      {children}
    </a>
  ),

  /* El diagrama de flujo de un caso: bloque de tinta, ancho completo. */
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="mb-6 overflow-x-auto border-[3px] border-tinta bg-tinta p-5 font-mono text-papel text-xs leading-relaxed sm:text-sm"
      {...props}
    >
      {children}
    </pre>
  ),

  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => (
    <code className="font-mono text-[0.92em]" {...props}>
      {children}
    </code>
  ),

  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-10 border-tinta border-t-[3px]" {...props} />
  ),
};
