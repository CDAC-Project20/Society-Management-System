import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function SecretaryDashboard() {
  return (
    <div className="d-flex">
      {/* <ul className="nav nav-pills flex-column p-3 border-end"> */}
        {/* Common links */}
        <Sidebar />

        {/* Secretary specific links */}
        {/* <li className="nav-item"><NavLink to="meetings" className="nav-link">Meetings</NavLink></li>
        <li className="nav-item"><NavLink to="notices" className="nav-link">Notices</NavLink></li>
      </ul> */}

      <div className="p-3 flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}
