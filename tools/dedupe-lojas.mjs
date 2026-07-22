import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const lojasPath = join(dirname(fileURLToPath(import.meta.url)), "../data/lojas.js");
const lojas = JSON.parse(
  readFileSync(lojasPath, "utf8").match(/window\.R5WF_LOJAS\s*=\s*(\[[\s\S]*\]);/)[1]
);

function score(loja) {
  let s = 0;
  if (loja.lat != null) s += 4;
  if (loja.selectDealer != null) s += 2;
  if (loja.phone) s += 1;
  if (loja.instagram) s += 1;
  s += Math.min(loja.address?.length || 0, 200) / 200;
  return s;
}

const byId = new Map();
for (const loja of lojas) {
  const prev = byId.get(loja.id);
  if (!prev || score(loja) > score(prev)) byId.set(loja.id, loja);
}

const deduped = [...byId.values()].sort((a, b) =>
  a.id.localeCompare(b.id, undefined, { numeric: true })
);

writeFileSync(
  lojasPath,
  `/** Lojas R5WF — importadas de CSV + site oficial */\nwindow.R5WF_LOJAS = ${JSON.stringify(deduped, null, 2)};\n`,
  "utf8"
);

console.log(`Antes: ${lojas.length} | Depois: ${deduped.length} | Removidas: ${lojas.length - deduped.length}`);
console.log(`SP: ${deduped.filter((l) => l.state === "SP").length}`);
console.log(`Com coordenadas: ${deduped.filter((l) => l.lat != null).length}`);
