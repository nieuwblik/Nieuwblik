/**
 * Schrijft redirects.csv voor de HadoSEO-import uit src/config/redirects.ts,
 * dezelfde tabel die de app server-side gebruikt. Zo kunnen origin en
 * HadoSEO niet uit elkaar lopen.
 *
 * Formaat (vereist door HadoSEO): source_path,target_url,rule_type
 * rule_type is de string "redirect", target_url is absoluut op SITE_URL.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { REDIRECTS } from "../src/config/redirects";
import { SITE_URL } from "../src/config/site";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const csvVeld = (waarde: string) => (/[",\n]/.test(waarde) ? `"${waarde.replace(/"/g, '""')}"` : waarde);

const regels = ["source_path,target_url,rule_type"];
const gezien = new Set<string>();
for (const r of REDIRECTS) {
  if (gezien.has(r.from)) throw new Error(`Dubbele bron in redirecttabel: ${r.from}`);
  if (r.from === r.to) throw new Error(`Redirect naar zichzelf: ${r.from}`);
  gezien.add(r.from);
  regels.push([r.from, `${SITE_URL}${r.to}`, "redirect"].map(csvVeld).join(","));
}

const uit = path.resolve(__dirname, "../redirects.csv");
fs.writeFileSync(uit, regels.join("\n") + "\n", "utf-8");
console.log(`redirects.csv geschreven: ${REDIRECTS.length} regels`);
