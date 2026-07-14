import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const lojasPath = join(dirname(fileURLToPath(import.meta.url)), "../data/lojas.js");
const src = readFileSync(lojasPath, "utf8");
const lojas = JSON.parse(src.match(/window\.R5WF_LOJAS\s*=\s*(\[[\s\S]*\]);/)[1]);
const cache = new Map();

async function geocode(city, state) {
  const key = `${city}|${state}`;
  if (cache.has(key)) return cache.get(key);
  const q = `${city}, ${state}, Brasil`;
  const url = "https://photon.komoot.io/api/?limit=1&q=" + encodeURIComponent(q);
  try {
    const res = await fetch(url);
    const data = await res.json();
    const f = data.features && data.features[0];
    const c = f ? { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] } : null;
    cache.set(key, c);
    await new Promise((r) => setTimeout(r, 120));
    return c;
  } catch {
    cache.set(key, null);
    return null;
  }
}

for (const loja of lojas) {
  if (loja.lat != null && loja.lng != null) continue;
  const c = await geocode(loja.city, loja.state);
  if (c) {
    loja.lat = c.lat;
    loja.lng = c.lng;
    loja.geoPrecision = "city";
  }
}

writeFileSync(
  lojasPath,
  "/** Lojas R5WF — https://r5wf.com.br/onde-encontrar/ */\nwindow.R5WF_LOJAS = " +
    JSON.stringify(lojas, null, 2) +
    ";\n",
  "utf8"
);
console.log("Com coordenadas:", lojas.filter((l) => l.lat != null).length, "/", lojas.length);
