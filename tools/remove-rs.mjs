import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const lojasPath = join(dirname(fileURLToPath(import.meta.url)), "../data/lojas.js");
const lojas = JSON.parse(
  readFileSync(lojasPath, "utf8").match(/window\.R5WF_LOJAS\s*=\s*(\[[\s\S]*\]);/)[1]
);

const filtered = lojas.filter(
  (l) => l.state !== "RS" && !(l.id && l.id.startsWith("01-"))
);

writeFileSync(
  lojasPath,
  `/** Lojas R5WF — importadas de CSV + site oficial */\nwindow.R5WF_LOJAS = ${JSON.stringify(filtered, null, 2)};\n`,
  "utf8"
);

console.log(`Removidas RS: ${lojas.length - filtered.length} | Restantes: ${filtered.length}`);
