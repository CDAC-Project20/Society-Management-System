import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function TenantDashboard() {
  return (
    <div className="d-flex">
      <ul className="nav nav-pills flex-column p-3 border-end">
        {/* Common links */}
        <Sidebar />

        {/* Tenant specific links */}
        <li className="nav-item"><NavLink to="profile" className="nav-link">My Profile</NavLink></li>
        <li className="nav-item"><NavLink to="booking" className="nav-link">Facility Booking</NavLink></li>
      </ul>

      <div className="p-3 flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}
