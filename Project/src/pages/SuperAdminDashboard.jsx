

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function SuperAdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes("users") ? "users" : "societies"
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    if (location.pathname.includes("users")) {
      setActiveTab("users");
    } else {
      setActiveTab("societies");
    }
  }, [location.pathname]);

  // Mock initial data for Societies (with state for approval/rejection)
  const [societies, setSocieties] = useState([
    {
      id: 1,
      societyName: "Green Valley Heights",
      registrationNumber: "REG-2024-001",
      address: "123 Palm Avenue, Sector 15",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      contactEmail: "admin@greenvalley.com",
      contactPhone: "+91 9876543210",
      status: "PENDING",
      createdAt: "2026-07-20",
    },
    {
      id: 2,
      societyName: "Royal Garden Apartments",
      registrationNumber: "REG-2024-002",
      address: "45 MG Road, Near City Park",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      contactEmail: "contact@royalgarden.org",
      contactPhone: "+91 9812345678",
      status: "APPROVED",
      createdAt: "2026-06-15",
    },
    {
      id: 3,
      societyName: "Sunshine Enclave",
      registrationNumber: "REG-2024-003",
      address: "78 Outer Ring Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      contactEmail: "secretariat@sunshine.com",
      contactPhone: "+91 9900112233",
      status: "REJECTED",
      createdAt: "2026-07-01",
    },
  ]);

  // Mock initial data for Users
  const [users, setUsers] = useState([
    {
      id: 101,
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@gmail.com",
      phoneNumber: "+91 9898989898",
      role: "Secretary",
      societyName: "Green Valley Heights",
      societyId: 1,
      isActive: true,
      status: "APPROVED",
    },
    {
      id: 102,
      firstName: "Priya",
      lastName: "Verma",
      email: "priya.verma@yahoo.com",
      phoneNumber: "+91 9777666555",
      role: "Owner",
      societyName: "Royal Garden Apartments",
      societyId: 2,
      isActive: true,
      status: "APPROVED",
    },
    {
      id: 103,
      firstName: "Amit",
      lastName: "Patel",
      email: "amit.patel@outlook.com",
      phoneNumber: "+91 9666555444",
      role: "Tenant",
      societyName: "Green Valley Heights",
      societyId: 1,
      isActive: false,
      status: "PENDING",
    },
  ]);

  // Handle Approve / Reject actions for Societies
  const handleSocietyStatusChange = (id, newStatus) => {
    setSocieties((prev) =>
      prev.map((soc) => (soc.id === id ? { ...soc, status: newStatus } : soc))
    );
    if (selectedItem?.id === id && activeTab === "societies") {
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Handle Approve / Reject actions for Users
  const handleUserStatusChange = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: newStatus, isActive: newStatus === "APPROVED" }
          : u
      )
    );
    if (selectedItem?.id === id && activeTab === "users") {
      setSelectedItem((prev) =>
        prev
          ? { ...prev, status: newStatus, isActive: newStatus === "APPROVED" }
          : null
      );
    }
  };

  // Filtered lists
  const filteredSocieties = societies.filter((soc) =>
    filterStatus === "ALL" ? true : soc.status === filterStatus
  );

  const filteredUsers = users.filter((u) =>
    filterStatus === "ALL" ? true : u.status === filterStatus
  );

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="p-4 flex-grow-1" style={{ maxWidth: "calc(100vw - 240px)" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h2 className="fw-bold text-dark mb-1">Super Admin Dashboard</h2>
            <p className="text-muted mb-0">Manage and approve societies and user accounts</p>
          </div>
          {/* Status Filter */}
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold text-secondary">Filter Status:</span>
            <select
              className="form-select form-select-sm shadow-sm"
              style={{ width: "140px" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link fw-bold px-4 ${activeTab === "societies" ? "active text-primary border-primary border-bottom-0" : "text-secondary"}`}
              onClick={() => {
                navigate("/superadmin/societies");
                setSelectedItem(null);
              }}
            >
              🏛️ Societies ({societies.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-bold px-4 ${activeTab === "users" ? "active text-primary border-primary border-bottom-0" : "text-secondary"}`}
              onClick={() => {
                navigate("/superadmin/users");
                setSelectedItem(null);
              }}
            >
              👥 Users ({users.length})
            </button>
          </li>
        </ul>

        {/* Table View */}
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-0">
            {activeTab === "societies" ? (
              /* SOCIETIES TABLE */
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Society Name</th>
                      <th>City / State</th>
                      <th>Contact Email</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSocieties.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No societies found matching the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredSocieties.map((soc) => (
                        <tr key={soc.id}>
                          <td className="ps-4 fw-bold text-secondary">#{soc.id}</td>
                          <td>
                            <span className="fw-bold text-dark">{soc.societyName}</span>
                          </td>
                          <td>{soc.city}, {soc.state}</td>
                          <td>{soc.contactEmail}</td>
                          <td>
                            <span
                              className={`badge rounded-pill px-3 py-2 ${soc.status === "APPROVED"
                                  ? "bg-success"
                                  : soc.status === "REJECTED"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                                }`}
                            >
                              {soc.status}
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            <button
                              className="btn btn-sm btn-primary px-3 shadow-sm"
                              onClick={() => setSelectedItem(soc)}
                            >
                              👁️ View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* USERS TABLE */
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">User ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Associated Society</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                          No users found matching the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td className="ps-4 fw-bold text-secondary">#{u.id}</td>
                          <td className="fw-bold text-dark">
                            {u.firstName} {u.lastName}
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className="badge bg-secondary">{u.role}</span>
                          </td>
                          <td className="text-primary fw-semibold">{u.societyName}</td>
                          <td>
                            <span
                              className={`badge rounded-pill px-3 py-2 ${u.status === "APPROVED"
                                  ? "bg-success"
                                  : u.status === "REJECTED"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                                }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            <button
                              className="btn btn-sm btn-primary px-3 shadow-sm"
                              onClick={() => setSelectedItem(u)}
                            >
                              👁️ View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal / Details View */}
        {selectedItem && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
                {/* Modal Header */}
                <div className="modal-header bg-primary text-white p-3 px-4">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4">
                      {activeTab === "societies" ? "🏛️" : "👤"}
                    </span>
                    <div>
                      <h5 className="modal-title fw-bold mb-0">
                        {activeTab === "societies"
                          ? selectedItem.societyName
                          : `${selectedItem.firstName} ${selectedItem.lastName}`}
                      </h5>
                      <small className="opacity-75">
                        {activeTab === "societies"
                          ? `ID #: ${selectedItem.id}`
                          : `Role: ${selectedItem.role}`}
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedItem(null)}
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body p-4 bg-light">
                  {activeTab === "societies" ? (
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Society Name
                          </small>
                          <span className="fw-bold text-dark fs-6">{selectedItem.societyName}</span>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Address
                          </small>
                          <span className="fw-semibold text-dark">{selectedItem.address}</span>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            City
                          </small>
                          <span className="fw-semibold text-dark">{selectedItem.city}</span>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            State
                          </small>
                          <span className="fw-semibold text-dark">{selectedItem.state}</span>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Pincode
                          </small>
                          <span className="fw-semibold text-dark">{selectedItem.pincode}</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Contact Email
                          </small>
                          <span className="fw-semibold text-dark">{selectedItem.contactEmail}</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Contact Phone
                          </small>
                          <span className="fw-semibold text-dark">{selectedItem.contactPhone}</span>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="p-3 bg-white rounded-3 border shadow-sm d-flex justify-content-between align-items-center">
                          <small className="text-uppercase text-muted fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Approval Status
                          </small>
                          <span
                            className={`badge rounded-pill px-3 py-2 fs-6 ${
                              selectedItem.status === "APPROVED"
                                ? "bg-success"
                                : selectedItem.status === "REJECTED"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* USER DETAILS GRID */
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Full Name
                          </small>
                          <span className="fw-bold text-dark fs-6">
                            {selectedItem.firstName} {selectedItem.lastName}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Email Address
                          </small>
                          <span className="fw-semibold text-dark">{selectedItem.email}</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Phone Number
                          </small>
                          <span className="fw-semibold text-dark">{selectedItem.phoneNumber}</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            User Role
                          </small>
                          <span className="badge bg-secondary px-3 py-2 text-uppercase">{selectedItem.role}</span>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="p-3 bg-white rounded-3 border shadow-sm">
                          <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Associated Society
                          </small>
                          <span className="fw-bold text-primary fs-6">{selectedItem.societyName}</span>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="p-3 bg-white rounded-3 border shadow-sm d-flex justify-content-between align-items-center">
                          <small className="text-uppercase text-muted fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            Approval Status
                          </small>
                          <span
                            className={`badge rounded-pill px-3 py-2 fs-6 ${
                              selectedItem.status === "APPROVED"
                                ? "bg-success"
                                : selectedItem.status === "REJECTED"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer with Actions */}
                <div className="modal-footer bg-white border-top p-3 px-4 d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2">
                    {activeTab === "societies" ? (
                      <>
                        <button
                          className="btn btn-success px-4 fw-semibold shadow-sm"
                          disabled={selectedItem.status === "APPROVED"}
                          onClick={() => handleSocietyStatusChange(selectedItem.id, "APPROVED")}
                        >
                          ✓ Approve Society
                        </button>
                        <button
                          className="btn btn-outline-danger px-4 fw-semibold shadow-sm"
                          disabled={selectedItem.status === "REJECTED"}
                          onClick={() => handleSocietyStatusChange(selectedItem.id, "REJECTED")}
                        >
                          ✕ Reject Society
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-success px-4 fw-semibold shadow-sm"
                          disabled={selectedItem.status === "APPROVED"}
                          onClick={() => handleUserStatusChange(selectedItem.id, "APPROVED")}
                        >
                          ✓ Approve User
                        </button>
                        <button
                          className="btn btn-outline-danger px-4 fw-semibold shadow-sm"
                          disabled={selectedItem.status === "REJECTED"}
                          onClick={() => handleUserStatusChange(selectedItem.id, "REJECTED")}
                        >
                          ✕ Reject User
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    className="btn btn-secondary px-4 fw-semibold"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




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
