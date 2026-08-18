import { useEffect } from "react";

/**
 * Maakt het portaal installeerbaar, en alleen het portaal.
 *
 * Het manifest hangt hier en niet in index.html: de publieke site hoort geen
 * installatievoorstel te krijgen voor een beheeromgeving. Bij het verlaten van
 * het portaal ruimen we alles weer op, zodat de marketingpagina's precies zijn
 * zoals ze waren.
 *
 * Het manifest zelf staat op /admin/ en heeft die map als bereik. Daardoor
 * blijft een geïnstalleerd portaal binnen /admin: een link naar de publieke
 * site opent in de gewone browser en niet in de app.
 */
export function usePortalPwa() {
  useEffect(() => {
    const toegevoegd: Element[] = [];

    const zet = (tag: string, attrs: Record<string, string>) => {
      const el = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      document.head.appendChild(el);
      toegevoegd.push(el);
      return el;
    };

    zet("link", { rel: "manifest", href: "/admin/manifest.webmanifest" });

    // iOS kent geen manifest-installatie; die leest deze drie.
    zet("meta", { name: "apple-mobile-web-app-capable", content: "yes" });
    zet("meta", { name: "apple-mobile-web-app-title", content: "Portaal" });
    zet("meta", { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" });
    // Zelfde maat als de regel in index.html, zodat deze die overschrijft in
    // plaats van ernaast te bestaan.
    zet("link", { rel: "apple-touch-icon", sizes: "180x180", href: "/admin/icon-192.png" });

    // De publieke themakleur is lichter; even overnemen zolang je hier bent,
    // anders krijgt de statusbalk van de app de verkeerde tint.
    const thema = document.querySelector('meta[name="theme-color"]');
    const oudeThema = thema?.getAttribute("content") ?? null;
    thema?.setAttribute("content", "#064e3b");

    return () => {
      for (const el of toegevoegd) el.remove();
      if (thema && oudeThema !== null) thema.setAttribute("content", oudeThema);
    };
  }, []);
}
