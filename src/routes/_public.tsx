import { ClientOnly, Outlet, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import SmoothScroll from "@/components/SmoothScroll";
import ZwevendeKnoppen from "@/components/ZwevendeKnoppen";
import TabNav from "@/components/TabNav";

// De cookiemelding doet pas na de eerste tekening iets; apart geladen blijft
// framer-motion uit de hoofdbundel. De analyse-pop-up zit nu in ZwevendeKnoppen.
const CookieConsent = lazy(() => import("@/components/CookieConsent"));

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
      <ZwevendeKnoppen />
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      </ClientOnly>
      <TabNav>
        <Outlet />
      </TabNav>
    </>
  );
}
