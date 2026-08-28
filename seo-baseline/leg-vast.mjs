// Legt per URL de SEO-kenmerken vast, gezien door een crawler.
import fs from "node:fs";

const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const sitemap = fs.readFileSync(process.env.TEMP + "/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const pak = (html, re) => (html.match(re)?.[1] ?? null);
const alle = (html, re) => [...html.matchAll(re)].map((m) => m[1].replace(/\s+/g, " ").trim());

const resultaat = [];
for (const url of urls) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "manual" });
    const html = res.status < 300 ? await res.text() : "";
    const body = html.slice(html.indexOf("<body"));
    const tekst = body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    resultaat.push({
      url,
      status: res.status,
      redirect: res.headers.get("location") ?? null,
      title: pak(html, /<title>([^<]*)<\/title>/),
      description: pak(html, /<meta name="description" content="([^"]*)"/),
      canonical: pak(html, /<link rel="canonical" href="([^"]*)"/),
      robots: pak(html, /<meta name="robots" content="([^"]*)"/),
      ogTitle: pak(html, /<meta property="og:title" content="([^"]*)"/),
      ogImage: pak(html, /<meta property="og:image" content="([^"]*)"/),
      h1: alle(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g).map((h) => h.replace(/<[^>]+>/g, "")),
      aantalH2: (body.match(/<h2[ >]/g) ?? []).length,
      aantalLinks: (body.match(/<a /g) ?? []).length,
      jsonLdTypes: [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]),
      tekens: tekst.length,
    });
    process.stdout.write(".");
  } catch (err) {
    resultaat.push({ url, fout: String(err) });
    process.stdout.write("x");
  }
}

fs.writeFileSync("seo-baseline/voor-migratie.json", JSON.stringify(resultaat, null, 2));
console.log("\n" + resultaat.length + " URL's vastgelegd");
