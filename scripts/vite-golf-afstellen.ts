// Alleen voor de ontwikkelserver: opslag voor het afstelpaneel van de golf in de
// homepage-hero (src/components/golf/golfPaneel.ts).
//
//   GET  /__golf/opslag  vakjes van het paneel (gedeeld met het prototype in
//                        ../_prototypes/hero-golf als die map bestaat)
//   POST /__golf/opslag  velden in dat bestand bijwerken (bijv. { vakjes })
//   POST /__golf/site    { instellingen, desktop, mobiel } -> src/data/golfHero.ts en
//                        de terugvalbeelden in src/assets/hero (base64 WebP)
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { IncomingMessage } from "node:http";
import path from "node:path";
import type { Plugin } from "vite";

const leesBody = (req: IncomingMessage) =>
  new Promise<string>((klaar, fout) => {
    const delen: Buffer[] = [];
    req.on("data", (d: Buffer) => delen.push(d));
    req.on("end", () => klaar(Buffer.concat(delen).toString("utf8")));
    req.on("error", fout);
  });

const leesJson = async (bestand: string): Promise<Record<string, unknown>> => {
  try {
    return JSON.parse(await readFile(bestand, "utf8"));
  } catch {
    return {};
  }
};

export function golfAfstellen(): Plugin {
  return {
    name: "nieuwblik-golf-afstellen",
    apply: "serve",
    configureServer(server) {
      const root = server.config.root;
      const prototype = path.resolve(root, "../_prototypes/hero-golf");
      const opslag = existsSync(prototype)
        ? path.join(prototype, "golf-opslag.json")
        : path.join(root, "node_modules/.cache/golf-opslag.json");

      server.middlewares.use("/__golf", async (req, res) => {
        const stuur = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        try {
          if (req.url === "/opslag" && req.method === "GET")
            return stuur(200, await leesJson(opslag));
          if (req.url === "/opslag" && req.method === "POST") {
            const nieuw = JSON.parse(await leesBody(req));
            const data = { ...(await leesJson(opslag)), ...nieuw };
            await mkdir(path.dirname(opslag), { recursive: true });
            await writeFile(opslag, JSON.stringify(data, null, 1));
            return stuur(200, { ok: true });
          }
          if (req.url === "/site" && req.method === "POST") {
            const { instellingen, desktop, mobiel } = JSON.parse(
              await leesBody(req),
            );
            if (
              !instellingen?.vorm ||
              !instellingen?.kleuren ||
              !instellingen?.desktop ||
              !instellingen?.mobiel
            )
              return stuur(400, { fout: "Ongeldige instellingen" });
            const bestand = path.join(root, "src/data/golfHero.ts");
            const inhoud = `import type { GolfInstellingen } from "@/components/golf/golfMotor";

// Instellingen van de golf in de homepage-hero, opgeslagen met het afstelpaneel
// (toets p in de ontwikkelomgeving, knop "Opslaan in site"). Die knop maakt ook de
// terugvalbeelden in src/assets/hero opnieuw (hero op 1600 x 900 en 390 x 844).
export const golfHero: GolfInstellingen = ${JSON.stringify(instellingen, null, 2)};
`;
            const prettier = await import("prettier");
            const config = (await prettier.resolveConfig(bestand)) ?? {};
            await writeFile(
              bestand,
              await prettier.format(inhoud, { ...config, filepath: bestand }),
            );
            const assets = path.join(root, "src/assets/hero");
            await mkdir(assets, { recursive: true });
            if (desktop)
              await writeFile(
                path.join(assets, "golf-desktop.webp"),
                Buffer.from(desktop, "base64"),
              );
            if (mobiel)
              await writeFile(
                path.join(assets, "golf-mobiel.webp"),
                Buffer.from(mobiel, "base64"),
              );
            return stuur(200, { ok: true });
          }
          stuur(404, { fout: "Onbekend" });
        } catch (e) {
          stuur(500, { fout: String(e) });
        }
      });
    },
  };
}
