#!/usr/bin/env node
/**
 * Hoe antwoordt de www-host per client? Als een crawler op www een 200 krijgt,
 * staat de site dubbel op twee hosts.
 *
 *   node scripts/www-host-check.mjs
 *
 * Vraagt www.nieuwblik.com en drie subpagina's op met drie user agents
 * (browser, Googlebot, geen UA) via node:https met minimale headers, en
 * daarnaast met de extra headers die fetch() meestuurt, om te zien welke header
 * het verschil maakt. Rapporteert status, Location en de canonical in de body.
 */
import https from "node:https";
import zlib from "node:zlib";

const PADEN = ["/", "/website-laten-maken", "/portfolio", "/blog/vindbaar-in-chatgpt-geo-west-friesland"];
const UAS = {
  browser: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  geen: null,
};
// De headers die Node's fetch() (undici) standaard meestuurt.
const FETCH_HEADERS = { accept: "*/*", "accept-language": "*", "sec-fetch-mode": "cors", "accept-encoding": "gzip, deflate" };

function vraag(url, headers) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: "GET", headers }, (res) => {
      const delen = [];
      res.on("data", (d) => delen.push(d));
      res.on("end", () => {
        let body = Buffer.concat(delen);
        try {
          if (res.headers["content-encoding"] === "gzip") body = zlib.gunzipSync(body);
          else if (res.headers["content-encoding"] === "deflate") body = zlib.inflateSync(body);
        } catch {}
        const html = body.toString("utf8");
        const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1] ?? "-";
        resolve({ status: res.statusCode, location: res.headers.location ?? "-", canonical, server: res.headers.server ?? "-" });
      });
    });
    req.setTimeout(30000, () => req.destroy(new Error("timeout")));
    req.on("error", (e) => resolve({ status: 0, location: "-", canonical: "-", server: e.message }));
    req.end();
  });
}

const rijen = [];
for (const pad of PADEN) {
  for (const [naam, ua] of Object.entries(UAS)) {
    for (const [variant, extra] of Object.entries({ minimaal: {}, "fetch-headers": FETCH_HEADERS })) {
      const headers = { ...extra };
      if (ua) headers["user-agent"] = ua;
      const r = await vraag(`https://www.nieuwblik.com${pad}`, headers);
      rijen.push({ pad, ua: naam, headers: variant, ...r });
    }
  }
}

// Welke losse header veroorzaakt het verschil? Ook alle sec-fetch-mode-waarden
// en een echte Chrome-navigatie, want die sturen browsers bij elke paginaklik.
const CHROME_NAVIGATIE = {
  "user-agent": UAS.browser,
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "accept-language": "nl-NL,nl;q=0.9,en;q=0.8",
  "accept-encoding": "gzip, deflate",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
};
const losse = [];
const proeven = [
  ...Object.entries(FETCH_HEADERS).map(([k, v]) => ["googlebot + " + `${k}: ${v}`, { "user-agent": UAS.googlebot, [k]: v }]),
  ...["navigate", "no-cors", "same-origin", "cors"].map((m) => [`browser + sec-fetch-mode: ${m}`, { "user-agent": UAS.browser, "sec-fetch-mode": m }]),
  ["browser + sec-fetch-dest: document (zonder mode)", { "user-agent": UAS.browser, "sec-fetch-dest": "document" }],
  ["volledige Chrome-navigatie", CHROME_NAVIGATIE],
];
for (const [label, headers] of proeven) {
  const r = await vraag("https://www.nieuwblik.com/", headers);
  losse.push({ header: label, status: r.status, location: r.location });
}

console.log("| Pad | User agent | Headers | Status | Location | Canonical in body |");
console.log("|---|---|---|---|---|---|");
for (const r of rijen) console.log(`| \`${r.pad}\` | ${r.ua} | ${r.headers} | ${r.status} | ${r.location} | ${r.canonical} |`);
console.log("\nhttps://www.nieuwblik.com/ met één extra header of headerset:");
for (const l of losse) console.log(`- ${l.header} → ${l.status} ${l.location}`);
const twee = rijen.filter((r) => r.status === 200);
console.log(twee.length ? `\nBLOCKER: www gaf ${twee.length} keer een 200.` : "\nwww gaf in geen enkele combinatie een 200.");
