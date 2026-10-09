// Screenshots van een case-site in headless Chrome, voor de mockups.
// puppeteer-core is geen projectafhankelijkheid: hij komt uit de npx-cache
// (of PUPPETEER_CORE_PAD), Chrome uit CHROME_PAD of de standaardinstallatie.
import { createRequire } from "node:module";
import { existsSync } from "node:fs";

const PUPPETEER_PADEN = [
  process.env.PUPPETEER_CORE_PAD,
  "D:/Caches/npm/_npx/1722e863ebfd623b/node_modules/",
].filter(Boolean);

function laadPuppeteer() {
  try {
    return createRequire(import.meta.url)("puppeteer-core");
  } catch {
    for (const pad of PUPPETEER_PADEN) {
      try { return createRequire(pad)("puppeteer-core"); } catch { /* volgende */ }
    }
  }
  throw new Error("puppeteer-core niet gevonden. Draai eenmalig `npx puppeteer-core --version` of zet PUPPETEER_CORE_PAD.");
}

const CHROME = process.env.CHROME_PAD ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Maakt een screenshot (PNG-buffer).
 * - Cookiemelding: alleen weigeren (privacyvriendelijk), nooit accepteren.
 * - `verberg`: CSS-selectors van zwevende knoppen/pop-ups die niet in beeld mogen.
 * - Scrolt eerst de hele pagina door, zodat lazy loading en scroll-animaties klaar zijn.
 */
export async function maakScreenshot({ url, breedte, hoogte, dpr, mobiel = false, volledig = false, verberg = "" }) {
  if (!existsSync(CHROME)) throw new Error(`Chrome niet gevonden op ${CHROME} (zet CHROME_PAD).`);
  const puppeteer = laadPuppeteer();
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--hide-scrollbars"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: breedte, height: hoogte, deviceScaleFactor: dpr, isMobile: mobiel, hasTouch: mobiel });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
    await wacht(1500);
    const geweigerd = await page.evaluate(() => {
      const knop = [...document.querySelectorAll("button, a")].find((b) =>
        /^(weiger|alles weigeren|alleen noodzakelijk|reject|decline)/i.test(b.textContent.trim()));
      if (knop) { knop.click(); return knop.textContent.trim(); }
      return null;
    });
    console.log(`  cookiemelding: ${geweigerd ? `"${geweigerd}" geklikt` : "geen weigerknop gevonden"}`);
    await wacht(800);
    if (verberg) await page.addStyleTag({ content: `${verberg} { display: none !important; }` });
    const totaal = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < totaal; y += 300) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await wacht(150); }
    await wacht(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await wacht(1500);
    // Geen half afgeronde overgangen in beeld (bijv. een hero-slider die tussen twee
    // foto's overvloeit): alle CSS-transities direct naar hun eindstand.
    await page.addStyleTag({ content: "*, *::before, *::after { transition-duration: 0s !important; transition-delay: 0s !important; }" });
    await wacht(400);
    return await page.screenshot({ fullPage: volledig });
  } finally {
    await browser.close();
  }
}
