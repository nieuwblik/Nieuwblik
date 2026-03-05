

## Plan: Homepage & Service Pages Content Updates

### Summary
Four groups of changes across three files, plus a clarification needed about "JM Artworks" (not found in the project data).

---

### 1. Website op Maat (`src/pages/services/WebsiteOpMaat.tsx`)

**Remove**: The entire `<ResponsiveShowcase />` section (line 208) - this is the Puur in Harmonie showcase.

**Update cases array** (lines 75-89): Replace Esveld Installatie and Feitsma Dakwerken with Puur in Harmonie, BeNoted, Danique Kwakman, and Erica van Dijk (pull from `projects` data or import their images). Update the grid to show 4 projects (2x2).

---

### 2. Homepage (`src/pages/Index.tsx`)

**Remove**: The `<ResponsiveShowcase />` component call (line 638) - removes the Puur in Harmonie showcase section.

**Remove**: The `<SocialContentSection />` component call (line 647) - removes the video content section.

**Replace with**: An expanded blog section. Instead of the current `<FeaturedBlogPosts />` which shows only 1 post, create an enhanced version that shows:
- BeNoted case study as the hero/main article (large card)
- 3 additional blog posts in a grid below it

This means updating `FeaturedBlogPosts.tsx` to show the BeNoted blog as the featured post plus 3 more posts in a smaller card grid.

---

### 3. Webshops (`src/pages/services/Webshops.tsx`)

**Add**: A "Recente webshop projecten" section (similar to the cases section on WebsiteOpMaat) featuring:
- Puur in Harmonie (has Stripe/e-commerce)
- Kyodai Originals (e-commerce)
- Bushido Shop (e-commerce)

Import their images from `projects` data and add ProjectCard components.

---

### 4. Clarification Needed

**"JM Artworks"** does not exist in the project data (`src/data/projects.ts`). It needs to be added first with an image, description, and tags before it can be shown on the Webshops page.

---

### Technical Details

- **WebsiteOpMaat.tsx**: Remove `ResponsiveShowcase` import, remove Esveld/Feitsma image imports, import project images for the 4 new cases from `@/assets/projects/`, add `slug` prop to ProjectCard for linking.
- **Index.tsx**: Remove `ResponsiveShowcase` and `SocialContentSection` imports and usages.
- **FeaturedBlogPosts.tsx**: Expand to show 1 featured + 3 secondary blog posts in a grid layout.
- **Webshops.tsx**: Add ProjectCard import, import project images, add a cases section before or after the CTA section.

