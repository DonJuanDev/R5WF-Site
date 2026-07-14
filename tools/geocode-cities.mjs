import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const lojasPath = join(__dir, "../data/lojas.js");
const src = readFileSync(lojasPath, "utf8");
const lojas = JSON.parse(src.match(/window\.R5WF_LOJAS\s*=\s*(\[[\s\S]*\]);/)[1]);

const cityCache = new Map();

async function geocodeCity(city, state) {
  const key = city + "|" + state;
  if (cityCache.has(key)) return cityCache.get(key);
  const q = `${city}, ${state}, Brasil`;
  const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=" + encodeURIComponent(q);
  const res = await fetch(url, { headers: { "User-Agent": "R5WF-Site/1.0" } });
  const data = await res.json();
  const c = data[0] ? { lat: +data[0].lat, lng: +data[0].lon } : null;
  cityCache.set(key, c);
  await new Promise((r) => setTimeout(r, 1100));
  return c;
}

for (const loja of lojas) {
  if (loja.lat != null && loja.lng != null) continue;
  const c = await geocodeCity(loja.city, loja.state);
  if (c) {
    loja.lat = c.lat;
    loja.lng = c.lng;
    loja.geoPrecision = "city";
  }
}

writeFileSync(
  lojasPath,
  "/** Gerado a partir de https://r5wf.com.br/onde-encontrar/ (+ geocoding OSM) */\nwindow.R5WF_LOJAS = " +
    JSON.stringify(lojas, null, 2) +
    ";\n",
  "utf8"
);
console.log("Com coords:", lojas.filter((l) => l.lat != null).length, "/", lojas.length);
