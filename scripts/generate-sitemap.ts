/**
 * Dynamic sitemap generator
 * Reads slugs from data files and generates sitemap.xml at build time
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.nieuwblik.com';
const TODAY = new Date().toISOString().split('T')[0];

interface SitemapEntry {
  loc: string;
  changefreq: string;
  priority: string;
}

// Extract slugs from a TypeScript data file using regex
function extractSlugs(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const slugRegex = /slug:\s*["']([^"']+)["']/g;
  const slugs: string[] = [];
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

function buildSitemap(): string {
  const entries: SitemapEntry[] = [];

  // Static pages
  const staticPages: SitemapEntry[] = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/diensten', changefreq: 'monthly', priority: '0.9' },
    { loc: '/diensten/website-op-maat', changefreq: 'monthly', priority: '0.8' },
    { loc: '/diensten/webshops', changefreq: 'monthly', priority: '0.8' },
    { loc: '/diensten/e-commerce', changefreq: 'monthly', priority: '0.8' },
    { loc: '/portfolio', changefreq: 'weekly', priority: '0.9' },
    { loc: '/over-ons', changefreq: 'monthly', priority: '0.8' },
    { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
    { loc: '/start-je-project', changefreq: 'monthly', priority: '0.7' },
    { loc: '/reviews', changefreq: 'weekly', priority: '0.6' },
    { loc: '/werkgebied', changefreq: 'monthly', priority: '0.7' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { loc: '/cookies', changefreq: 'yearly', priority: '0.3' },
    { loc: '/algemene-voorwaarden', changefreq: 'yearly', priority: '0.3' },
  ];
  entries.push(...staticPages);

  // Portfolio detail pages
  const projectsPath = path.resolve(__dirname, '../src/data/projects.ts');
  const projectSlugs = extractSlugs(projectsPath);
  for (const slug of projectSlugs) {
    entries.push({ loc: `/portfolio/${slug}`, changefreq: 'monthly', priority: '0.6' });
  }

  // Blog post pages
  const blogPath = path.resolve(__dirname, '../src/data/blogPosts.ts');
  const blogSlugs = extractSlugs(blogPath);
  for (const slug of blogSlugs) {
    entries.push({ loc: `/blog/${slug}`, changefreq: 'monthly', priority: '0.7' });
  }

  // Werkgebied pages
  const regionsPath = path.resolve(__dirname, '../src/data/regions.ts');
  const regionSlugs = extractSlugs(regionsPath);
  for (const slug of regionSlugs) {
    entries.push({ loc: `/werkgebied/${slug}`, changefreq: 'monthly', priority: '0.6' });
  }

  // Build XML
  const urlEntries = entries
    .map(
      (e) => `  <url>
    <loc>${BASE_URL}${e.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

// When run directly, write to public/sitemap.xml
const sitemap = buildSitemap();
const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf-8');
console.log(`✅ Sitemap generated with ${sitemap.split('<url>').length - 1} URLs`);
