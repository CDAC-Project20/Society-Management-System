import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const getRoleLabel = () => {
    switch (user?.role) {
      case 1:
        return "Super Admin";
      case 2:
        return "Secretary";
      case 3:
        return "Flat Owner";
      case 4:
        return "Tenant";
      default:
        return "Member";
    }
  };

  const getRoleBadgeClass = () => {
    switch (user?.role) {
      case 1:
        return "bg-danger";
      case 2:
        return "bg-primary";
      case 3:
        return "bg-success";
      case 4:
        return "bg-info text-dark";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div
      className="sidebar d-flex flex-column p-3 bg-white border-end shadow-sm"
      style={{ width: "250px", minWidth: "250px", minHeight: "100vh" }}
    >
      {/* Role Header Info */}
      <div className="mb-4 pb-3 border-bottom text-center">
        <div className="fw-bold text-dark fs-5 mb-1">
          🏢 Society Portal
        </div>
        <span className={`badge ${getRoleBadgeClass()} px-3 py-1 text-uppercase`}>
          {getRoleLabel()}
        </span>
        {user?.firstName && (
          <div className="small text-muted mt-2 text-truncate">
            👋 {user.firstName} {user.lastName || ""}
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <ul className="nav nav-pills flex-column flex-grow-1 gap-1">
        {/* SUPER ADMIN (Role 1) */}
        {user?.role === 1 && (
          <>
            <li className="nav-item">
              <NavLink to="/superadmin/societies" className="nav-link d-flex align-items-center gap-2">
                <span>🏢</span> Societies
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/superadmin/flats" className="nav-link d-flex align-items-center gap-2">
                <span>🏠</span> Manage Flats
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/superadmin/payments" className="nav-link d-flex align-items-center gap-2">
                <span>💳</span> Payments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/superadmin/documents" className="nav-link d-flex align-items-center gap-2">
                <span>📂</span> Documents
              </NavLink>
            </li>
          </>
        )}

        {/* SECRETARY (Role 2) */}
        {user?.role === 2 && (
          <>
            <li className="nav-item">
              <NavLink to="/secretary/notices" className="nav-link d-flex align-items-center gap-2">
                <span>📢</span> Notices
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/secretary/complaints" className="nav-link d-flex align-items-center gap-2">
                <span>📝</span> Complaints
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/secretary/payments" className="nav-link d-flex align-items-center gap-2">
                <span>💳</span> Payments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/secretary/flats" className="nav-link d-flex align-items-center gap-2">
                <span>🏠</span> Manage Flats
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/secretary/owners" className="nav-link d-flex align-items-center gap-2">
                <span>👤</span> Manage Owners
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/secretary/documents" className="nav-link d-flex align-items-center gap-2">
                <span>📂</span> Documents
              </NavLink>
            </li>
          </>
        )}

        {/* OWNER (Role 3) */}
        {user?.role === 3 && (
          <>
            <li className="nav-item">
              <NavLink to="/owner/notices" className="nav-link d-flex align-items-center gap-2">
                <span>📢</span> Notices
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/owner/payments" className="nav-link d-flex align-items-center gap-2">
                <span>💳</span> Maintenance Payments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/owner/complaints" className="nav-link d-flex align-items-center gap-2">
                <span>📝</span> Raise Complaint
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/owner/tenants" className="nav-link d-flex align-items-center gap-2">
                <span>👤</span> Manage Tenants
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/owner/documents" className="nav-link d-flex align-items-center gap-2">
                <span>📂</span> Documents
              </NavLink>
            </li>
          </>
        )}

        {/* TENANT (Role 4) */}
        {user?.role === 4 && (
          <>
            <li className="nav-item">
              <NavLink to="/tenant/notices" className="nav-link d-flex align-items-center gap-2">
                <span>📢</span> Notices
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tenant/complaints" className="nav-link d-flex align-items-center gap-2">
                <span>📝</span> Raise Complaint
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tenant/documents" className="nav-link d-flex align-items-center gap-2">
                <span>📂</span> Documents
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Logout link pinned at bottom */}
      <div className="pt-3 border-top mt-auto">
        <NavLink
          to="/logout"
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
        >
          <span>🚪</span> Logout
        </NavLink>
      </div>
    </div>
  );
}
