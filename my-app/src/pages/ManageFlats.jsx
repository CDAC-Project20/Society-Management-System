import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ManageFlats() {
  const { user, token } = useSelector((state) => state.auth);

  // Active Tab: 'view' or 'create'
  const [activeTab, setActiveTab] = useState("view");

  // Flats Data
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters for View Tab
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Form State for Create Tab
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    flatNumber: "",
    floorNumber: "",
    flatType: "2BHK",
    status: "Occupied",
    ownerId: "",
    tenantId: "",
  });

  const societyId =
    user?.societyId ||
    user?.society?.id ||
    user?.society_id ||
    1;

  useEffect(() => {
    fetchFlats();
  }, [societyId]);

  const fetchFlats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8080/flats/society/${societyId}`, {
        headers: {
          Authorization: `Bearer ${token || "dummy"}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setFlats(Array.isArray(data) ? data : []);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Failed to fetch flats for this society.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateFlat = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    const payload = {
      flatNumber: form.flatNumber.trim(),
      floorNumber: form.floorNumber ? parseInt(form.floorNumber, 10) : null,
      flatType: form.flatType,
      status: form.status,
      ownerId: form.ownerId ? parseInt(form.ownerId, 10) : null,
      tenantId: form.tenantId ? parseInt(form.tenantId, 10) : null,
      secretaryId: user?.id || 1,
    };

    try {
      const res = await fetch("http://localhost:8080/flats/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || "Secretary"}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(`✅ Flat ${data.flatNumber || form.flatNumber} created successfully!`);
        setForm({
          flatNumber: "",
          floorNumber: "",
          flatType: "2BHK",
          status: "Occupied",
          ownerId: "",
          tenantId: "",
        });
        // Refresh flat list and switch back to view
        await fetchFlats();
        setTimeout(() => {
          setActiveTab("view");
        }, 1200);
      } else {
        setError(data.error || "Failed to create flat.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while creating flat.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Flats
  const filteredFlats = flats.filter((f) => {
    const matchesSearch =
      (f.flatNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.ownerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.tenantName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.floorNumber?.toString() || "").includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" ||
      (f.status || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === "ALL" ||
      (f.flatType || "").toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCount = flats.length;
  const occupiedCount = flats.filter((f) => (f.status || "").toLowerCase() === "occupied").length;
  const vacantCount = flats.filter((f) => (f.status || "").toLowerCase() === "vacant").length;

  return (
    <div className="container-fluid p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">🏠 Flat Management</h2>
          <p className="text-muted mb-0">
            View society flats, occupancy status, assigned owners, tenants, and create new flat entries.
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button
            onClick={fetchFlats}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          >
            <span>🔄</span> Refresh
          </button>
          <button
            onClick={() => setActiveTab(activeTab === "view" ? "create" : "view")}
            className={`btn btn-sm d-flex align-items-center gap-1 fw-semibold shadow-sm ${
              activeTab === "create" ? "btn-secondary" : "btn-primary"
            }`}
          >
            {activeTab === "create" ? (
              <>
                <span>📋</span> View Flats List
              </>
            ) : (
              <>
                <span>➕</span> Create New Flat
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

      {/* Section Tabs (View Flat vs Create Flat) */}
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
                <span>🏢</span>
                <span>View Flats</span>
                <span className={`badge ${activeTab === "view" ? "bg-white text-primary" : "bg-light text-secondary"}`}>
                  {totalCount}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                  activeTab === "create" ? "active bg-primary text-white" : "text-secondary"
                }`}
                onClick={() => setActiveTab("create")}
              >
                <span>➕</span>
                <span>Create Flat</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: VIEW FLATS */}
      {/* ========================================================================= */}
      {activeTab === "view" && (
        <>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-primary h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted fw-semibold">Total Flats</small>
                    <h3 className="fw-bold text-primary mb-0 mt-1">{totalCount}</h3>
                  </div>
                  <div className="fs-2 text-primary opacity-50">🏢</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-success h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted fw-semibold">Occupied Flats</small>
                    <h3 className="fw-bold text-success mb-0 mt-1">{occupiedCount}</h3>
                  </div>
                  <div className="fs-2 text-success opacity-50">👥</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-warning h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted fw-semibold">Vacant Flats</small>
                    <h3 className="fw-bold text-warning mb-0 mt-1">{vacantCount}</h3>
                  </div>
                  <div className="fs-2 text-warning opacity-50">🔑</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter & View Controls */}
          <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-5">
                <label className="form-label small fw-bold text-secondary">Search Flats</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">🔍</span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search by flat #, floor, owner, or tenant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-bold text-secondary">Occupancy Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status ({totalCount})</option>
                  <option value="Occupied">Occupied ({occupiedCount})</option>
                  <option value="Vacant">Vacant ({vacantCount})</option>
                </select>
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small fw-bold text-secondary">Flat Type</label>
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="ALL">All Types</option>
                  <option value="1BHK">1 BHK</option>
                  <option value="2BHK">2 BHK</option>
                  <option value="3BHK">3 BHK</option>
                  <option value="4BHK">4 BHK</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="col-12 col-md-2 text-md-end">
                <label className="form-label small fw-bold text-secondary d-none d-md-block">Layout</label>
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setViewMode("table")}
                    title="Table View"
                  >
                    ☰ Table
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setViewMode("grid")}
                    title="Grid Cards View"
                  >
                    ⊞ Grid
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Spinner */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading flats data...</p>
            </div>
          ) : filteredFlats.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-3 bg-white p-5 text-center text-muted">
              <div className="display-4 mb-3">🏢</div>
              <h5 className="fw-bold text-dark">No Flats Found</h5>
              <p className="small mb-3">
                {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL"
                  ? "No flats match your current search and filter criteria."
                  : "No flats have been added to this society yet."}
              </p>
              <button
                onClick={() => setActiveTab("create")}
                className="btn btn-primary btn-sm mx-auto"
              >
                ➕ Create Flat
              </button>
            </div>
          ) : viewMode === "table" ? (
            /* TABLE VIEW */
            <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="text-secondary small text-uppercase">
                      <th className="ps-4">Flat Number</th>
                      <th>Floor</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Owner</th>
                      <th>Tenant</th>
                      <th className="pe-4 text-end">Society</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFlats.map((flat) => (
                      <tr key={flat.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary-subtle text-primary border border-primary px-2 py-1 fw-bold fs-6">
                              {flat.flatNumber}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark fw-semibold">
                            {flat.floorNumber != null ? `Floor ${flat.floorNumber}` : "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {flat.flatType || "Standard"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge px-2 py-1 ${
                              (flat.status || "").toLowerCase() === "occupied"
                                ? "bg-success-subtle text-success border border-success"
                                : "bg-warning-subtle text-warning border border-warning"
                            }`}
                          >
                            {(flat.status || "").toLowerCase() === "occupied" ? "🟢 Occupied" : "🟡 Vacant"}
                          </span>
                        </td>
                        <td>
                          {flat.ownerName ? (
                            <div>
                              <div className="fw-semibold text-dark">👤 {flat.ownerName}</div>
                              <small className="text-muted">ID #{flat.ownerId}</small>
                            </div>
                          ) : (
                            <span className="text-muted fst-italic">Unassigned</span>
                          )}
                        </td>
                        <td>
                          {flat.tenantName ? (
                            <div>
                              <div className="fw-semibold text-dark">👥 {flat.tenantName}</div>
                              <small className="text-muted">ID #{flat.tenantId}</small>
                            </div>
                          ) : (
                            <span className="text-muted small">No Tenant</span>
                          )}
                        </td>
                        <td className="pe-4 text-end">
                          <small className="text-secondary">{flat.societyName || "Society"}</small>
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
              {filteredFlats.map((flat) => (
                <div key={flat.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 position-relative border-top border-4 border-primary">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="fw-bold text-primary mb-0">{flat.flatNumber}</h4>
                      <span
                        className={`badge px-2 py-1 ${
                          (flat.status || "").toLowerCase() === "occupied"
                            ? "bg-success-subtle text-success border border-success"
                            : "bg-warning-subtle text-warning border border-warning"
                        }`}
                      >
                        {(flat.status || "").toLowerCase() === "occupied" ? "🟢 Occupied" : "🟡 Vacant"}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="badge bg-light text-dark border me-1">
                        🏢 Floor {flat.floorNumber != null ? flat.floorNumber : "N/A"}
                      </span>
                      <span className="badge bg-light text-dark border">
                        🏷️ {flat.flatType || "2BHK"}
                      </span>
                    </div>

                    <hr className="my-2 opacity-25" />

                    <div className="small mb-1">
                      <span className="text-muted">Owner: </span>
                      <span className="fw-semibold text-dark">
                        {flat.ownerName || `Owner #${flat.ownerId || "N/A"}`}
                      </span>
                    </div>

                    <div className="small text-muted">
                      <span>Tenant: </span>
                      <span className="fw-semibold text-secondary">
                        {flat.tenantName || "None"}
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
      {/* SECTION 2: CREATE FLAT */}
      {/* ========================================================================= */}
      {activeTab === "create" && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm rounded-3 bg-white">
              <div className="card-header bg-primary text-white py-3 px-4 rounded-top-3">
                <h5 className="fw-bold mb-0">➕ Create New Flat Entry</h5>
                <small className="opacity-75">
                  Register a new flat unit for {user?.societyName || "your society"}
                </small>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleCreateFlat}>
                  {/* Flat Number & Floor */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-semibold text-dark">
                        Flat Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="flatNumber"
                        className="form-control"
                        placeholder="e.g. A-101, B-204"
                        value={form.flatNumber}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-semibold text-dark">
                        Floor Number
                      </label>
                      <input
                        type="number"
                        name="floorNumber"
                        className="form-control"
                        placeholder="e.g. 1, 2, 3"
                        value={form.floorNumber}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  {/* Flat Type & Status */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-semibold text-dark">
                        Flat Type <span className="text-danger">*</span>
                      </label>
                      <select
                        name="flatType"
                        className="form-select"
                        value={form.flatType}
                        onChange={handleFormChange}
                      >
                        <option value="1BHK">1 BHK</option>
                        <option value="2BHK">2 BHK</option>
                        <option value="3BHK">3 BHK</option>
                        <option value="4BHK">4 BHK</option>
                        <option value="Studio">Studio</option>
                        <option value="Penthouse">Penthouse</option>
                      </select>
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-semibold text-dark">
                        Occupancy Status <span className="text-danger">*</span>
                      </label>
                      <select
                        name="status"
                        className="form-select"
                        value={form.status}
                        onChange={handleFormChange}
                      >
                        <option value="Occupied">Occupied</option>
                        <option value="Vacant">Vacant</option>
                      </select>
                    </div>
                  </div>

                  {/* Owner User ID */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Owner User ID <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="ownerId"
                      className="form-control"
                      placeholder="Enter registered Owner's User ID (e.g. 2, 3, 4)"
                      value={form.ownerId}
                      onChange={handleFormChange}
                      required
                    />
                    <div className="form-text text-muted">
                      💡 Enter the numeric User ID of the registered Flat Owner.
                    </div>
                  </div>

                  {/* Tenant User ID (Optional) */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      Tenant User ID <span className="text-muted small">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      name="tenantId"
                      className="form-control"
                      placeholder="Enter Tenant's User ID if occupied by a tenant"
                      value={form.tenantId}
                      onChange={handleFormChange}
                    />
                    <div className="form-text text-muted">
                      Leave empty if the flat is owner-occupied or currently vacant.
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
                          Creating...
                        </>
                      ) : (
                        "💾 Create Flat"
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
