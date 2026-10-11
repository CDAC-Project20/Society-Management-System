import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Documents() {
  const { user, token } = useSelector((state) => state.auth);

  // Main Section Navigation: "view" or "upload"
  const [mainSection, setMainSection] = useState("view");

  // Document & Flat States
  const [documents, setDocuments] = useState([]);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters & Search (View Section)
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [categoryTab, setCategoryTab] = useState("all"); // 'all', 'society', 'flat', 'my_uploads'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Modals (Preview & Delete)
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  // Upload Form State
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    documentName: "",
    documentType: "Society Rules",
    accessScope: "SOCIETY",
    flatId: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const societyId = user?.societyId || 1;
  const isSuperAdmin = user?.role === 1;
  const isSecretary = user?.role === 2;
  const isOwner = user?.role === 3;
  const isTenant = user?.role === 4;

  const canUpload = isSuperAdmin || isSecretary || isOwner;

  // Fetch Documents
  const fetchDocuments = async () => {
    setLoading(true);
    setError("");
    try {
      let endpoint = `http://localhost:8080/documents/society/${societyId}`;
      if (isSuperAdmin) {
        endpoint = `http://localhost:8080/documents/all`;
      }

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Failed to load documents.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to document service.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Flats for Flat-Specific uploads
  const fetchFlats = async () => {
    if (!societyId) return;
    try {
      const res = await fetch(`http://localhost:8080/flats/society/${societyId}`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFlats(data);
      }
    } catch (err) {
      console.error("Error fetching flats:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    if (isSecretary || isSuperAdmin) {
      fetchFlats();
    }
  }, [societyId, user]);

  // Handle Document Upload Submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }
    if (!user?.id) {
      setError("You must be logged in to upload documents.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("uploadedById", user.id);
    formData.append("societyId", societyId);
    if (uploadForm.flatId) formData.append("flatId", uploadForm.flatId);
    if (uploadForm.documentName) formData.append("documentName", uploadForm.documentName);
    if (uploadForm.documentType) formData.append("documentType", uploadForm.documentType);
    if (uploadForm.accessScope) formData.append("accessScope", uploadForm.accessScope);
    if (uploadForm.description) formData.append("description", uploadForm.description);

    try {
      const res = await fetch("http://localhost:8080/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
      });

      if (res.ok) {
        const newDoc = await res.json();
        setSuccessMsg(`Document "${newDoc.documentName}" uploaded successfully!`);
        setDocuments([newDoc, ...documents]);
        // Reset form
        setUploadForm({
          documentName: "",
          documentType: "Society Rules",
          accessScope: "SOCIETY",
          flatId: "",
          description: "",
        });
        setSelectedFile(null);
        // Switch to view section after brief delay or immediately
        setMainSection("view");
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Document upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error during document upload.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Document Delete
  const handleDelete = async (docId) => {
    if (!docId) return;
    try {
      const res = await fetch(`http://localhost:8080/documents/${docId}?userId=${user?.id || ""}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (res.ok) {
        setDocuments(documents.filter((d) => d.id !== docId));
        setSuccessMsg("Document removed successfully.");
        setDocToDelete(null);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Failed to delete document.");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server during delete.");
    }
  };

  // Badges
  const getFileBadge = (fileType, docPath) => {
    const lower = (docPath || fileType || "").toLowerCase();
    if (lower.endsWith(".pdf") || fileType?.includes("pdf")) {
      return <span className="badge bg-danger-subtle text-danger border border-danger px-2 py-1">📄 PDF</span>;
    }
    if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".webp") || fileType?.includes("image")) {
      return <span className="badge bg-info-subtle text-info border border-info px-2 py-1">🖼️ Image</span>;
    }
    if (lower.endsWith(".doc") || lower.endsWith(".docx") || lower.endsWith(".txt")) {
      return <span className="badge bg-primary-subtle text-primary border border-primary px-2 py-1">📝 Doc</span>;
    }
    return <span className="badge bg-secondary-subtle text-secondary border px-2 py-1">📁 File</span>;
  };

  const getScopeBadge = (scope) => {
    switch (scope?.toUpperCase()) {
      case "SOCIETY":
        return <span className="badge bg-success-subtle text-success border border-success">🌐 Society Wide</span>;
      case "FLAT":
        return <span className="badge bg-primary-subtle text-primary border border-primary">🏠 Flat Specific</span>;
      case "PRIVATE":
        return <span className="badge bg-warning-subtle text-warning border border-warning">🔒 Private</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary">{scope}</span>;
    }
  };

  // Filtered Documents
  const filteredDocs = documents.filter((doc) => {
    if (categoryTab === "society" && doc.accessScope !== "SOCIETY") return false;
    if (categoryTab === "flat" && doc.accessScope !== "FLAT") return false;
    if (categoryTab === "my_uploads" && doc.uploadedById !== user?.id) return false;

    if (typeFilter !== "ALL" && doc.documentType !== typeFilter) return false;
    if (scopeFilter !== "ALL" && doc.accessScope !== scopeFilter) return false;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const matchName = doc.documentName?.toLowerCase().includes(term);
      const matchDesc = doc.description?.toLowerCase().includes(term);
      const matchType = doc.documentType?.toLowerCase().includes(term);
      const matchUploader = doc.uploadedByName?.toLowerCase().includes(term);
      return matchName || matchDesc || matchType || matchUploader;
    }

    return true;
  });

  // Metrics
  const totalCount = documents.length;
  const societyDocsCount = documents.filter((d) => d.accessScope === "SOCIETY").length;
  const flatDocsCount = documents.filter((d) => d.accessScope === "FLAT").length;
  const myUploadsCount = documents.filter((d) => d.uploadedById === user?.id).length;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">📁 Document Management</h2>
          <p className="text-muted mb-0">
            Easily browse, view, download, and upload official society documents and records.
          </p>
        </div>

        {/* 2 Main Section Buttons */}
        <div className="btn-group shadow-sm mt-3 mt-md-0" role="group">
          <button
            type="button"
            className={`btn px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
              mainSection === "view" ? "btn-primary" : "btn-outline-primary bg-white"
            }`}
            onClick={() => setMainSection("view")}
          >
            📂 View Documents
            <span className={`badge ${mainSection === "view" ? "bg-white text-primary" : "bg-primary text-white"}`}>
              {totalCount}
            </span>
          </button>
          {canUpload && (
            <button
              type="button"
              className={`btn px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
                mainSection === "upload" ? "btn-primary" : "btn-outline-primary bg-white"
              }`}
              onClick={() => setMainSection("upload")}
            >
              📤 Upload Document
            </button>
          )}
        </div>
      </div>

      {/* Alert Banners */}
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

      {/* ========================================================================= */}
      {/* SECTION 1: VIEW DOCUMENTS                                                 */}
      {/* ========================================================================= */}
      {mainSection === "view" && (
        <>
          {/* KPI Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-semibold mb-1">Total Documents</h6>
                      <h3 className="fw-bold mb-0 text-dark">{totalCount}</h3>
                    </div>
                    <div className="bg-primary-subtle text-primary rounded-circle p-3 fs-4">📁</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-success border-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-semibold mb-1">Society Rules & Bye-Laws</h6>
                      <h3 className="fw-bold mb-0 text-dark">{societyDocsCount}</h3>
                    </div>
                    <div className="bg-success-subtle text-success rounded-circle p-3 fs-4">📜</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-info border-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-semibold mb-1">Flat Documents</h6>
                      <h3 className="fw-bold mb-0 text-dark">{flatDocsCount}</h3>
                    </div>
                    <div className="bg-info-subtle text-info rounded-circle p-3 fs-4">🏠</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-semibold mb-1">Uploaded by You</h6>
                      <h3 className="fw-bold mb-0 text-dark">{myUploadsCount}</h3>
                    </div>
                    <div className="bg-warning-subtle text-warning rounded-circle p-3 fs-4">📤</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-3">
              <div className="row g-3 align-items-center">
                {/* Category Tabs */}
                <div className="col-12 col-lg-6">
                  <ul className="nav nav-pills flex-nowrap overflow-auto">
                    <li className="nav-item">
                      <button
                        className={`nav-link py-1 px-3 ${categoryTab === "all" ? "active fw-semibold" : "text-secondary"}`}
                        onClick={() => setCategoryTab("all")}
                      >
                        All Documents ({totalCount})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link py-1 px-3 ${categoryTab === "society" ? "active fw-semibold" : "text-secondary"}`}
                        onClick={() => setCategoryTab("society")}
                      >
                        Society Wide
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link py-1 px-3 ${categoryTab === "flat" ? "active fw-semibold" : "text-secondary"}`}
                        onClick={() => setCategoryTab("flat")}
                      >
                        Flat Documents
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link py-1 px-3 ${categoryTab === "my_uploads" ? "active fw-semibold" : "text-secondary"}`}
                        onClick={() => setCategoryTab("my_uploads")}
                      >
                        My Uploads
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Search & Dropdown Filters */}
                <div className="col-12 col-lg-6 d-flex flex-wrap justify-content-lg-end gap-2">
                  <div className="input-group" style={{ maxWidth: "230px" }}>
                    <span className="input-group-text bg-white border-end-0">🔍</span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search title, uploader..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Society Rules">Society Rules</option>
                    <option value="Agreement">Agreements</option>
                    <option value="Financial Report">Financial Reports</option>
                    <option value="Meeting Minutes">Meeting Minutes</option>
                    <option value="Identity Proof">Identity Proofs</option>
                    <option value="Maintenance Receipt">Maintenance Receipts</option>
                    <option value="General">General</option>
                  </select>

                  <div className="btn-group btn-group-sm">
                    <button
                      className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setViewMode("grid")}
                      title="Grid View"
                    >
                      ▦
                    </button>
                    <button
                      className={`btn ${viewMode === "table" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setViewMode("table")}
                      title="Table View"
                    >
                      ☰
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Content List */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading documents...</span>
              </div>
              <p className="mt-2 text-muted">Fetching document repository...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="card shadow-sm border-0 text-center py-5">
              <div className="card-body">
                <div className="display-4 text-muted mb-3">📭</div>
                <h5 className="fw-bold text-dark">No Documents Found</h5>
                <p className="text-muted">
                  {searchTerm || typeFilter !== "ALL" || scopeFilter !== "ALL"
                    ? "Try adjusting your search query or filters."
                    : "No documents have been uploaded to this category yet."}
                </p>
                {canUpload && (
                  <button className="btn btn-primary mt-2" onClick={() => setMainSection("upload")}>
                    📤 Upload a Document Now
                  </button>
                )}
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="row g-3">
              {filteredDocs.map((doc) => {
                const canDelete = isSuperAdmin || isSecretary || doc.uploadedById === user?.id;
                const downloadUrl = `http://localhost:8080/documents/download/${doc.documentPath}`;

                return (
                  <div key={doc.id} className="col-12 col-md-6 col-xl-4">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            {getFileBadge(doc.fileType, doc.documentPath)}
                            <span className="ms-2 badge bg-light text-dark border">{doc.documentType || "General"}</span>
                          </div>
                          <div>{getScopeBadge(doc.accessScope)}</div>
                        </div>

                        <h5 className="card-title fw-bold text-dark text-truncate mt-2 mb-1" title={doc.documentName}>
                          {doc.documentName}
                        </h5>

                        {doc.description && (
                          <p className="card-text text-muted small text-truncate-2 mb-3" style={{ minHeight: "38px" }}>
                            {doc.description}
                          </p>
                        )}

                        <div className="bg-light p-2 rounded-2 small text-muted mb-3 mt-auto">
                          <div className="d-flex justify-content-between mb-1">
                            <span>📦 Size:</span>
                            <span className="fw-semibold text-dark">{doc.formattedFileSize || "N/A"}</span>
                          </div>
                          {doc.flatNumber && (
                            <div className="d-flex justify-content-between mb-1">
                              <span>🏠 Flat:</span>
                              <span className="fw-semibold text-dark">Flat #{doc.flatNumber}</span>
                            </div>
                          )}
                          <div className="d-flex justify-content-between mb-1">
                            <span>👤 Uploaded By:</span>
                            <span className="text-truncate ps-2" style={{ maxWidth: "160px" }}>
                              {doc.uploadedByName || "Admin"}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>📅 Date:</span>
                            <span>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Recent"}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                            onClick={() => setSelectedDocForPreview(doc)}
                          >
                            👁️ Preview
                          </button>
                          <a
                            href={downloadUrl}
                            className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                            download
                          >
                            📥 Download
                          </a>
                          {canDelete && (
                            <button
                              className="btn btn-outline-danger btn-sm px-2"
                              onClick={() => setDocToDelete(doc)}
                              title="Delete Document"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="card shadow-sm border-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ width: "50px" }}>Type</th>
                      <th scope="col">Document Title</th>
                      <th scope="col">Category</th>
                      <th scope="col">Scope</th>
                      <th scope="col">Flat</th>
                      <th scope="col">Size</th>
                      <th scope="col">Uploaded By</th>
                      <th scope="col">Date</th>
                      <th scope="col" className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((doc) => {
                      const canDelete = isSuperAdmin || isSecretary || doc.uploadedById === user?.id;
                      const downloadUrl = `http://localhost:8080/documents/download/${doc.documentPath}`;

                      return (
                        <tr key={doc.id}>
                          <td>{getFileBadge(doc.fileType, doc.documentPath)}</td>
                          <td>
                            <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "250px" }}>
                              {doc.documentName}
                            </div>
                            {doc.description && (
                              <div className="small text-muted text-truncate" style={{ maxWidth: "250px" }}>
                                {doc.description}
                              </div>
                            )}
                          </td>
                          <td><span className="badge bg-light text-dark border">{doc.documentType}</span></td>
                          <td>{getScopeBadge(doc.accessScope)}</td>
                          <td>
                            {doc.flatNumber ? (
                              <span className="badge bg-secondary-subtle text-secondary">#{doc.flatNumber}</span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="small text-muted">{doc.formattedFileSize || "N/A"}</td>
                          <td className="small">{doc.uploadedByName || "Admin"}</td>
                          <td className="small text-muted">
                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => setSelectedDocForPreview(doc)}
                                title="Preview"
                              >
                                👁️
                              </button>
                              <a
                                href={downloadUrl}
                                className="btn btn-outline-success"
                                download
                                title="Download"
                              >
                                📥
                              </a>
                              {canDelete && (
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => setDocToDelete(doc)}
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: UPLOAD DOCUMENT                                                */}
      {/* ========================================================================= */}
      {mainSection === "upload" && (
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">📤 Upload New Document</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() => setMainSection("view")}
                  >
                    ← Back to Documents
                  </button>
                </div>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleUploadSubmit}>
                  <div className="row g-3">
                    {/* Document Title */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Document Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Society Bye Laws 2026, Rental Agreement..."
                        required
                        value={uploadForm.documentName}
                        onChange={(e) => setUploadForm({ ...uploadForm, documentName: e.target.value })}
                      />
                    </div>

                    {/* Category / Type */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Document Category</label>
                      <select
                        className="form-select"
                        value={uploadForm.documentType}
                        onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
                      >
                        <option value="Society Rules">Society Rules & Bye Laws</option>
                        <option value="Agreement">Rental / Purchase Agreement</option>
                        <option value="Financial Report">Financial / Audit Report</option>
                        <option value="Meeting Minutes">Meeting Minutes & Resolutions</option>
                        <option value="Identity Proof">Identity & Verification</option>
                        <option value="Maintenance Receipt">Maintenance Receipt</option>
                        <option value="General">General Notice / Circular</option>
                      </select>
                    </div>

                    {/* Access Scope */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Access Scope</label>
                      <select
                        className="form-select"
                        value={uploadForm.accessScope}
                        onChange={(e) => setUploadForm({ ...uploadForm, accessScope: e.target.value })}
                      >
                        <option value="SOCIETY">🌐 Society Wide (Visible to all residents)</option>
                        <option value="FLAT">🏠 Flat Specific (Visible to flat owner & tenant)</option>
                        <option value="PRIVATE">🔒 Private (Secretary & Uploader only)</option>
                      </select>
                    </div>

                    {/* Associated Flat */}
                    {(uploadForm.accessScope === "FLAT" || isSecretary || isSuperAdmin) && (
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Associated Flat (Optional)</label>
                        <select
                          className="form-select"
                          value={uploadForm.flatId}
                          onChange={(e) => setUploadForm({ ...uploadForm, flatId: e.target.value })}
                        >
                          <option value="">-- No Specific Flat --</option>
                          {flats.map((f) => (
                            <option key={f.id} value={f.id}>
                              Flat #{f.flatNumber} (Floor {f.floorNumber || "N/A"})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* File Upload Selector */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Select File <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        className="form-control p-2"
                        required
                        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setSelectedFile(file);
                            if (!uploadForm.documentName) {
                              setUploadForm({
                                ...uploadForm,
                                documentName: file.name.replace(/\.[^/.]+$/, ""),
                              });
                            }
                          }
                        }}
                      />
                      <div className="form-text">
                        Supported formats: PDF, PNG, JPG, WEBP, DOCX, TXT. Maximum size: 25MB.
                      </div>

                      {/* Selected File Details Box */}
                      {selectedFile && (
                        <div className="alert alert-info py-2 px-3 mt-2 d-flex align-items-center justify-content-between mb-0">
                          <div>
                            <strong>📎 Selected File:</strong> {selectedFile.name} (
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setSelectedFile(null)}
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description / Remarks (Optional)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Provide details about the document contents or purpose..."
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-12 d-flex justify-content-end gap-2 pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-secondary px-4"
                        onClick={() => setMainSection("view")}
                        disabled={uploading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary px-4 fw-semibold"
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Uploading Document...
                          </>
                        ) : (
                          "🚀 Upload Document"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INLINE PREVIEW MODAL                                                      */}
      {/* ========================================================================= */}
      {selectedDocForPreview && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold text-truncate" style={{ maxWidth: "80%" }}>
                  👁️ {selectedDocForPreview.documentName}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedDocForPreview(null)}
                ></button>
              </div>
              <div className="modal-body p-0" style={{ minHeight: "450px", backgroundColor: "#2b2b2b" }}>
                {selectedDocForPreview.documentPath?.toLowerCase().endsWith(".pdf") ||
                selectedDocForPreview.fileType?.includes("pdf") ? (
                  <iframe
                    src={`http://localhost:8080/documents/file/${selectedDocForPreview.documentPath}`}
                    title={selectedDocForPreview.documentName}
                    width="100%"
                    height="550px"
                    style={{ border: "none" }}
                  ></iframe>
                ) : selectedDocForPreview.fileType?.includes("image") ||
                  selectedDocForPreview.documentPath?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                  <div className="text-center p-3 bg-dark">
                    <img
                      src={`http://localhost:8080/documents/file/${selectedDocForPreview.documentPath}`}
                      alt={selectedDocForPreview.documentName}
                      className="img-fluid rounded"
                      style={{ maxHeight: "550px", objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-5 text-white">
                    <div className="display-3 mb-3">📄</div>
                    <h5>Direct Inline Preview not available for this file type</h5>
                    <p className="text-muted">You can download or open the file in another tab to view it.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light d-flex justify-content-between">
                <div className="small text-muted">
                  <strong>Type:</strong> {selectedDocForPreview.documentType} | <strong>Size:</strong>{" "}
                  {selectedDocForPreview.formattedFileSize} | <strong>Uploaded by:</strong>{" "}
                  {selectedDocForPreview.uploadedByName}
                </div>
                <div className="d-flex gap-2">
                  <a
                    href={`http://localhost:8080/documents/file/${selectedDocForPreview.documentPath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    ↗️ Open in New Tab
                  </a>
                  <a
                    href={`http://localhost:8080/documents/download/${selectedDocForPreview.documentPath}`}
                    className="btn btn-primary btn-sm"
                    download
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      {docToDelete && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">⚠️ Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setDocToDelete(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to permanently delete <strong>{docToDelete.documentName}</strong>?
                </p>
                <p className="small text-muted mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDocToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(docToDelete.id)}
                >
                  🗑️ Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
