// import { NavLink } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../redux/authSlice";

// export default function Navbar() {
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
//       <NavLink className="navbar-brand" to="/">Society Management</NavLink>

//       <div className="ms-auto">
//         <NavLink to="/" className="btn btn-outline-light me-2">Home</NavLink>

//         {!isAuthenticated && (
//           <>
//             <NavLink to="/login" className="btn btn-primary me-2">Login</NavLink>
//             <NavLink to="/register" className="btn btn-success">Register</NavLink>
//           </>
//         )}

//         {isAuthenticated && (
//           <>
//             {/* Role-specific dashboard link */}
//             {user?.role === 1 && <NavLink to="/superadmin" className="btn btn-info me-2">Admin Dashboard</NavLink>}
//             {user?.role === 2 && <NavLink to="/secretary" className="btn btn-info me-2">Secretary Dashboard</NavLink>}
//             {user?.role === 3 && <NavLink to="/owner" className="btn btn-info me-2">Owner Dashboard</NavLink>}
//             {user?.role === 4 && <NavLink to="/tenant" className="btn btn-info me-2">Tenant Dashboard</NavLink>}

//             <button onClick={handleLogout} className="btn btn-danger">Logout</button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }


import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  // Check if current route is a dashboard
  const isDashboard =
    location.pathname.includes("/superadmin") ||
    location.pathname.includes("/secretary") ||
    location.pathname.includes("/owner") ||
    location.pathname.includes("/tenant");

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-3"
      style={{ backgroundColor: isDashboard ? "#6a4c93" : "var(--bs-dark)" }}
    >
      {/* Show brand only on public pages */}
      {!isDashboard && (
        <NavLink className="navbar-brand fw-bold" to="/">
          Society Management
        </NavLink>
      )}

      <div className="ms-auto">
        {!isAuthenticated && (
          <>
            <NavLink to="/" className="btn btn-outline-light me-2">
              Home
            </NavLink>
            <NavLink to="/login" className="btn btn-primary me-2">
              Login
            </NavLink>
            {/* <NavLink to="/register" className="btn btn-success">
              Register
            </NavLink> */}
          </>
        )}

        {isAuthenticated && (
          <>
            {/* Role-specific dashboard link */}
            {user?.role === 1 && (
              <NavLink to="/superadmin" className="btn btn-info me-2">
                Admin Dashboard
              </NavLink>
            )}
            {user?.role === 2 && (
              <NavLink to="/secretary" className="btn btn-info me-2">
                Secretary Dashboard
              </NavLink>
            )}
            {user?.role === 3 && (
              <NavLink to="/owner" className="btn btn-info me-2">
                Owner Dashboard
              </NavLink>
            )}
            {user?.role === 4 && (
              <NavLink to="/tenant" className="btn btn-info me-2">
                Tenant Dashboard
              </NavLink>
            )}

            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
