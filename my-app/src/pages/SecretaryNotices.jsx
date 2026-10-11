import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function SecretaryNotices() {
  const { user, token } = useSelector((state) => state.auth);

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State for New Notice (Secretary / Admin only)
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    expiryDateStr: "",
  });

  // Modal State for Viewing Details (All users)
  const [selectedNoticeForView, setSelectedNoticeForView] = useState(null);

  const isSuperAdmin = user?.role === 1;
  const isSecretary = user?.role === 2;
  const canManage = isSuperAdmin || isSecretary;

  const societyId =
    user?.societyId ||
    user?.society?.id ||
    user?.society_id ||
    (isSuperAdmin ? null : 1);

  useEffect(() => {
    fetchNotices();
  }, [societyId]);

  const fetchNotices = async () => {
    setLoading(true);
    setError("");
    try {
      const url =
        societyId && !isSuperAdmin
          ? `http://localhost:8080/notices/society/${societyId}`
          : `http://localhost:8080/notices/all`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNotices(Array.isArray(data) ? data : []);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Failed to fetch notices.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!canManage) return;

    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    const payload = {
      societyId: societyId,
      publishedById: user?.id,
      title: form.title,
      description: form.description,
      expiryDateStr: form.expiryDateStr,
    };

    try {
      const res = await fetch("http://localhost:8080/notices/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newNotice = await res.json();
        setNotices((prev) => [newNotice, ...prev]);
        setSuccessMsg(`Notice "${newNotice.title}" published successfully!`);
        setShowModal(false);
        setForm({ title: "", description: "", expiryDateStr: "" });
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Failed to publish notice.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while publishing notice.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (!canManage) return;

    if (!window.confirm(`Are you sure you want to delete Notice #${noticeId}?`)) {
      return;
    }

    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`http://localhost:8080/notices/${noticeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (res.ok) {
        setNotices((prev) => prev.filter((n) => n.id !== noticeId));
        setSuccessMsg(`Notice #${noticeId} deleted successfully.`);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Failed to delete notice.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while deleting notice.");
    }
  };

  // Filter notices
  const filteredNotices = notices.filter((n) => {
    return (
      (n.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalCount = notices.length;

  return (
    <div className="container-fluid p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Page Title & Actions */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            📢 Society Notices
          </h2>
          <p className="text-muted mb-0">
            {canManage
              ? "Publish, manage, and broadcast notices to all society members."
              : "Official notices, maintenance schedules, and updates from society management."}
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button
            onClick={fetchNotices}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          >
            <span>🔄</span> Refresh
          </button>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary btn-sm d-flex align-items-center gap-1 fw-semibold shadow-sm"
            >
              <span>➕</span> Publish Notice
            </button>
          )}
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
          <strong>✅ Success:</strong> {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
        </div>
      )}

      {/* Stat Card */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-primary h-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold">Total Notices</small>
                <h3 className="fw-bold text-primary mb-0 mt-1">{totalCount}</h3>
              </div>
              <div className="fs-2 text-primary opacity-50">📢</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label small fw-bold text-secondary">Search Notices</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by title or notice description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Fetching latest society notices...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-3 bg-white p-5 text-center text-muted">
          <div className="display-4 mb-3">📭</div>
          <h5 className="fw-bold text-dark">No Notices Found</h5>
          <p className="small mb-0">
            {canManage
              ? 'Click "Publish Notice" to broadcast a new announcement to all residents.'
              : "There are no notices posted for your society at this moment."}
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredNotices.map((n) => (
            <div className="col-12 col-md-6 col-xl-4" key={n.id}>
              <div className="card h-100 border-0 shadow-sm rounded-3 bg-white d-flex flex-column hover-shadow">
                <div className="card-header bg-transparent border-0 pt-3 px-3 d-flex justify-content-between align-items-center">
                  {n.expired ? (
                    <span className="badge bg-secondary-subtle text-secondary border border-secondary px-2 py-1">
                      ⌛ Expired
                    </span>
                  ) : (
                    <span className="badge bg-success-subtle text-success border border-success px-2 py-1">
                      🟢 Active Notice
                    </span>
                  )}
                  <small className="text-muted fw-semibold">Notice #{n.id}</small>
                </div>

                <div className="card-body px-3 py-2 flex-grow-1">
                  <h5 className="fw-bold text-dark mb-2 text-truncate" title={n.title}>
                    {n.title}
                  </h5>
                  <p
                    className="card-text text-secondary small text-truncate-3"
                    style={{
                      whiteSpace: "pre-line",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      minHeight: "4.2em",
                    }}
                  >
                    {n.description || "No detailed description provided."}
                  </p>
                </div>

                <div className="card-footer bg-light border-0 px-3 py-2 mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-1 small text-muted">
                    <span>
                      📅 <strong>Published:</strong>{" "}
                      {n.publishDate ? new Date(n.publishDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  {n.expiryDate && (
                    <div className="d-flex justify-content-between align-items-center mb-2 small text-muted">
                      <span>
                        ⌛ <strong>Expires:</strong>{" "}
                        {new Date(n.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <small className="text-muted">By: {n.publishedByName || "Management"}</small>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm py-1 px-2"
                        onClick={() => setSelectedNoticeForView(n)}
                        title="Read Full Notice"
                      >
                        👁️ Read Details
                      </button>
                      {canManage && (
                        <button
                          className="btn btn-outline-danger btn-sm py-1 px-2"
                          onClick={() => handleDeleteNotice(n.id)}
                          title="Delete Notice"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notice Detail View Modal (For Residents & Admins) */}
      {selectedNoticeForView && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-5">📢</span>
                  <h5 className="modal-title fw-bold mb-0">Notice Details</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedNoticeForView(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold text-dark mb-0">{selectedNoticeForView.title}</h4>
                  {selectedNoticeForView.expired ? (
                    <span className="badge bg-secondary-subtle text-secondary border border-secondary px-2 py-1">
                      ⌛ Expired
                    </span>
                  ) : (
                    <span className="badge bg-success-subtle text-success border border-success px-2 py-1">
                      🟢 Active Notice
                    </span>
                  )}
                </div>

                <div className="p-3 bg-light rounded-3 mb-3 small text-muted d-flex flex-wrap gap-4 border">
                  <div>
                    <strong>📅 Published Date:</strong>{" "}
                    {selectedNoticeForView.publishDate
                      ? new Date(selectedNoticeForView.publishDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                  {selectedNoticeForView.expiryDate && (
                    <div>
                      <strong>⌛ Expiry Date:</strong>{" "}
                      {new Date(selectedNoticeForView.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                  <div>
                    <strong>👤 Published By:</strong>{" "}
                    {selectedNoticeForView.publishedByName || "Society Secretary"}
                  </div>
                </div>

                <h6 className="fw-bold text-secondary mb-2">Notice Announcement:</h6>
                <div
                  className="p-3 rounded-2 bg-white border"
                  style={{
                    whiteSpace: "pre-line",
                    lineHeight: "1.7",
                    fontSize: "0.95rem",
                    minHeight: "120px",
                  }}
                >
                  {selectedNoticeForView.description || "No description provided."}
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setSelectedNoticeForView(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Notice Modal (Secretary / Admin Only) */}
      {showModal && canManage && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">📢 Publish New Notice</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateNotice}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Notice Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Annual Society Meeting / Water Supply Maintenance"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description / Announcement *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Enter detailed notice content here..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.expiryDateStr}
                      onChange={(e) => setForm({ ...form, expiryDateStr: e.target.value })}
                    />
                    <small className="text-muted">
                      Leave blank if notice has no expiration.
                    </small>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? "Publishing..." : "🚀 Publish Announcement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
