import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

// Auth & Public Pages
import HomeComp from "./pages/Home";
import LoginComp from "./pages/LoginComp";
import LogoutComp from "./pages/LogOutComp";
import SocietyRegisterComp from "./pages/SocetyRegister";
import Navbar from "./pages/Navbar";
import ProtectedRoute from "./components/ProtectedRoutes";

// Dashboard Layouts
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SecretaryDashboard from "./pages/SecretaryDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from "./pages/TenantDashboard";

// Feature Components
import UserRegister from "./pages/UserRegister";
import ManageOwners from "./pages/ManageOwners";
import ManageFlats from "./pages/ManageFlats";
import CreateFlat from "./pages/CreateFlat";
import SecretaryNotices from "./pages/SecretaryNotices";
import SecretaryComplaints from "./pages/SecretaryComplaints";
import RaiseComplaint from "./pages/RaiseComplaint";
import OwnerPayments from "./pages/OwnerPayments";
import ViewPayments from "./pages/ViewPayments";
import Documents from "./pages/Documents";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeComp />} />
        <Route path="/login" element={<LoginComp />} />
        <Route path="/register" element={<SocietyRegisterComp />} />
        <Route path="/logout" element={<LogoutComp />} />

        {/* Super Admin Routes (Role 1) */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute role={1}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="societies" replace />} />
          <Route path="societies" element={null} />
          <Route path="flats" element={<ManageFlats />} />
          <Route path="payments" element={<ViewPayments />} />
          <Route path="documents" element={<Documents />} />
        </Route>

        {/* Secretary Routes (Role 2) */}
        <Route
          path="/secretary"
          element={
            <ProtectedRoute role={2}>
              <SecretaryDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="notices" replace />} />
          <Route path="notices" element={<SecretaryNotices />} />
          <Route path="complaints" element={<SecretaryComplaints />} />
          <Route path="payments" element={<ViewPayments />} />
          <Route path="flats" element={<ManageFlats />} />
          <Route path="owners" element={<ManageOwners />} />
          <Route path="UserRegister" element={<ManageOwners />} />
          <Route path="documents" element={<Documents />} />
        </Route>

        {/* Owner Routes (Role 3) */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute role={3}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="notices" replace />} />
          <Route path="notices" element={<SecretaryNotices />} />
          <Route path="Notice" element={<Navigate to="../notices" replace />} />
          <Route path="payments" element={<OwnerPayments />} />
          <Route path="Maintainence" element={<Navigate to="../payments" replace />} />
          <Route path="complaints" element={<RaiseComplaint />} />
          <Route path="tenants" element={<ManageOwners />} />
          <Route path="UserRegister" element={<ManageOwners />} />
          <Route path="documents" element={<Documents />} />
        </Route>

        {/* Tenant Routes (Role 4) */}
        <Route
          path="/tenant"
          element={
            <ProtectedRoute role={4}>
              <TenantDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="notices" replace />} />
          <Route path="notices" element={<SecretaryNotices />} />
          <Route path="Notice" element={<Navigate to="../notices" replace />} />
          <Route path="complaints" element={<RaiseComplaint />} />
          <Route path="documents" element={<Documents />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
