import { ClientOnly, Outlet, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { useLocation } from "@/lib/router-compat";
import SmoothScroll from "@/components/SmoothScroll";
import ZwevendeKnoppen from "@/components/ZwevendeKnoppen";
import TabNav from "@/components/TabNav";

// De cookiemelding doet pas na de eerste tekening iets; apart geladen blijft
// framer-motion uit de hoofdbundel. De analyse-pop-up zit nu in ZwevendeKnoppen.
const CookieConsent = lazy(() => import("@/components/CookieConsent"));

// Landingspagina's voor advertenties: geen menu, zodat er maar één ding te doen is.
const ZONDER_MENU = new Set(["/gratis-website-analyse", "/bedankt-analyse"]);

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

/**
 * De publieke site: nav, smooth scroll en de bezoekerswidgets horen hier.
 * Het portaal valt hier bewust buiten — dat draait in zijn eigen brug.
 */
function PublicLayout() {
  const { pathname } = useLocation();
  const zonderMenu = ZONDER_MENU.has(pathname.replace(/\/$/, ""));

  return (
    <>
      <SmoothScroll />
      <ZwevendeKnoppen />
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      </ClientOnly>
      {zonderMenu ? (
        <Outlet />
      ) : (
        <TabNav>
          <Outlet />
        </TabNav>
      )}
    </>
  );
}
