# Sistema 4XL — manga en blanco y negro

Paquete del sistema de diseño para Claude Design. Cada `.html` es una tarjeta
autónoma (marcador `@dsCard` en la primera línea); `tokens/tokens.css` son los
valores listos para copiar a otro proyecto.

## Las dos reglas

1. **Temático**: la interfaz se lee como una página de manga en blanco y negro.
2. **Funcional**: cada sección tiene URL real, compartible e indexable.

Ninguna decisión sacrifica una por la otra: enlaces `<a>` de verdad, una URL
por contenido, el botón atrás nunca expulsa del sitio, `prefers-reduced-motion`
se respeta siempre.

## Vocabulario

Las etiquetas visibles son directas (Proyectos, Blog, Sobre mí, Contacto).
Lo temático lo aporta el dibujo, nunca las palabras.

## La regla del 4

El logo es un 4 y "AXL" a la vez. Los lemas clave tienen 4 palabras, las
rejillas llevan múltiplos de 4 piezas, y el cuarto elemento de cada serie
recibe trato especial (fondo tinta, «04★»). Se respeta donde salga natural.

## Color

Tinta `#111111`, papel `#ffffff`, lector `#101010` (el fondo bajo la hoja).
La lima `#d9f24a` **solo** en hover, en el foco y en la sección de contacto.

## Tipografía

Tres voces: **Archivo Black** (titulares, onomatopeyas, cifras), **Karla**
(lectura y etiquetas en versales) y **Gochi Hand** (fechas, notas al margen).

## Tramas

`puntos`, `densa`, `lineas`, `velocidad`. Se pintan en CSS con `color-mix`
sobre la tinta, nunca se hornean en la imagen: el arte trae solo la línea.

## Viñetas

La caja de maquetación es rectangular y la silueta se dibuja aparte:
`clip-path: polygon()` recorta fondo y contenido, y un `<polygon>` SVG con
`vector-effect="non-scaling-stroke"` pinta el borde al **doble** de grosor
(el recorte se come la mitad exterior). Nunca `border` en una viñeta
recortada. Las coordenadas van de 0 a 100 y son porcentajes de la viñeta.

El ángulo del corte pertenece a la **costura entre dos viñetas**: la de
arriba lleva `corteAbajo(caida)` y la de abajo `corteArriba(caida)` con la
misma caída. Solo salen paralelas si ambas tienen la misma altura.

## Bocadillo, caja de narración y onomatopeya

- **Bocadillo**: elipse con la cola en la misma lista de puntos (contorno
  continuo); `grito` es un estallido de picos. La zona de texto va con
  `inset` en un hijo absoluto, nunca con relleno en porcentaje.
- **Caja de narración**: rectángulo de borde 3px; `etiqueta` (versales) o
  `narracion` (una o dos frases). No la dice nadie.
- **Onomatopeya**: texto real, perfilado con `paint-order: stroke fill`,
  siempre girada con la propiedad `rotate` (no `transform`).

## Movimiento

Solo se mueve lo que está bajo el pliegue al cargar; `prefers-reduced-motion`
lo apaga entero; solo opacidad y transformaciones. Viñetas que suben 28px y
se funden al entrar, onomatopeyas que estallan desde el 60%, barras que
crecen desde la base. Una sola vez, como pasar la hoja.

## Móvil

La página de manga se convierte en webtoon: viñetas apiladas a todo el
ancho. Las formas usan coordenadas normalizadas, así que las diagonales se
adaptan solas. Las cuatro rutas bajan a una barra fija inferior.
