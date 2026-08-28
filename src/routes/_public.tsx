import { ClientOnly, Outlet, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import UnderlayNav, { type UnderlayNavItem } from "@/components/UnderlayNav";
import { companyInfo } from "@/config/company";

// Twee overlays die pas na de eerste tekening iets doen; apart geladen
// blijft framer-motion uit de hoofdbundel (zelfde opzet als voorheen).
const CookieConsent = lazy(() => import("@/components/CookieConsent"));
const FreeAnalysisPopup = lazy(() => import("@/components/FreeAnalysisPopup"));

const NAV_LINKS: UnderlayNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/diensten" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Over Ons", href: "/over-ons" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Only LinkedIn is a real Nieuwblik account (see config/company.ts) — the
// reference's Instagram/X entries would be dead links, so they're not here.
const NAV_SOCIALS: UnderlayNavItem[] = [
  { label: "LinkedIn ↗", href: companyInfo.social.linkedin },
];

const NAV_QUICK_LINKS: UnderlayNavItem[] = [
  { label: "Privacybeleid", href: "/privacy" },
  { label: "Algemene voorwaarden", href: "/algemene-voorwaarden" },
  { label: "Cookies", href: "/cookies" },
];

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

/**
 * De publieke site: nav, smooth scroll en de bezoekerswidgets horen hier.
 * Het portaal valt hier bewust buiten — dat draait in zijn eigen brug.
 */
function PublicLayout() {
  return (
    <>
      <SmoothScroll />
      <WhatsAppButton />
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <CookieConsent />
          <FreeAnalysisPopup />
        </Suspense>
      </ClientOnly>
      <UnderlayNav links={NAV_LINKS} socials={NAV_SOCIALS} quickLinks={NAV_QUICK_LINKS}>
        <Outlet />
      </UnderlayNav>
    </>
  );
}
