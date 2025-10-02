import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import EtlSyncPage from "./pages/EtlSyncPage";
import { useAuth } from "./context/AuthContext";
import type { ReactElement } from "react";
import Reporte202 from "./pages/Reporte202";
import Logout from "./pages/Logout";

import { API_BASE_URL } from "../config";

function PrivateRoute({ children }: { children: ReactElement }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reportes">
          <Route path="etl" element={<EtlSyncPage />} />
          <Route path="202" element={<Reporte202 apiBaseUrl={API_BASE_URL} token={localStorage.getItem("auth_mde_tk")} />} />
        </Route>
      </Route>

      {/* */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
