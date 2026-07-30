// import { NavLink } from "react-router-dom";

// export default function Sidebar() {
//   return (
//     <>
//       <li className="nav-item">
//         <NavLink to="complaints" className="nav-link">Complaints</NavLink>
//       </li>
//       <li className="nav-item">
//         <NavLink to="payments" className="nav-link">Payments</NavLink>
//       </li>
//       <li className="nav-item mt-auto">
//         <NavLink to="logout" className="nav-link text-danger fw-bold">
//           Logout
//         </NavLink>
//       </li>
//     </>
//   );
// }

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="sidebar d-flex flex-column p-3 border-end" style={{ height: "100vh", width: "220px" }}>
      <ul className="nav nav-pills flex-column flex-grow-1">
        {user?.role === 1 && (
          <>
            <li><NavLink to="users" className="nav-link">Users</NavLink></li>
            <li><NavLink to="societies" className="nav-link">Societies</NavLink></li>
            {/* <li><NavLink to="flats" className="nav-link">Flats</NavLink></li>
            <li><NavLink to="reports" className="nav-link">Reports</NavLink></li>
            <li><NavLink to="documents" className="nav-link">Documents</NavLink></li>
            <li><NavLink to="meetings" className="nav-link">Meetings</NavLink></li>
            <li><NavLink to="notices" className="nav-link">Notices</NavLink></li>
            <li><NavLink to="polls" className="nav-link">Polls</NavLink></li>
           */}
          </>
        )}
        {user?.role === 2 && (
          <>
            <li><NavLink to="UserRegister" className="nav-link">Register Owner</NavLink></li>
            <li><NavLink to="flats" className="nav-link">Flats</NavLink></li>
            <li><NavLink to="complaints" className="nav-link">Complaints</NavLink></li>
            <li><NavLink to="notices" className="nav-link">Notices</NavLink></li>
            <li><NavLink to="meetings" className="nav-link">Meetings</NavLink></li>
            <li><NavLink to="polls" className="nav-link">Polls</NavLink></li>
            <li><NavLink to="documents" className="nav-link">Documents</NavLink></li>

          </>
        )}
        {user?.role === 3 && (
          <>
            <li><NavLink to="UserRegister" className="nav-link">Register Tenant</NavLink></li>
            <li><NavLink to="complaints" className="nav-link">Complaints</NavLink></li>
            <li><NavLink to="documents" className="nav-link">Documents</NavLink></li>sss
            <li><NavLink to="meetings" className="nav-link">Meetings</NavLink></li>
            <li><NavLink to="polls" className="nav-link">Polls</NavLink></li>
            <li><NavLink to="Maintainence" className="nav-link">Maintainence</NavLink></li>
            {/* <li><NavLink to="tenants" className="nav-link">Manage Tenants</NavLink></li>
            <li><NavLink to="booking" className="nav-link">Facility Booking</NavLink></li>
           */}
          </>
        )}
        {user?.role === 4 && (
          <>
            <li><NavLink to="Notice" className="nav-link">Notice</NavLink></li>
            <li><NavLink to="complaints" className="nav-link">Complaints</NavLink></li>
            {/* <li><NavLink to="documents" className="nav-link">Documents</NavLink></li> */}
            <li><NavLink to="meetings" className="nav-link">Meetings</NavLink></li>
            <li><NavLink to="polls" className="nav-link">Polls</NavLink></li>
          </>
        )}
      </ul>

      {/* Logout pinned at bottom */}
      <div className="mt-auto">
        <NavLink to="/logout" className="nav-link text-danger fw-bold">Logout</NavLink>
      </div>
    </div>
  );
}
