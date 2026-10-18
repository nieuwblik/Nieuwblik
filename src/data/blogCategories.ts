export const blogCategories = [
  "Website laten maken",
  "Vindbaarheid",
  "Webshops",
  "Merk en ontwerp",
  "Techniek en AI",
  "Nieuwblik en projecten",
] as const;

export type BlogCategory = (typeof blogCategories)[number];