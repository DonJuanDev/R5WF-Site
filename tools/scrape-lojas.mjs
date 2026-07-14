import { writeFileSync } from "fs";

const html = await (await fetch("https://r5wf.com.br/onde-encontrar/")).text();

const stateMap = {
  "01": "RS", "02": "SC", "03": "PR", "04": "ES", "05": "SP",
  "07": "MG", "08": "MS", "09": "GO", "14": "BA", "15": "PI", "18": "PE", "24": "PA",
};

const stateNames = {
  RS: "Rio Grande do Sul",
  SC: "Santa Catarina",
  SP: "São Paulo",
  PR: "Paraná",
  MG: "Minas Gerais",
  ES: "Espírito Santo",
  GO: "Goiás",
  MS: "Mato Grosso do Sul",
  BA: "Bahia",
  PE: "Pernambuco",
  PI: "Piauí",
  PA: "Pará",
};

function cleanPhone(raw) {
  if (!raw) return "";
  return raw.replace(/[^\d()+\-\s]/g, "").trim();
}

function cleanText(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const blocks = html.split(/<h4[^>]*>/).slice(1);
const lojas = [];

for (const block of blocks) {
  const titleEnd = block.indexOf("</h4>");
  if (titleEnd === -1) continue;
  const rawTitle = cleanText(block.slice(0, titleEnd));
  if (!rawTitle || /matriz|cnpj|siga-nos/i.test(rawTitle)) continue;

  const idMatch = rawTitle.match(/^(\d+\s*[-–]\s*\d+)/);
  const id = idMatch ? idMatch[1].replace(/\s/g, "") : "";
  const prefix = id.split("-")[0];
  const state = stateMap[prefix] || "";

  const rest = block.slice(titleEnd);
  const paragraphs = [...rest.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => cleanText(m[1]));
  const address = paragraphs.find((p) => p.length > 10) || "";

  const phoneRaw = rest.match(/\(\d{2}\)\s*[\d\-]+|\b\d{2}\s?\d{4,5}[-\s]?\d{4}\b/);
  const phone = cleanPhone(phoneRaw ? phoneRaw[0] : "");

  const igMatch = rest.match(/https?:\/\/(?:www\.)?instagram\.com\/[^\s<"']+/i)
    || rest.match(/instagram\.com\/[^\s<"']+/i);
  const instagram = igMatch
    ? (igMatch[0].startsWith("http") ? igMatch[0] : "https://" + igMatch[0]).replace(/\/$/, "")
    : "";

  const siteMatch = rest.match(/https?:\/\/(?!instagram|maps|google)[^\s<"']+/i)
    || rest.match(/\b([a-z0-9-]+\.(?:com\.br|com))\b/i);
  let website = "";
  if (siteMatch) {
    website = siteMatch[0].startsWith("http") ? siteMatch[0] : "https://" + siteMatch[0];
    if (website.includes("instagram")) website = "";
  }

  const mapsHref = rest.match(/href="(https:\/\/(?:www\.)?google\.[^"]*maps[^"]+)"/i);
  const maps = mapsHref
    ? mapsHref[1]
    : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);

  const name = rawTitle.replace(/^\d+\s*[-–]\s*\d+\s*[-–]?\s*/, "").trim();
  const cityMatch = address.match(/,\s*([^,-]+)\s*-\s*([A-Z]{2})\b/);
  const city = cityMatch ? cityMatch[1].trim() : "";

  if (name && address) {
    lojas.push({ id, name, state, stateName: stateNames[state] || state, city, address, phone, instagram, website, maps });
  }
}

const js = `/** Gerado a partir de https://r5wf.com.br/onde-encontrar/ */\nwindow.R5WF_LOJAS = ${JSON.stringify(lojas, null, 2)};\n`;

writeFileSync(new URL("../data/lojas.js", import.meta.url), js, "utf8");
console.log("Lojas exportadas:", lojas.length);
