import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ManageOwners() {
  const { user, token } = useSelector((state) => state.auth);

  // Active Tab: 'view' or 'register'
  const [activeTab, setActiveTab] = useState("view");

  // Owners & Flats Data
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters for View Tab
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Form State for Register Tab
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // Determine user type to register (Secretary registers Owner, Owner registers Tenant)
  const isOwnerUser = user?.role === 3 || user?.roleName?.toLowerCase() === "owner";
  const entityLabel = isOwnerUser ? "Tenant" : "Owner";
  const entityPluralLabel = isOwnerUser ? "Tenants" : "Owners";

  const societyId =
    user?.societyId ||
    user?.society?.id ||
    user?.society_id ||
    1;

  useEffect(() => {
    fetchOwners();
  }, [societyId]);

  const fetchOwners = async () => {
    setLoading(true);
    setError("");
    try {
      const authHeader = { Authorization: `Bearer ${token || "Secretary"}` };
      const ownersMap = new Map();

      // 1. Fetch flats for this society (guaranteed endpoint on society-service)
      try {
        const flatRes = await fetch(`http://localhost:8080/flats/society/${societyId}`, {
          headers: authHeader,
        });
        if (flatRes.ok) {
          const flats = await flatRes.json();
          if (Array.isArray(flats)) {
            flats.forEach((f) => {
              if (!isOwnerUser) {
                // Managing Owners
                if (f.ownerId) {
                  const names = (f.ownerName || "Owner").trim().split(" ");
                  ownersMap.set(f.ownerId, {
                    id: f.ownerId,
                    firstName: names[0] || "Owner",
                    lastName: names.slice(1).join(" ") || "",
                    email: `owner${f.ownerId}@society.com`,
                    phoneNumber: "—",
                    societyName: f.societyName || user?.societyName || "Society",
                    roleName: "Owner",
                    isActive: true,
                    flatNumber: f.flatNumber,
                  });
                }
              } else {
                // Managing Tenants
                if (f.tenantId) {
                  const names = (f.tenantName || "Tenant").trim().split(" ");
                  ownersMap.set(f.tenantId, {
                    id: f.tenantId,
                    firstName: names[0] || "Tenant",
                    lastName: names.slice(1).join(" ") || "",
                    email: `tenant${f.tenantId}@society.com`,
                    phoneNumber: "—",
                    societyName: f.societyName || user?.societyName || "Society",
                    roleName: "Tenant",
                    isActive: true,
                    flatNumber: f.flatNumber,
                  });
                }
              }
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch flats:", err);
      }

      // 2. Try fetching full user records to augment/enrich contact info
      try {
        const userRes = await fetch(`http://localhost:8080/users/society/${societyId}`, {
          headers: authHeader,
        });
        if (userRes.ok) {
          const userList = await userRes.json();
          if (Array.isArray(userList)) {
            userList.forEach((u) => {
              const roleMatch = !isOwnerUser
                ? (u.roleName || "").toLowerCase() === "owner" || u.roleId === 3
                : (u.roleName || "").toLowerCase() === "tenant" || u.roleId === 4;

              if (roleMatch || !u.roleName) {
                const existing = ownersMap.get(u.id);
                ownersMap.set(u.id, {
                  id: u.id,
                  firstName: u.firstName || (existing ? existing.firstName : "User"),
                  lastName: u.lastName || (existing ? existing.lastName : ""),
                  email: u.email || (existing ? existing.email : "—"),
                  phoneNumber: u.phoneNumber || (existing ? existing.phoneNumber : "—"),
                  societyName: u.societyName || (existing ? existing.societyName : "Society"),
                  roleName: u.roleName || (isOwnerUser ? "Tenant" : "Owner"),
                  isActive: u.isActive !== undefined ? u.isActive : true,
                  flatNumber: existing ? existing.flatNumber : null,
                });
              }
            });
          }
        }
      } catch (err) {
        // User endpoint not ready, flat data is already loaded in map
      }

      setOwners(Array.from(ownersMap.values()));
    } catch (err) {
      console.error("Error loading owners:", err);
      setError("Unable to load members list. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    const payload = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phoneNumber: form.phoneNumber.trim(),
      createdByAdminId: user?.id || 1,
    };

    try {
      const res = await fetch("http://localhost:8080/users/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || "Secretary"}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(
          data.message ||
            `✅ Successfully registered new ${data.roleName || entityLabel}: ${data.firstName || form.firstName}!`
        );
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
        });

        // Re-fetch owners list and switch to View tab
        await fetchOwners();
        setTimeout(() => {
          setActiveTab("view");
        }, 1200);
      } else {
        setError(data.error || "Failed to register user.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while registering user.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered list
  const filteredOwners = owners.filter((o) => {
    const fullName = `${o.firstName || ""} ${o.lastName || ""}`.toLowerCase();
    const email = (o.email || "").toLowerCase();
    const phone = (o.phoneNumber || "").toLowerCase();
    const idStr = (o.id || "").toString();

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase()) ||
      idStr.includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && (o.isActive === true || o.isActive == null)) ||
      (statusFilter === "INACTIVE" && o.isActive === false);

    return matchesSearch && matchesStatus;
  });

  const totalCount = owners.length;
  const activeCount = owners.filter((o) => o.isActive !== false).length;

  return (
    <div className="container-fluid p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            👤 {entityLabel} Management
          </h2>
          <p className="text-muted mb-0">
            View registered {entityPluralLabel.toLowerCase()}, manage contact details, and register new {entityPluralLabel.toLowerCase()} into the society.
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button
            onClick={fetchOwners}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          >
            <span>🔄</span> Refresh
          </button>
          <button
            onClick={() => setActiveTab(activeTab === "view" ? "register" : "view")}
            className={`btn btn-sm d-flex align-items-center gap-1 fw-semibold shadow-sm ${
              activeTab === "register" ? "btn-secondary" : "btn-primary"
            }`}
          >
            {activeTab === "register" ? (
              <>
                <span>📋</span> View {entityPluralLabel} List
              </>
            ) : (
              <>
                <span>➕</span> Register New {entityLabel}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
          <strong>⚠️ Error:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <strong>{successMsg}</strong>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
        </div>
      )}

      {/* Section Tabs (View vs Register) */}
      <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
        <div className="card-body p-2">
          <ul className="nav nav-pills nav-fill gap-2">
            <li className="nav-item">
              <button
                className={`nav-link py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                  activeTab === "view" ? "active bg-primary text-white" : "text-secondary"
                }`}
                onClick={() => setActiveTab("view")}
              >
                <span>👥</span>
                <span>View {entityPluralLabel}</span>
                <span className={`badge ${activeTab === "view" ? "bg-white text-primary" : "bg-light text-secondary"}`}>
                  {totalCount}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                  activeTab === "register" ? "active bg-primary text-white" : "text-secondary"
                }`}
                onClick={() => setActiveTab("register")}
              >
                <span>➕</span>
                <span>Register {entityLabel}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: VIEW OWNERS */}
      {/* ========================================================================= */}
      {activeTab === "view" && (
        <>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-primary h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted fw-semibold">Total Registered {entityPluralLabel}</small>
                    <h3 className="fw-bold text-primary mb-0 mt-1">{totalCount}</h3>
                  </div>
                  <div className="fs-2 text-primary opacity-50">👥</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-success h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted fw-semibold">Active Members</small>
                    <h3 className="fw-bold text-success mb-0 mt-1">{activeCount}</h3>
                  </div>
                  <div className="fs-2 text-success opacity-50">✅</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Layout */}
          <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-secondary">
                  Search {entityPluralLabel}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">🔍</span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder={`Search by name, email, phone number, or ID...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-bold text-secondary">Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All ({totalCount})</option>
                  <option value="ACTIVE">Active ({activeCount})</option>
                  <option value="INACTIVE">Inactive ({totalCount - activeCount})</option>
                </select>
              </div>

              <div className="col-6 col-md-3 text-end">
                <label className="form-label small fw-bold text-secondary d-none d-md-block">Layout</label>
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setViewMode("table")}
                  >
                    ☰ Table
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    ⊞ Grid
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading / Empty / Data Views */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading {entityPluralLabel.toLowerCase()} records...</p>
            </div>
          ) : filteredOwners.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-3 bg-white p-5 text-center text-muted">
              <div className="display-4 mb-3">👤</div>
              <h5 className="fw-bold text-dark">No {entityPluralLabel} Found</h5>
              <p className="small mb-3">
                {searchTerm || statusFilter !== "ALL"
                  ? "No members match your current search and filter criteria."
                  : `No ${entityPluralLabel.toLowerCase()} have been registered in this society yet.`}
              </p>
              <button
                onClick={() => setActiveTab("register")}
                className="btn btn-primary btn-sm mx-auto"
              >
                ➕ Register New {entityLabel}
              </button>
            </div>
          ) : viewMode === "table" ? (
            /* TABLE VIEW */
            <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="text-secondary small text-uppercase">
                      <th className="ps-4">User ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="pe-4 text-end">Society</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOwners.map((owner) => (
                      <tr key={owner.id}>
                        <td className="ps-4">
                          <span className="badge bg-primary-subtle text-primary border border-primary px-2 py-1 fw-bold">
                            #{owner.id}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle bg-light border d-flex align-items-center justify-content-center fw-bold text-primary"
                              style={{ width: "36px", height: "36px" }}
                            >
                              {(owner.firstName || "U")[0]}
                            </div>
                            <div>
                              <div className="fw-bold text-dark">
                                {owner.firstName} {owner.lastName || ""}
                              </div>
                              {owner.flatNumber && (
                                <small className="text-muted">🏠 Flat #{owner.flatNumber}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark">{owner.email || "N/A"}</span>
                        </td>
                        <td>
                          <span className="text-secondary">
                            {owner.phoneNumber ? `📞 ${owner.phoneNumber}` : "—"}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success border border-success">
                            {owner.roleName || entityLabel}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge px-2 py-1 ${
                              owner.isActive !== false
                                ? "bg-success-subtle text-success border border-success"
                                : "bg-danger-subtle text-danger border border-danger"
                            }`}
                          >
                            {owner.isActive !== false ? "🟢 Active" : "🔴 Inactive"}
                          </span>
                        </td>
                        <td className="pe-4 text-end">
                          <small className="text-secondary">{owner.societyName || "Society"}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* GRID VIEW */
            <div className="row g-3">
              {filteredOwners.map((owner) => (
                <div key={owner.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 position-relative border-top border-4 border-success">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-light border d-flex align-items-center justify-content-center fw-bold text-primary fs-5"
                          style={{ width: "42px", height: "42px" }}
                        >
                          {(owner.firstName || "U")[0]}
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">
                            {owner.firstName} {owner.lastName || ""}
                          </h6>
                          <small className="text-muted">ID #{owner.id}</small>
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          owner.isActive !== false
                            ? "bg-success-subtle text-success border border-success"
                            : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {owner.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <hr className="my-2 opacity-25" />

                    <div className="small mb-1 text-truncate">
                      <span className="text-muted">✉️ Email: </span>
                      <span className="text-dark fw-semibold">{owner.email || "N/A"}</span>
                    </div>

                    <div className="small mb-1">
                      <span className="text-muted">📞 Phone: </span>
                      <span className="text-secondary fw-semibold">
                        {owner.phoneNumber || "Not provided"}
                      </span>
                    </div>

                    {owner.flatNumber && (
                      <div className="small mb-1">
                        <span className="text-muted">🏠 Unit: </span>
                        <span className="badge bg-primary-subtle text-primary">
                          Flat #{owner.flatNumber}
                        </span>
                      </div>
                    )}

                    <div className="small text-muted mt-2 pt-2 border-top">
                      <span>🏢 Society: </span>
                      <span className="fw-semibold text-dark">
                        {owner.societyName || "Society"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: REGISTER OWNER */}
      {/* ========================================================================= */}
      {activeTab === "register" && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm rounded-3 bg-white">
              <div className="card-header bg-primary text-white py-3 px-4 rounded-top-3">
                <h5 className="fw-bold mb-0">➕ Register New {entityLabel}</h5>
                <small className="opacity-75">
                  Create a new resident account for {user?.societyName || "your society"}
                </small>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleRegisterSubmit}>
                  {/* First Name & Last Name */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-semibold text-dark">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        placeholder="e.g. John"
                        value={form.firstName}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-semibold text-dark">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        placeholder="e.g. Doe"
                        value={form.lastName}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="e.g. user@example.com"
                      value={form.email}
                      onChange={handleFormChange}
                      required
                    />
                    <div className="form-text text-muted">
                      This will be used as the login username.
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={form.phoneNumber}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  {/* Temporary Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      Initial Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Create a temporary password for the user"
                      value={form.password}
                      onChange={handleFormChange}
                      required
                    />
                    <div className="form-text text-muted">
                      The user will use this initial password to sign in.
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-50"
                      onClick={() => setActiveTab("view")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary w-50 fw-semibold"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Registering...
                        </>
                      ) : (
                        `💾 Register ${entityLabel}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
