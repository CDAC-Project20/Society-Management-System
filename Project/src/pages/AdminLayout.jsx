// import { NavLink, Outlet } from "react-router-dom"
// export default function AdminDashboard() {
//     return (
//         <>
//             <h2>Admin Panel</h2>
//             <div className="d-flex">

//                 <ul className="nav nav-pills flex-column p-3 border-end">
//                     <li className="nav-item">
//                         <NavLink to="user">Users</NavLink>
//                     </li>
//                     <li className="nav-item">
//                         <NavLink to="reports">Reports</NavLink>
//                     </li>
//                     <li className="nav-item">
//                         <NavLink to="logout">Logout</NavLink>
//                     </li>
//                 </ul>

//                 <div className="p-3 flex-grow-1">
//                     <Outlet />
//                 </div>
//             </div>
//         </>
//     )
// }

// src/layouts/AdminLayout.jsx
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="p-4 flex-grow-1" style={{ backgroundColor: "#f5f0ff" }}>
          <Outlet /> {/* renders nested admin pages */}
        </div>
      </div>
    </div>
  );
}
