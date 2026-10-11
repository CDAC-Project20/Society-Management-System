import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function SecretaryDashboard() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Sidebar />
      <div className="p-3 flex-grow-1" style={{ maxWidth: "calc(100vw - 250px)" }}>
        <Outlet />
      </div>
    </div>
  );
}
