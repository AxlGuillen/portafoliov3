# Imágenes del sitio

Todo se descubre por convención: **soltar el archivo en su sitio basta**, no
hay que tocar código ni frontmatter. `bun run assets` dice qué hay y qué
falta; sale en rojo (código 1) si falta algo obligatorio.

## Estructura

```
public/
├── vinetas/                      ilustraciones generadas (solo línea, sin tramas)
│   ├── inicio-apertura.avif      ✓ portada: tú junto al árbol
│   ├── inicio-destacado.avif     ✓ portada: de espaldas al monitor
│   ├── inicio-sobre-mi.avif      ✓ portada y sobre mí: el escritorio
│   ├── 404-arriba.avif           ✗ 404, viñeta superior
│   ├── 404-abajo.avif            ✗ 404, viñeta inferior
│   └── contacto.avif             · opcional, hoy la portada de contacto es texto
├── proyectos/
│   ├── <slug>.jpg                ✓ portada del caso (tarjeta en portada y lista)
│   └── <slug>/                   · galería del caso, opcional
│       ├── 01-lo-que-sea.jpg        se ordenan por nombre; el pie sale del
│       └── 02-otra-cosa.jpg         frontmatter (`capturas`) o del nombre
└── blog/
    └── <slug>.avif               · portada del artículo, opcional, aún sin uso
```

Los `<slug>` son los nombres de archivo de `content/es/proyectos/*.mdx` y
`content/es/blog/*.mdx`: `dymmsa`, `reels-analytics`, `reel-editor`,
`hasly-portfolio`; `el-vault-como-centro`, `mcp-sobre-tu-propia-app`.

## Especificaciones

**Ilustraciones (`vinetas/`)**: AVIF, **1840 × 920** (2:1). Solo línea y
manchas de tinta, sin tramas ni color: las tramas se pintan en CSS y el color
está prohibido fuera de hover y contacto. La viñeta recorta la imagen según
el ancho de pantalla, así que el motivo importante debe caber en el **centro
horizontal** (en móvil sobreviven aproximadamente los 2/3 centrales). Si el
punto de interés no está centrado, se ajusta con `posicion` en la página,
no regenerando la imagen.

| Viñeta            | Alto en escritorio | Lo que debe verse                                  |
| ----------------- | ------------------ | -------------------------------------------------- |
| inicio-apertura   | 460 px             | el personaje, foco arriba a la derecha del centro  |
| inicio-destacado  | 420 px             | el monitor, foco a la derecha                      |
| inicio-sobre-mi   | 400 px             | el escritorio, foco al centro                      |
| 404-arriba        | 320 px             | libre; sugerencia: el personaje ante una viñeta en blanco o arrancada |
| 404-abajo         | 260 px             | libre; sugerencia: el personaje de espaldas volviendo hacia la página |

**Capturas (`proyectos/`)**: JPG o PNG a **1920 de ancho** (alto libre, lo
normal 900–1000). En color, tal cual salen: el sitio las pasa a blanco y
negro de alto contraste con CSS, y así al rediseñar la app basta con
sustituir el archivo. Portada: la pantalla más reconocible de la app, sin
datos sensibles. Galería: entre 2 y 4 por caso, en el orden en que se
quieren leer, con un número delante en el nombre (`01-`, `02-`).

**Pies de galería**: opcional, en el frontmatter del caso:

```yaml
capturas:
  - archivo: "01-cotizador.jpg"
    pie: "El cotizador con un Excel recién cargado."
```

Sin `capturas`, el pie sale del nombre del archivo sin el número
(`01-cotizador.jpg` → «cotizador»).

## Lo que no hace falta entregar

La imagen de compartir en redes (`opengraph-image`) se genera en el build.
El favicon y el icono de Apple ya están. Las gráficas de commits salen de
`content/historial/*.json`, no de imágenes.
