import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const lojasPath = join(dirname(fileURLToPath(import.meta.url)), "../data/lojas.js");
const src = readFileSync(lojasPath, "utf8");
const lojas = JSON.parse(src.match(/window\.R5WF_LOJAS\s*=\s*(\[[\s\S]*\]);/)[1]);
const cache = new Map();

async function photon(q) {
  if (cache.has(q)) return cache.get(q);
  const url = "https://photon.komoot.io/api/?limit=1&q=" + encodeURIComponent(q);
  try {
    const res = await fetch(url);
    const data = await res.json();
    const f = data.features?.[0];
    const c = f ? { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] } : null;
    cache.set(q, c);
    await new Promise((r) => setTimeout(r, 150));
    return c;
  } catch {
    cache.set(q, null);
    return null;
  }
}

async function geocodeLoja(loja) {
  const attempts = [loja.address, `${loja.city}, ${loja.state}, Brasil`].filter(Boolean);
  for (const q of attempts) {
    const c = await photon(q);
    if (c) {
      return {
        ...c,
        geoPrecision: q === loja.address ? "address" : "city",
      };
    }
  }
  return null;
}

for (const loja of lojas) {
  if (loja.lat != null && loja.lng != null) continue;
  process.stderr.write(`Geocoding ${loja.id} ${loja.name}…\n`);
  const c = await geocodeLoja(loja);
  if (c) {
    loja.lat = c.lat;
    loja.lng = c.lng;
    loja.geoPrecision = c.geoPrecision;
  }
}

writeFileSync(
  lojasPath,
  `/** Lojas R5WF — importadas de CSV + site oficial */\nwindow.R5WF_LOJAS = ${JSON.stringify(lojas, null, 2)};\n`,
  "utf8"
);

const withCoords = lojas.filter((l) => l.lat != null).length;
console.log(`Com coordenadas: ${withCoords} / ${lojas.length}`);
