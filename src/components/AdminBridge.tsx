import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Het portaal blijft exact zoals het was: client-side, lazy geladen, op de
// echte react-router. Deze brug mount de oude BrowserRouter onder de
// TanStack-route /admin/*, zodat niets in src/admin/ hoeft te veranderen.
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
  // Mount de tweede router pas ná de eerste commit van TanStack, anders
  // waarschuwt React over een state-update tijdens het renderen van
  // BrowserRouter (twee routers die elkaars overgang raken).
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
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
    </BrowserRouter>
  );
};

export default AdminBridge;
