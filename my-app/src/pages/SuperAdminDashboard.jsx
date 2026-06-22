// import { NavLink, Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

// export default function SuperAdminDashboard() {
//   return (
//     <div className="d-flex">
//       {/* <ul className="nav nav-pills flex-column p-3 border-end"> */}
//         {/* Common links */}
//         <Sidebar />

//         {/* Super Admin specific links
//         <li className="nav-item"><NavLink to="users" className="nav-link">Users</NavLink></li>
//         <li className="nav-item"><NavLink to="flats" className="nav-link">Flats</NavLink></li>
//         <li className="nav-item"><NavLink to="reports" className="nav-link">Reports</NavLink></li>
//         <li className="nav-item"><NavLink to="documents" className="nav-link">Documents</NavLink></li>
//         <li className="nav-item"><NavLink to="meetings" className="nav-link">Meetings</NavLink></li>
//         <li className="nav-item"><NavLink to="notices" className="nav-link">Notices</NavLink></li>
//         <li className="nav-item"><NavLink to="polls" className="nav-link">Polls</NavLink></li>
//       </ul> */}
//       {/* </ul> */}

//       <div className="p-3 flex-grow-1">
//         <Outlet />
//       </div>
//     </div>
//   );
// }


import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function SuperAdminDashboard() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar always visible on the left */}
      <Sidebar />

      {/* Right content area */}
      <div className="p-3 flex-grow-1" style={{ backgroundColor: "#f5f0ff" }}>
        <Outlet /> {/* renders nested routes like users, flats, etc. */}
      </div>
    </div>
  );
}
