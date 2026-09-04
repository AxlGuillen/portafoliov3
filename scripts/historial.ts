/**
 * Extrae el ritmo de commits de un repositorio y lo guarda como datos del
 * portafolio, semana a semana.
 *
 *   bun run historial <slug> <ruta-al-repo>
 *
 * Se guarda como JSON versionado en `content/historial/<slug>.json` y no se
 * consulta en el build: así la web se compila sin tener los repos a mano y
 * sin llamar a GitHub, y los repos privados no exponen más que la cuenta.
 * Para actualizar un proyecto, se vuelve a ejecutar.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [slug, repo] = process.argv.slice(2);

if (!slug || !repo) {
  console.error("Uso: bun run historial <slug> <ruta-al-repo>");
  process.exit(1);
}

const salida = execFileSync(
  "git",
  ["-C", repo, "log", "--format=%ad", "--date=short"],
  { encoding: "utf8" },
);

// Fechas ISO: ordenarlas como texto es ordenarlas en el tiempo.
const fechas = salida.trim().split("\n").filter(Boolean).sort();

if (fechas.length === 0) {
  console.error(`El repositorio en ${repo} no tiene commits.`);
  process.exit(1);
}

/** El lunes de la semana de una fecha, en UTC para que no baile con la zona. */
function lunes(fecha: string) {
  const dia = new Date(`${fecha}T00:00:00Z`);
  const desdeLunes = (dia.getUTCDay() + 6) % 7;
  dia.setUTCDate(dia.getUTCDate() - desdeLunes);
  return dia;
}

const iso = (dia: Date) => dia.toISOString().slice(0, 10);

const porSemana = new Map<string, number>();
for (const fecha of fechas) {
  const clave = iso(lunes(fecha));
  porSemana.set(clave, (porSemana.get(clave) ?? 0) + 1);
}

// Todas las semanas entre la primera y la última, también las vacías:
// un hueco de dos meses sin commits es parte de la historia del proyecto.
const semanas: { inicio: string; commits: number }[] = [];
const ultima = lunes(fechas[fechas.length - 1]);
for (
  const dia = lunes(fechas[0]);
  dia <= ultima;
  dia.setUTCDate(dia.getUTCDate() + 7)
) {
  const clave = iso(dia);
  semanas.push({ inicio: clave, commits: porSemana.get(clave) ?? 0 });
}

const destino = path.join("content", "historial", `${slug}.json`);
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(
  destino,
  `${JSON.stringify(
    {
      desde: fechas[0],
      hasta: fechas[fechas.length - 1],
      total: fechas.length,
      semanas,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `${slug}: ${fechas.length} commits en ${semanas.length} semanas → ${destino}`,
);
