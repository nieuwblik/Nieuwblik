// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
import { execFileSync } from "node:child_process";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { imagetools } from "vite-imagetools";

// Sitemap en robots.txt opnieuw genereren bij elke build, uit de routeboom en
// de data (scripts/generate-sitemap.ts). Eén keer per build-proces: de
// client- en serverbuild roepen buildStart allebei aan.
let sitemapGegenereerd = false;
const sitemapPlugin = {
  name: "nieuwblik-sitemap",
  apply: "build" as const,
  buildStart() {
    if (sitemapGegenereerd) return;
    sitemapGegenereerd = true;
    execFileSync(process.execPath, ["--import", "tsx", "scripts/generate-sitemap.ts"], { stdio: "inherit" });
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    ssr: {
      // Supabase publiceert CJS-bestanden die de dev-SSR-resolver niet vindt
      // ("Cannot find module .../postgrest-js/dist/index.cjs"); bundelen lost
      // dat op in dev én prod.
      noExternal: [/^@supabase\//],
    },
    plugins: [
      sitemapPlugin,
      // Levert varianten per schermbreedte voor imports met ?w=...&as=srcset
      // (src/data/projects.ts, src/components/ScrollPortfolio.tsx).
      imagetools(),
      // Image optimization - converts to WebP and optimizes
      ViteImageOptimizer({
        png: { quality: 80 },
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        webp: { lossless: false, quality: 85, effort: 6 },
        svg: {
          multipass: true,
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  cleanupNumericValues: false,
                  removeViewBox: false,
                },
              },
            },
            "sortAttrs",
            {
              name: "addAttributesToSVGElement",
              params: {
                attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
              },
            },
          ],
        },
      }),
    ],
  },
});
