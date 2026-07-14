import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const lojasPath = join(__dir, "../data/lojas.js");

const src = readFileSync(lojasPath, "utf8");
const match = src.match(/window\.R5WF_LOJAS\s*=\s*(\[[\s\S]*\]);/);
const lojas = JSON.parse(match[1]);
const cache = new Map();

function extractStreet(address) {
  const m = address.match(/(?:Rua|R\.|Av\.|Avenida|BR-|Tv\.|Trav\.|Rod\.)([^,]+(?:,\s*\d+[^,]*)?)/i);
  if (m) {
    const street = m[0].trim();
    const cityPart = address.match(/,\s*([^,-]+)\s*-\s*([A-Z]{2})/);
    if (cityPart) return `${street}, ${cityPart[1].trim()}, ${cityPart[2]}, Brasil`;
    return street + ", Brasil";
  }
  return null;
}

async function nominatim(q) {
  if (cache.has(q)) return cache.get(q);
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=" +
    encodeURIComponent(q);
  const res = await fetch(url, {
    headers: { "User-Agent": "R5WF-Site/1.0 (lojas map geocoder)" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const result = data[0] ? { lat: +data[0].lat, lng: +data[0].lon } : null;
  cache.set(q, result);
  await new Promise((r) => setTimeout(r, 1100));
  return result;
}

async function geocodeLoja(loja) {
  const attempts = [
    loja.address,
    extractStreet(loja.address),
    `${loja.city}, ${loja.state}, Brasil`,
    `${loja.stateName || loja.state}, Brasil`,
  ].filter(Boolean);

  for (const q of attempts) {
    const coords = await nominatim(q);
    if (coords) {
      return { ...coords, precision: q === loja.address ? "address" : q.includes(loja.city) ? "city" : "region" };
    }
  }
  return null;
}

let ok = 0;
for (let i = 0; i < lojas.length; i++) {
  const loja = lojas[i];
  process.stderr.write(`[${i + 1}/${lojas.length}] ${loja.name}…\n`);
  const coords = await geocodeLoja(loja);
  if (coords) {
    loja.lat = coords.lat;
    loja.lng = coords.lng;
    loja.geoPrecision = coords.precision;
    ok++;
  } else {
    delete loja.lat;
    delete loja.lng;
  }
}

writeFileSync(
  lojasPath,
  "/** Gerado a partir de https://r5wf.com.br/onde-encontrar/ (+ geocoding OSM) */\n" +
    "window.R5WF_LOJAS = " +
    JSON.stringify(lojas, null, 2) +
    ";\n",
  "utf8"
);
console.log(`Concluído: ${ok}/${lojas.length} com coordenadas.`);
