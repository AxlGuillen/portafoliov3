# Notas de sincronización con Claude Design

- Este repo es un sitio (Next.js), no una biblioteca de componentes: no hay
  `dist/` ni Storybook que el conversor pueda empaquetar. El sistema se
  sube por la vía manual: tarjetas HTML autónomas con `@dsCard` en la
  primera línea, `styles.css` con fuentes, tokens y tramas, y `README.md`
  con las reglas. Sin `_ds_bundle.js`: el agente de diseño hereda el
  aspecto y las reglas, no componentes compilados.
- Las tarjetas se generan desde las mismas fórmulas que `formas.ts`; para
  cambiarlas, edita el HTML en `design/sistema/` y vuelve a sincronizar.
- Para sincronizar hace falta `/design-login` en una terminal interactiva
  con Claude Code >= 2.1.260 (el comando no existe en versiones anteriores).
