import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function OwnerDashboard() {
  return (
    <div className="d-flex">
      {/* <ul className="nav nav-pills flex-column p-3 border-end"> */}
        {/* Common links */}
        <Sidebar />

        {/* Owner specific links */}
        
      {/* </ul> */}

      <div className="p-3 flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}
