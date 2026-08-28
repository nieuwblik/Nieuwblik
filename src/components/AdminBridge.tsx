import { lazy, Suspense, useEffect, useState } from "react";
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from "react-router-dom";
import { createBrowserHistory, type BrowserHistory } from "history";

// Het portaal blijft exact zoals het was: client-side, lazy geladen, op de
// echte react-router. Deze brug mount de oude router onder de
// TanStack-route /admin/*, zodat niets in src/admin/ hoeft te veranderen.
//
// We gebruiken een vooraf aangemaakte history in plaats van BrowserRouter:
// BrowserRouter maakt zijn history tijdens het renderen aan en schrijft
// daarbij direct naar window.history, wat de TanStack-router midden in een
// render een state-update geeft (React-waarschuwing). Door de history één
// keer buiten React aan te maken gebeurt dat niet.
let adminHistory: BrowserHistory | null = null;
const getAdminHistory = (): BrowserHistory => {
  if (!adminHistory) adminHistory = createBrowserHistory();
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
  // Mount de tweede router pas ná de eerste commit van TanStack.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <HistoryRouter history={getAdminHistory()} future={{ v7_startTransition: true }}>
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
