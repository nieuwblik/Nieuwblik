import { lazy, Suspense, useEffect, useState } from "react";
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from "react-router-dom";
import { createBrowserHistory, type History } from "@remix-run/router";

import { zetThemaVroeg } from "@/admin/theme";

// Het portaal blijft exact zoals het was: client-side, lazy geladen, op de
// echte react-router. Deze brug mount de oude router onder de
// TanStack-route /admin/*, zodat niets in src/admin/ hoeft te veranderen.
//
// We gebruiken een vooraf aangemaakte history in plaats van BrowserRouter:
// BrowserRouter maakt zijn history tijdens het renderen aan en schrijft
// daarbij direct naar window.history, wat de TanStack-router midden in een
// render een state-update geeft (React-waarschuwing). Door de history in
// een effect (buiten de render) aan te maken gebeurt dat niet.
let adminHistory: History | null = null;
const getAdminHistory = (): History => {
  if (!adminHistory) adminHistory = createBrowserHistory({ v5Compat: true });
  return adminHistory;
};

const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminApp = lazy(() => import("@/admin/AdminApp"));

/**
 * Vangnet: klikt iemand binnen het portaal op een link naar de publieke
 * site, dan doet de interne react-router daar niets mee. Een harde
 * navigatie levert de server-gerenderde pagina op.
 */
const HardNavigate = () => {
  useEffect(() => {
    window.location.assign(window.location.pathname + window.location.search);
  }, []);
  return null;
};

const AdminBridge = () => {
  // Maak de history aan én mount de tweede router pas ná de eerste commit
  // van TanStack, zodat beide buiten de render-fase gebeuren.
  const [ready, setReady] = useState(false);

  // Google Analytics meet het portaal niet. Kom je vanaf de site hier, dan is
  // het script al geladen; deze vlag (die gtag bij elke meting controleert)
  // houdt het stil zolang het portaal openstaat.
  useEffect(() => {
    const vlag = "ga-disable-G-8DLGZ42KPP";
    (window as unknown as Record<string, boolean>)[vlag] = true;
    return () => {
      (window as unknown as Record<string, boolean>)[vlag] = false;
    };
  }, []);

  useEffect(() => {
    // De loginpagina is altijd licht; de rest van het portaal krijgt meteen
    // het gekozen thema, zodat het laden niet wit flitst.
    if (!window.location.pathname.startsWith("/admin/login")) zetThemaVroeg();
    // Start en inloggen staan op de nachtscène: meteen die kleur, zodat het
    // laden niet wit flitst voordat de achtergrond er is.
    const pad = window.location.pathname.replace(/\/$/, "");
    if (pad === "/admin" || pad === "/admin/login") {
      document.documentElement.style.backgroundColor = "#1d2b3d";
      document.body.style.backgroundColor = "#1d2b3d";
    }
    getAdminHistory();
    setReady(true);
  }, []);
  if (!ready) return null;

  return (
    <HistoryRouter
      history={getAdminHistory()}
      future={{ v7_startTransition: true, v7_relativeSplatPath: false }}
    >
      <Routes>
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={null}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<HardNavigate />} />
      </Routes>
    </HistoryRouter>
  );
};

export default AdminBridge;
