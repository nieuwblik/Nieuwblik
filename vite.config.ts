import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx', './src/pages/Index.tsx'],
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    // Image optimization - converts to WebP and optimizes
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        lossless: false,
        quality: 85,
        effort: 6,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false,
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
    }),
    // Gzip compression for production
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    }),
    // Brotli compression for production
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Force all packages to use the same React instance
    dedupe: [
      "react", 
      "react-dom", 
      "react/jsx-runtime", 
      "react/jsx-dev-runtime",
      "framer-motion",
      "@tanstack/react-query",
      "embla-carousel-react",
      "embla-carousel-autoplay",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        // Zonder ondergrens knipt Rollup elk gedeeld icoontje in een eigen
        // bestandje: 47 van de 87 chunks waren kleiner dan 5 KB. Over een
        // trage mobiele verbinding kost elk daarvan een aparte ronde, en dan
        // blijft de pagina seconden lang bijvullen.
        experimentalMinChunkSize: 20000,
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
          ],
          'form-libs': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Eigen chunk, anders schuift de ondergrens hierboven de
          // smooth-scrollcode in een willekeurig ander bestand. Hij wordt
          // alleen dynamisch geimporteerd, dus mobiel haalt hem nooit op.
          'smooth-scroll': ['lenis'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'es2015',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
    sourcemap: false,
  },
  // Force re-optimization of dependencies to fix React duplicate issues
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'framer-motion',
      '@radix-ui/react-tooltip',
      '@tanstack/react-query',
      'embla-carousel-react',
      'embla-carousel-autoplay',
    ],
    force: true,
  },
}));
