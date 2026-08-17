import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AdminAuthProvider } from "@/admin/AdminAuthContext";
import AdminLayout from "@/admin/AdminLayout";
import ClientDetail from "@/admin/pages/ClientDetail";
import Clients from "@/admin/pages/Clients";
import Dashboard from "@/admin/pages/Dashboard";
import ProjectDetail from "@/admin/pages/ProjectDetail";
import Reviews from "@/admin/pages/Reviews";
import Tasks from "@/admin/pages/Tasks";

/** Houdt een eventueel ?status=-filter vast bij het doorsturen. */
const ToClients = () => {
  const { search } = useLocation();
  return <Navigate to={`/admin/klanten${search}`} replace />;
};

/**
 * Het hele portaal in één lazy chunk. Bezoekers van de publieke site laden
 * hier niets van: App.tsx haalt deze module pas op zodra /admin geopend wordt.
 *
 * De paden zijn relatief aan /admin, want App.tsx mount dit op "/admin/*".
 *
 * Klanten en projecten zijn samengevoegd tot één ingang. De detailpagina
 * blijft op het project staan: taken, bestanden en de tijdlijn hangen daaraan,
 * en zo blijven bestaande links en "recent bekeken" werken.
 */
const AdminApp = () => (
  <AdminAuthProvider>
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="klanten" element={<Clients />} />
        <Route path="klanten/:id" element={<ClientDetail />} />
        <Route path="projecten/:id" element={<ProjectDetail />} />
        <Route path="taken" element={<Tasks />} />
        <Route path="reviews" element={<Reviews />} />
        {/* Oude adressen uit eerdere versies van het portaal. */}
        <Route path="projecten" element={<ToClients />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  </AdminAuthProvider>
);

export default AdminApp;
