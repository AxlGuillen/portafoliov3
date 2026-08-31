<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portafolio 4XL

## Las dos reglas que gobiernan todo

1. **Temático**: la interfaz se lee como una página de manga en blanco y negro.
2. **Funcional**: cada sección tiene URL real, compartible e indexable.

Ninguna decisión sacrifica una por la otra. En la práctica: enlaces `<a>` de
verdad (nunca `div` con `onClick`), una URL canónica por contenido, el botón
atrás nunca expulsa del sitio, y `prefers-reduced-motion` se respeta siempre.

## Vocabulario

Las etiquetas visibles son **directas**: Proyectos, Blog, Sobre mí, Contacto,
Certificaciones. Nada de nombres temáticos que haya que descifrar ("el arco de
entrenamiento", "el personaje"). Lo temático lo aporta el dibujo, nunca las
palabras.

## La regla del 4

El logo es un 4 y "AXL" a la vez. El número es motivo recurrente: los lemas
clave tienen exactamente 4 palabras, las rejillas llevan un número de piezas
múltiplo de 4, y el cuarto elemento de cada serie recibe trato especial.
Al añadir contenido, respétalo donde salga natural; no lo fuerces.

## Color

Blanco y negro más tramas. La lima `--color-lima` **solo** aparece en estados
hover y en la sección de contacto. Si aparece en cualquier otro sitio, es un
error.

## Tramas

Se pintan en CSS (`trama-puntos`, `trama-densa`, `trama-lineas`,
`trama-velocidad`), nunca se hornean en la imagen. El arte generado trae solo
la línea: así pesa menos y no hace muaré al escalar.

## Rutas e idiomas

Importa `Link`, `redirect`, `useRouter` y `usePathname` desde `@/i18n/navigation`,
**no** desde `next/link` ni `next/navigation`: son los que traducen el slug.
Las rutas internas van en español (son los nombres de carpeta); la traducción
pública vive en `src/i18n/routing.ts`.

Toda página y todo layout deben llamar a `setRequestLocale(locale)` antes de
usar traducciones. Si falta en alguno, esa ruta deja de ser estática.

## Viñetas con corte diagonal

Ya resuelto en `src/components/manga/`. Usa `<Panel>`; no repitas la lógica:

```tsx
const [arriba, abajo] = costura(11);
<Panel forma={arriba} trama="lineas" className="h-[420px] p-8">…</Panel>
<Panel forma={abajo} trama="puntos" className="h-[420px] p-8">…</Panel>
```

Cómo funciona por dentro, por si hay que tocarlo: la caja de maquetación es
rectangular y la silueta se dibuja aparte. `clip-path` recorta fondo y
contenido, y un `<polygon>` SVG con `vector-effect="non-scaling-stroke"` pinta
el borde de tinta; ambos salen de la misma lista de puntos. El trazo se dibuja
al doble de grosor porque el recorte se come su mitad exterior. No uses
`border` en una viñeta recortada: `clip-path` se lo come entero.

El ángulo del corte pertenece a la **costura entre dos viñetas**, no a una
sola; por eso `costura()` devuelve el par. Las coordenadas son porcentajes de
cada viñeta, así que las diagonales solo salen paralelas si ambas tienen la
misma altura; si difieren, ajusta la caída en proporción.

## Vocabulario de la página

En `src/components/manga/`, además de `Panel`:

- `<CajaNarracion>` — el rótulo o la voz del narrador. Variantes `etiqueta`
  (corta, en versales) y `narracion` (una o dos frases).
- `<Bocadillo>` — diálogo. `tipo="habla"` es elipse con cola; `tipo="grito"`
  es estallido de picos. Se apoya en `Panel`, así que cuerpo y cola salen del
  mismo contorno.
- `<Sfx>` — onomatopeya. Es texto de verdad, no adorno: se lee y se traduce.

**Trampa de CSS que ya costó una vez:** el relleno en porcentaje se calcula
sobre el CONTENEDOR, no sobre el elemento. Dentro de una viñeta ancha, un
`px-[16%]` en el bocadillo daba 141px por lado. Para medidas relativas al
propio elemento, usa `inset` en un hijo absoluto.

## Comandos

El gestor de paquetes es **bun**, no npm. Para instalar: `bun install`.

`bun run dev` · `bun run build` · `bun run lint` · `bun run format`

Siempre con `run` por delante: `bun build` e `bun test` son comandos propios
de bun (su empaquetador y su corredor de pruebas) y no ejecutan los scripts de
`package.json`.

El linter ignora `design/`, que son artefactos de diseño y no código.
