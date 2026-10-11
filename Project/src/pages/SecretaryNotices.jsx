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
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State for New Notice
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    expiryDateStr: "",
  });

  const societyId = user?.societyId || 1;

  useEffect(() => {
    fetchNotices();
  }, [societyId]);

  const fetchNotices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8080/notices/society/${societyId}`, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      } else {
        const errData = await res.json();
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
        const errData = await res.json();
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
        const errData = await res.json();
        setError(errData.error || "Failed to delete notice.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while deleting notice.");
    }
  };

  // Filter notices
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      (n.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && !n.expired) ||
      (statusFilter === "EXPIRED" && n.expired);

    return matchesSearch && matchesStatus;
  });

  const totalCount = notices.length;
  const activeCount = notices.filter((n) => !n.expired).length;
  const expiredCount = notices.filter((n) => n.expired).length;

  return (
    <div className="container-fluid p-4">
      {/* Page Title & Actions */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            📢 Society Notices & Announcements
          </h2>
          <p className="text-muted mb-0">
            Publish, manage, and broadcast notices to all society members.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={fetchNotices}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          >
            <span>🔄</span> Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary btn-sm d-flex align-items-center gap-1 fw-semibold"
          >
            <span>➕</span> Publish Notice
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold">Total Notices</small>
                <h3 className="fw-bold text-primary mb-0 mt-1">{totalCount}</h3>
              </div>
              <div className="fs-2 text-primary opacity-50">📰</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold">Active Notices</small>
                <h3 className="fw-bold text-success mb-0 mt-1">{activeCount}</h3>
              </div>
              <div className="fs-2 text-success opacity-50">🟢</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-secondary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold">Expired Notices</small>
                <h3 className="fw-bold text-secondary mb-0 mt-1">{expiredCount}</h3>
              </div>
              <div className="fs-2 text-secondary opacity-50">⌛</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label small fw-bold text-secondary">Search Notices</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by title or notice description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-bold text-secondary">Status Filter</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Notices</option>
              <option value="ACTIVE">Active Notices Only</option>
              <option value="EXPIRED">Expired Notices Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading society notices...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-3 bg-white p-5 text-center text-muted">
          <h5>No notices found</h5>
          <p className="small mb-0">Click "Publish Notice" to broadcast a new announcement.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredNotices.map((n) => (
            <div className="col-md-6 col-lg-4" key={n.id}>
              <div className="card h-100 border-0 shadow-sm rounded-3 bg-white d-flex flex-column">
                <div className="card-header bg-transparent border-0 pt-3 px-3 d-flex justify-content-between align-items-center">
                  {n.expired ? (
                    <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">
                      Expired
                    </span>
                  ) : (
                    <span className="badge bg-success bg-opacity-10 text-success border border-success">
                      Active
                    </span>
                  )}
                  <small className="text-muted">#{n.id}</small>
                </div>

                <div className="card-body px-3 py-2 flex-grow-1">
                  <h5 className="fw-bold text-dark mb-2">{n.title}</h5>
                  <p className="card-text text-secondary small" style={{ whiteSpace: "pre-line" }}>
                    {n.description || "No description provided."}
                  </p>
                </div>

                <div className="card-footer bg-light border-0 px-3 py-2 mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2 small text-muted">
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
                    <small className="text-muted">By: {n.publishedByName || "Secretary"}</small>
                    <button
                      className="btn btn-outline-danger btn-sm py-0 px-2"
                      onClick={() => handleDeleteNotice(n.id)}
                      title="Delete Notice"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Notice Modal */}
      {showModal && (
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
                      placeholder="e.g. Annual Society Meeting / Maintenance Schedule"
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
                    {submitting ? "Publishing..." : "Publish Announcement"}
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
