import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const getRoleBadge = (role) => {
    switch (role) {
      case 1:
        return "Super Admin";
      case 2:
        return "Secretary";
      case 3:
        return "Owner";
      case 4:
        return "Tenant";
      default:
        return "User";
    }
  };

  return (
    <div
      className="sidebar d-flex flex-column p-3 text-white shadow"
      style={{
        height: "100vh",
        width: "240px",
        minWidth: "240px",
        background: "linear-gradient(180deg, #1e1e2f 0%, #11111d 100%)",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Brand Header */}
      <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom border-secondary border-opacity-25">
        <div
          className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold shadow-sm"
          style={{ width: "38px", height: "38px", fontSize: "1.2rem" }}
        >
          🏢
        </div>
        <div>
          <h6 className="fw-bold text-white mb-0" style={{ letterSpacing: "0.5px" }}>
            Society Portal
          </h6>
          <small className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 py-1 px-2" style={{ fontSize: "0.68rem" }}>
            {getRoleBadge(user?.role)}
          </small>
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="nav nav-pills flex-column flex-grow-1 gap-1">
        {/* SUPER ADMIN (ROLE 1) */}
        {user?.role === 1 && (
          <>
            <li className="nav-item">
              <NavLink
                to="societies"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>🏛️</span> Societies
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="users"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>👥</span> Users
              </NavLink>
            </li>
          </>
        )}

        {/* SECRETARY (ROLE 2) */}
        {user?.role === 2 && (
          <>
            <li className="nav-item">
              <NavLink
                to="UserRegister"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📝</span> Register Owner
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="create-flat"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>🏠</span> Create Flat
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="complaints"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>⚠️</span> Complaints
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="notices"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📢</span> Notices
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="meetings"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📅</span> Meetings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="polls"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📊</span> Polls
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="documents"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📄</span> Documents
              </NavLink>
            </li>
          </>
        )}

        {/* OWNER (ROLE 3) */}
        {user?.role === 3 && (
          <>
            <li className="nav-item">
              <NavLink
                to="complaints"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>⚠️</span> Complaints
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="documents"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📄</span> Documents
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="meetings"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📅</span> Meetings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="polls"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📊</span> Polls
              </NavLink>
            </li>
          </>
        )}

        {/* TENANT (ROLE 4) */}
        {user?.role === 4 && (
          <>
            <li className="nav-item">
              <NavLink
                to="complaints"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>⚠️</span> Complaints
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="meetings"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📅</span> Meetings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="polls"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white-50 ${isActive ? "active bg-primary text-white fw-bold shadow-sm" : "hover-bg"
                  }`
                }
              >
                <span>📊</span> Polls
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* User Footer & Logout */}
      <div className="pt-3 border-top border-secondary border-opacity-25">
        <NavLink
          to="/logout"
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold btn-sm py-2 rounded-3"
        >
          <span>🚪</span> Logout
        </NavLink>
      </div>
    </div>
  );
}

