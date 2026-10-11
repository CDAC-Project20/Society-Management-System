import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function SecretaryComplaints() {
  const { user, token } = useSelector((state) => state.auth);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Selected complaint for details modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // AI Complaint Analysis State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showAiCard, setShowAiCard] = useState(true);

  const societyId = user?.societyId || 1;

  const handleGenerateAiAnalysis = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const statusParam = statusFilter && statusFilter !== "ALL" ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await fetch(`http://localhost:8080/complaints/society/${societyId}/analysis${statusParam}`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "X-User-Role": user?.roleName || "Secretary",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
        setShowAiCard(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        setAiError(errData.error || `Failed to generate AI analysis (HTTP status ${res.status}).`);
      }
    } catch (err) {
      console.error("AI Analysis fetch error:", err);
      setAiError("Unable to connect to backend server. Please verify the society-service is running.");
    } finally {
      setAiLoading(false);
    }
  };


  useEffect(() => {
    fetchComplaints();
  }, [societyId]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8080/complaints/society/${societyId}`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to fetch complaints.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    setUpdatingId(complaintId);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`http://localhost:8080/complaints/${complaintId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedComplaint = await res.json();
        setComplaints((prev) =>
          prev.map((c) => (c.id === complaintId ? updatedComplaint : c))
        );
        if (selectedComplaint?.id === complaintId) {
          setSelectedComplaint(updatedComplaint);
        }
        setSuccessMsg(`Complaint #${complaintId} status updated to '${newStatus}'.`);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.flatNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.raisedByName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (c.status || "").toUpperCase() === statusFilter.toUpperCase();

    const matchesPriority =
      priorityFilter === "ALL" ||
      (c.priority || "").toUpperCase() === priorityFilter.toUpperCase();

    const matchesCategory =
      categoryFilter === "ALL" ||
      (c.category || "").toUpperCase() === categoryFilter.toUpperCase();

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Calculate statistics
  const totalCount = complaints.length;
  const openCount = complaints.filter((c) => (c.status || "").toLowerCase() === "open").length;
  const inProgressCount = complaints.filter((c) => (c.status || "").toLowerCase() === "in progress").length;
  const resolvedCount = complaints.filter((c) => (c.status || "").toLowerCase() === "resolved" || (c.status || "").toLowerCase() === "closed").length;

  const getPriorityBadge = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "high":
        return <span className="badge bg-danger">High</span>;
      case "medium":
        return <span className="badge bg-warning text-dark">Medium</span>;
      case "low":
        return <span className="badge bg-info text-dark">Low</span>;
      default:
        return <span className="badge bg-secondary">{priority || "Normal"}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "open":
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger">Open</span>;
      case "in progress":
        return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning">In Progress</span>;
      case "resolved":
        return <span className="badge bg-success bg-opacity-10 text-success border border-success">Resolved</span>;
      case "closed":
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">Closed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getAiPriorityBadge = (priority) => {
    switch ((priority || "").toUpperCase()) {
      case "HIGH":
        return <span className="badge bg-danger text-white px-2 py-1"><span className="me-1">🚨</span>HIGH</span>;
      case "MEDIUM":
        return <span className="badge bg-warning text-dark px-2 py-1"><span className="me-1">⚡</span>MEDIUM</span>;
      case "LOW":
        return <span className="badge bg-info text-dark px-2 py-1"><span className="me-1">ℹ️</span>LOW</span>;
      default:
        return <span className="badge bg-secondary px-2 py-1">{priority || "NORMAL"}</span>;
    }
  };

  const aiAnalysisMap = (aiAnalysis?.complaintAnalyses || []).reduce((acc, item) => {
    if (item.complaintId) {
      acc[item.complaintId] = item;
    }
    return acc;
  }, {});


  return (
    <div className="container-fluid p-4">
      {/* Page Title */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            ⚠️ Complaints Management
          </h2>
          <p className="text-muted mb-0">
            Review resident issues, mark items needing resolution, or update resolution progress.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={fetchComplaints}
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
          <button
            onClick={handleGenerateAiAnalysis}
            disabled={aiLoading}
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 shadow-sm text-white"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              border: "none",
            }}
          >
            {aiLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Analyzing with Gemini...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span className="fw-semibold">Generate AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Messages */}
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

      {/* AI Error Alert */}
      {aiError && (
        <div className="alert alert-danger alert-dismissible fade show border-start border-4 border-danger shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-start gap-2">
            <span className="fs-5">⚠️</span>
            <div>
              <strong className="d-block">AI Complaint Analysis Failed:</strong>
              <span>{aiError}</span>
              {aiError.toLowerCase().includes("api key") && (
                <div className="small text-muted mt-2">
                  Tip: Ensure the <code>GEMINI_API_KEY</code> environment variable is set on the server or in <code>.env</code> file.
                </div>
              )}
            </div>
          </div>
          <button type="button" className="btn-close" onClick={() => setAiError("")}></button>
        </div>
      )}

      {/* AI Loading State */}
      {aiLoading && (
        <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: "2.5rem", height: "2.5rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="fw-bold text-dark mb-1">🤖 Google Gemini & Spring AI are analyzing complaints...</h5>
          <p className="text-muted small mb-0">
            Applying housing society bylaws (RAG), evaluating complaint severity, and checking recurring patterns...
          </p>
        </div>
      )}

      {/* AI Analysis Result Card */}
      {aiAnalysis && !aiLoading && (
        <div className="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden" style={{ borderLeft: "5px solid #6366f1" }}>
          <div className="card-header bg-white border-bottom p-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4">✨</span>
              <div>
                <h5 className="fw-bold mb-0 text-dark">AI Complaint Intelligence & Analysis</h5>
                <small className="text-muted">
                  Powered by <strong>Spring AI & Google Gemini</strong> | Grounded with Housing Society Bylaws (RAG)
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1">
                {aiAnalysis.totalComplaintsAnalyzed} Complaints Evaluated
              </span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowAiCard(!showAiCard)}
              >
                {showAiCard ? "Hide Details" : "Show Details"}
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => setAiAnalysis(null)}
                title="Dismiss AI Report"
              >
                ✕
              </button>
            </div>
          </div>

          {showAiCard && (
            <div className="card-body p-4 bg-light bg-opacity-25">
              {/* RAG Context Banner */}
              {aiAnalysis.ragContext && (
                <div className="p-2 px-3 mb-3 rounded-2 bg-info bg-opacity-10 border border-info text-dark small d-flex align-items-center gap-2">
                  <span>⚡</span>
                  <div>
                    <strong>RAG Grounding Active:</strong> Injected {aiAnalysis.ragContext.knowledgeItemsRetrieved || "standard"} Society Bylaw SLA rules to objectively verify emergency plumbing, lift safety, and priority escalation.
                  </div>
                </div>
              )}

              {/* Overall Summary & Recommended Actions */}
              <div className="row g-3 mb-4">
                <div className="col-lg-7">
                  <div className="card h-100 border-0 shadow-sm rounded-3 p-3 bg-white">
                    <h6 className="fw-bold text-secondary mb-2 d-flex align-items-center gap-2">
                      <span>📋</span> Overall Summary
                    </h6>
                    <p className="text-dark mb-0 leading-relaxed" style={{ fontSize: "0.95rem" }}>
                      {aiAnalysis.overallSummary || "No summary provided."}
                    </p>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="card h-100 border-0 shadow-sm rounded-3 p-3 bg-white">
                    <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-2">
                      <span>✅</span> Recommended Actions for Secretary
                    </h6>
                    {aiAnalysis.recommendedActions && aiAnalysis.recommendedActions.length > 0 ? (
                      <ul className="list-unstyled mb-0 small">
                        {aiAnalysis.recommendedActions.map((action, idx) => (
                          <li key={idx} className="mb-2 d-flex align-items-start gap-2">
                            <span className="text-success fw-bold">✓</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted small mb-0">No actions required.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recurring Issues (if any) */}
              {aiAnalysis.recurringIssues && aiAnalysis.recurringIssues.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold text-danger mb-2 d-flex align-items-center gap-2">
                    <span>🚨</span> Recurring Issues & Pattern Detection
                  </h6>
                  <div className="row g-2">
                    {aiAnalysis.recurringIssues.map((rec, idx) => (
                      <div key={idx} className="col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-danger h-100">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger">
                              {rec.category || "General"}
                            </span>
                            <span className="badge bg-danger text-white">
                              {rec.count} Occurrences
                            </span>
                          </div>
                          <p className="fw-semibold text-dark small mb-1">{rec.description}</p>
                          {rec.location && (
                            <small className="text-muted">
                              📍 <strong>Area/Location:</strong> {rec.location}
                            </small>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complaint Categorization & Priority Suggestions Table */}
              {aiAnalysis.complaintAnalyses && aiAnalysis.complaintAnalyses.length > 0 && (
                <div>
                  <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span>🎯</span> AI Categorization & Suggested Priorities
                  </h6>
                  <div className="table-responsive bg-white rounded-3 shadow-sm border">
                    <table className="table table-sm table-hover mb-0 align-middle">
                      <thead className="table-light small">
                        <tr>
                          <th className="ps-3">ID</th>
                          <th>Category</th>
                          <th>Suggested Priority</th>
                          <th>AI Justification / SLA Reason</th>
                          <th className="pe-3">Recommended Next Step</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        {aiAnalysis.complaintAnalyses.map((item, idx) => (
                          <tr key={idx}>
                            <td className="ps-3 fw-bold text-secondary">#{item.complaintId}</td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {item.category || "General"}
                              </span>
                            </td>
                            <td>{getAiPriorityBadge(item.suggestedPriority)}</td>
                            <td className="text-muted">{item.reason}</td>
                            <td className="pe-3 text-dark fw-semibold">{item.recommendedAction}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold uppercase">Total Complaints</small>
                <h3 className="fw-bold text-primary mb-0 mt-1">{totalCount}</h3>
              </div>
              <div className="fs-2 text-primary opacity-50">📋</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-danger">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold uppercase">Open (New)</small>
                <h3 className="fw-bold text-danger mb-0 mt-1">{openCount}</h3>
              </div>
              <div className="fs-2 text-danger opacity-50">🚨</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold uppercase">In Progress (Need Resolve)</small>
                <h3 className="fw-bold text-warning mb-0 mt-1">{inProgressCount}</h3>
              </div>
              <div className="fs-2 text-warning opacity-50">⏳</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold uppercase">Resolved</small>
                <h3 className="fw-bold text-success mb-0 mt-1">{resolvedCount}</h3>
              </div>
              <div className="fs-2 text-success opacity-50">✅</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small fw-bold text-secondary">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search title, resident, flat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label small fw-bold text-secondary">Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-bold text-secondary">Priority</label>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-bold text-secondary">Category</label>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Parking">Parking</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5>No complaints found</h5>
              <p className="small">Try adjusting search filters or check back later.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">ID</th>
                    <th>Flat / Resident</th>
                    <th>Complaint Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date Created</th>
                    <th className="text-end pe-3">Actions (Secretary)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((c) => (
                    <tr key={c.id}>
                      <td className="ps-3 fw-bold text-secondary">#{c.id}</td>
                      <td>
                        <div className="fw-bold text-dark">{c.flatNumber || "N/A"}</div>
                        <small className="text-muted">{c.raisedByName || "Resident"}</small>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{c.title}</div>
                        <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: "250px" }}>
                          {c.description}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {c.category || "General"}
                        </span>
                        {aiAnalysisMap[c.id] && aiAnalysisMap[c.id].category && aiAnalysisMap[c.id].category !== c.category && (
                          <div className="mt-1" title="AI Suggested Category">
                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary" style={{ fontSize: "0.68rem" }}>
                              AI: {aiAnalysisMap[c.id].category}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div>{getPriorityBadge(c.priority)}</div>
                        {aiAnalysisMap[c.id] && (
                          <div className="mt-1" title={aiAnalysisMap[c.id].reason}>
                            <small className="d-block text-muted" style={{ fontSize: "0.68rem" }}>AI Suggestion:</small>
                            {getAiPriorityBadge(aiAnalysisMap[c.id].suggestedPriority)}
                          </div>
                        )}
                      </td>
                      <td>{getStatusBadge(c.status)}</td>
                      <td className="small text-muted">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="text-end pe-3">
                        <div className="btn-group btn-group-sm">
                          {/* Need to resolve / In Progress action */}
                          {c.status !== "In Progress" && c.status !== "Resolved" && (
                            <button
                              className="btn btn-outline-warning"
                              disabled={updatingId === c.id}
                              onClick={() => handleStatusChange(c.id, "In Progress")}
                              title="Mark as Need to Resolve"
                            >
                              ⏳ In Progress
                            </button>
                          )}

                          {/* Resolve it action */}
                          {c.status !== "Resolved" && (
                            <button
                              className="btn btn-outline-success"
                              disabled={updatingId === c.id}
                              onClick={() => handleStatusChange(c.id, "Resolved")}
                              title="Resolve Complaint"
                            >
                              ✅ Resolve
                            </button>
                          )}

                          {/* Re-open action if resolved */}
                          {c.status === "Resolved" && (
                            <button
                              className="btn btn-outline-secondary"
                              disabled={updatingId === c.id}
                              onClick={() => handleStatusChange(c.id, "In Progress")}
                              title="Re-open Complaint"
                            >
                              🔄 Re-open
                            </button>
                          )}

                          {/* Details Button */}
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => setSelectedComplaint(c)}
                          >
                            👁️ View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  Complaint Details #{selectedComplaint.id}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedComplaint(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="text-muted small">Flat Number</label>
                    <p className="fw-bold mb-0">{selectedComplaint.flatNumber || "N/A"}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Raised By Resident</label>
                    <p className="fw-bold mb-0">
                      {selectedComplaint.raisedByName || "N/A"}{" "}
                      {selectedComplaint.raisedByEmail && `(${selectedComplaint.raisedByEmail})`}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small">Category</label>
                    <p className="fw-semibold mb-0">{selectedComplaint.category || "General"}</p>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small">Priority</label>
                    <p className="mb-0">{getPriorityBadge(selectedComplaint.priority)}</p>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small">Current Status</label>
                    <p className="mb-0">{getStatusBadge(selectedComplaint.status)}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-muted small">Title</label>
                  <p className="fw-bold text-dark fs-5 mb-0">{selectedComplaint.title}</p>
                </div>

                <div className="mb-4">
                  <label className="text-muted small">Description</label>
                  <div className="p-3 bg-light rounded-3 border text-dark">
                    {selectedComplaint.description || "No description provided."}
                  </div>
                </div>

                {aiAnalysisMap[selectedComplaint.id] && (
                  <div className="mb-4 p-3 rounded-3 border" style={{ backgroundColor: "#f5f3ff", borderColor: "#c4b5fd" }}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fw-bold text-primary small d-flex align-items-center gap-1">
                        <span>🤖</span> AI Advisory (Google Gemini & Bylaws RAG)
                      </span>
                      {getAiPriorityBadge(aiAnalysisMap[selectedComplaint.id].suggestedPriority)}
                    </div>
                    <div className="small mb-1">
                      <strong>AI Category:</strong> <span className="badge bg-light text-dark border ms-1">{aiAnalysisMap[selectedComplaint.id].category}</span>
                    </div>
                    <div className="small mb-2 text-dark">
                      <strong>Justification (SLA):</strong> {aiAnalysisMap[selectedComplaint.id].reason}
                    </div>
                    <div className="small text-success fw-semibold">
                      <strong>Recommended Action:</strong> {aiAnalysisMap[selectedComplaint.id].recommendedAction}
                    </div>
                  </div>
                )}

                <div className="row g-3 border-top pt-3 text-muted small">
                  <div className="col-md-6">
                    <strong>Created At:</strong>{" "}
                    {selectedComplaint.createdAt
                      ? new Date(selectedComplaint.createdAt).toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="col-md-6 text-end">
                    <strong>Resolved At:</strong>{" "}
                    {selectedComplaint.resolvedAt
                      ? new Date(selectedComplaint.resolvedAt).toLocaleString()
                      : "Not Resolved Yet"}
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light">
                <div className="me-auto">
                  <span className="me-2 small fw-bold">Update Status:</span>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleStatusChange(selectedComplaint.id, "Open")}
                    >
                      Open
                    </button>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => handleStatusChange(selectedComplaint.id, "In Progress")}
                    >
                      In Progress (Need Resolve)
                    </button>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleStatusChange(selectedComplaint.id, "Resolved")}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedComplaint(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
