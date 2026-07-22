/**
 * Importa lojas de CSV (colunas: Codigo, Nome fantasia, Endereço COMPLETO,
 * WhatsApp com DDD, Instagram, SELECT DEALER) e mescla em data/lojas.js
 *
 * Uso: node tools/import-lojas-csv.mjs "caminho/arquivo.csv" SC
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const lojasPath = join(dirname(fileURLToPath(import.meta.url)), "../data/lojas.js");
const csvPath = process.argv[2];
const targetState = (process.argv[3] || "SC").toUpperCase();

if (!csvPath) {
  console.error("Informe o caminho do CSV.");
  process.exit(1);
}

const STATE_NAMES = {
  SC: "Santa Catarina",
  RS: "Rio Grande do Sul",
  PR: "Paraná",
  SP: "São Paulo",
  MG: "Minas Gerais",
  ES: "Espírito Santo",
  GO: "Goiás",
  MS: "Mato Grosso do Sul",
  BA: "Bahia",
  PE: "Pernambuco",
  PI: "Piauí",
  PA: "Pará",
  MT: "Mato Grosso",
  MA: "Maranhão",
};

const STATE_PREFIX = { SC: "02", RS: "01", PR: "03", SP: "05", MG: "07", MS: "08", MT: "11", MA: "13", BA: "14", PI: "15", PE: "18", PA: "24" };

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\r" && next === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return clean(raw);
}

function normalizeInstagram(raw) {
  let value = clean(raw).replace(/[)\]]+$/, "");
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value.replace(/\/$/, "");
  const handle = value.replace(/^@/, "");
  if (!handle) return "";
  return `https://www.instagram.com/${handle}`;
}

function parseSelectDealer(raw) {
  const v = clean(raw).toUpperCase();
  return v === "TRUE" || v === "SIM" || v === "S" || v === "1" || v === "YES";
}

function extractCityState(address, fallbackState) {
  const addr = clean(address);
  let city = "";
  let state = fallbackState;

  const slash = addr.match(/([A-Za-zÀ-ú\s]+)\/(SC|RS|PR|SP|MG|ES|GO|MS|BA|PE|PI|PA)\b/i);
  if (slash) {
    city = slash[1].split("-").pop().trim().replace(/^Cíciuma$/i, "Criciúma");
    state = slash[2].toUpperCase();
    return { city, state };
  }

  const dash = addr.match(/,\s*([^,-]+)\s*-\s*([A-Z]{2})\b/);
  if (dash) {
    city = dash[1].trim();
    state = dash[2].toUpperCase();
    return { city, state };
  }

  const beforeState = addr.match(/([A-Za-zÀ-ú\s]+)\s*-\s*(SC|RS|PR|SP|MG|ES|GO|MS|BA|PE|PI|PA)\b/i);
  if (beforeState) {
    city = beforeState[1].split(",").pop().trim();
    state = beforeState[2].toUpperCase();
  }

  return { city, state };
}

function normalizeAddress(address, state) {
  let addr = clean(address);
  if (!/brasil/i.test(addr)) {
    addr += ", Brasil";
  }
  return addr;
}

function csvToLojas(rows, fallbackState) {
  if (!rows.length) return [];

  const header = rows[0].map((h) => clean(h).toLowerCase());
  const idx = {
    codigo: header.findIndex((h) => h.includes("codigo")),
    nome: header.findIndex((h) => h.includes("nome")),
    endereco: header.findIndex((h) => h.includes("endere")),
    whatsapp: header.findIndex((h) => h.includes("whatsapp")),
    instagram: header.findIndex((h) => h.includes("instagram")),
    select: header.findIndex((h) => h.includes("select")),
  };

  const prefix = STATE_PREFIX[fallbackState];
  const lojas = [];
  const seenIds = new Set();

  for (const row of rows.slice(1)) {
    const id = clean(row[idx.codigo]);
    const name = clean(row[idx.nome]);
    const addressRaw = clean(row[idx.endereco]);

    if (!id || !name || !addressRaw) continue;
    if (prefix && !id.startsWith(prefix + "-")) continue;
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    const { city, state } = extractCityState(addressRaw, fallbackState);
    if (state !== fallbackState) continue;
    const address = normalizeAddress(addressRaw, state);

    lojas.push({
      id,
      name,
      state,
      stateName: STATE_NAMES[state] || state,
      city,
      address,
      phone: normalizePhone(row[idx.whatsapp]),
      instagram: normalizeInstagram(row[idx.instagram]),
      website: "",
      maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      selectDealer: parseSelectDealer(row[idx.select]),
    });
  }

  return lojas;
}

async function geocodeLoja(loja) {
  const attempts = [
    loja.address,
    `${loja.city}, ${loja.state}, Brasil`,
  ].filter(Boolean);

  for (const q of attempts) {
    const url = "https://photon.komoot.io/api/?limit=1&q=" + encodeURIComponent(q);
    try {
      const res = await fetch(url);
      const data = await res.json();
      const f = data.features && data.features[0];
      if (f) {
        return {
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          geoPrecision: q === loja.address ? "address" : "city",
        };
      }
    } catch {
      /* try next */
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  return null;
}

const csvText = readFileSync(csvPath, "utf8");
const imported = csvToLojas(parseCsv(csvText), targetState);

const src = readFileSync(lojasPath, "utf8");
const existing = JSON.parse(src.match(/window\.R5WF_LOJAS\s*=\s*(\[[\s\S]*\]);/)[1]);
const prefix = STATE_PREFIX[targetState] || targetState;

const kept = existing.filter((loja) => {
  if (loja.state === targetState) return false;
  if (prefix && loja.id && loja.id.startsWith(prefix + "-")) return false;
  return true;
});

console.log(`Importadas do CSV (${targetState}): ${imported.length}`);
console.log(`Mantidas de outros estados: ${kept.length}`);

for (let i = 0; i < imported.length; i++) {
  const loja = imported[i];
  process.stderr.write(`[${i + 1}/${imported.length}] Geocoding ${loja.name}…\n`);
  const coords = await geocodeLoja(loja);
  if (coords) {
    loja.lat = coords.lat;
    loja.lng = coords.lng;
    loja.geoPrecision = coords.geoPrecision;
  }
}

const merged = [...kept, ...imported].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

writeFileSync(
  lojasPath,
  `/** Lojas R5WF — importadas de CSV + site oficial */\nwindow.R5WF_LOJAS = ${JSON.stringify(merged, null, 2)};\n`,
  "utf8"
);

const stateCount = merged.filter((l) => l.state === targetState).length;
const withCoords = merged.filter((l) => l.lat != null).length;
console.log(`Total lojas: ${merged.length} | ${targetState}: ${stateCount} | Com coordenadas: ${withCoords}`);
