import { Navigate, Route, Routes } from "react-router-dom";

import { AdminAuthProvider } from "@/admin/AdminAuthContext";
import AdminLayout from "@/admin/AdminLayout";
import ClientDetail from "@/admin/pages/ClientDetail";
import Clients from "@/admin/pages/Clients";
import Dashboard from "@/admin/pages/Dashboard";
import ProjectDetail from "@/admin/pages/ProjectDetail";
import Projects from "@/admin/pages/Projects";
import Reviews from "@/admin/pages/Reviews";
import Tasks from "@/admin/pages/Tasks";

/**
 * Het hele portaal in één lazy chunk. Bezoekers van de publieke site laden
 * hier niets van: App.tsx haalt deze module pas op zodra /admin geopend wordt.
 *
 * De paden zijn relatief aan /admin, want App.tsx mount dit op "/admin/*".
 */
const AdminApp = () => (
  <AdminAuthProvider>
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projecten" element={<Projects />} />
        <Route path="projecten/:id" element={<ProjectDetail />} />
        <Route path="klanten" element={<Clients />} />
        <Route path="klanten/:id" element={<ClientDetail />} />
        <Route path="taken" element={<Tasks />} />
        <Route path="reviews" element={<Reviews />} />
        {/* Het oude adres uit de vorige versie van het dashboard. */}
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  </AdminAuthProvider>
);

export default AdminApp;
