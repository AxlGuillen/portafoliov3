# 4XL — Portafolio de Axl Guillen

Portafolio y blog personal. Dos ideas lo gobiernan y no se negocian:

1. **Temático.** La página se lee como una página de manga en blanco y negro:
   viñetas con cortes diagonales, tramas de semitono, bocadillos y onomatopeyas.
   El color (lima `#D9F24A`) no es paleta, es recompensa: aparece solo al pasar
   el cursor y en la sección de contacto.
2. **Funcional.** Cada sección tiene URL real, compartible e indexable. Enlaces
   `<a>` de verdad, una URL canónica por contenido, y el botón atrás nunca
   expulsa del sitio.

El diseño vive en [`design/`](./design) como lienzo de artboards.

## Stack

| Pieza | Elección |
|---|---|
| Framework | Next.js 16 (App Router, SSG) · React 19 · TypeScript |
| Estilos | Tailwind CSS 4 (configuración CSS-first en `globals.css`) |
| Idiomas | next-intl con slugs traducidos (`/es/proyectos` ↔ `/en/projects`) |
| Contenido | MDX bilingüe en `content/` |
| Animación | GSAP + ScrollTrigger |
| Calidad | Biome (lint y formato) |

## Comandos

```bash
npm run dev      # desarrollo
npm run build    # compilar
npm run start    # servir la compilación
npm run lint     # revisar
npm run format   # formatear
```

## Estructura

```
src/
  app/[locale]/
    (sitio)/          público: portafolio y blog
                      (el bloque privado irá en un grupo aparte)
  components/
    marca/            logo e identidad
    sitio/            piezas del sitio público
  i18n/               rutas traducidas y configuración de idioma
  lib/                utilidades
  proxy.ts            enrutado por idioma (en Next 16 sustituye a middleware.ts)
content/{es,en}/      artículos y casos en MDX
messages/             cadenas de interfaz por idioma
design/               lienzo de diseño (artboards del sistema visual)
```

## Notas del sistema visual

Los tokens y las tramas viven en `src/app/globals.css`:

- Colores `tinta`, `papel`, `lector`, `lima`.
- Tipografías `display` (Archivo Black), `body` (Karla), `hand` (Gochi Hand).
- Utilidades de trama: `trama-puntos`, `trama-densa`, `trama-lineas`,
  `trama-velocidad`.

**Las tramas se pintan en CSS, nunca se hornean en la imagen.** El arte
generado debe traer solo la línea: así pesa menos y la trama queda nítida a
cualquier zoom, sin muaré al escalar.

## Pendiente inmediato

El componente `<Panel>`: la viñeta con corte diagonal. La caja de maquetación
sigue siendo rectangular (para que el grid y las container queries funcionen);
la silueta se dibuja aparte con `clip-path` para el recorte y un `<polygon>`
SVG con `vector-effect="non-scaling-stroke"` para el borde de tinta, ambos
derivados de la misma lista de puntos. El ángulo del corte pertenece a la
costura entre dos viñetas, no a una sola, para que el canal quede paralelo.
