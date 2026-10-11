import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ViewPayments() {
  const { user, token } = useSelector((state) => state.auth);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSocietyPayments = async () => {
    setLoading(true);
    try {
      const societyId = user?.societyId || 1;
      const res = await fetch(`http://localhost:8080/payments/society/${societyId}`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data || []);
      } else {
        console.error("Failed to fetch society payments");
      }
    } catch (err) {
      console.error("Error fetching society payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocietyPayments();
  }, [user]);

  // Handle status update by Secretary
  const handleUpdateStatus = async (paymentId, newStatus) => {
    setActionLoading(paymentId);
    try {
      const res = await fetch(`http://localhost:8080/payments/${paymentId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p))
        );
      } else {
        alert("Failed to update payment status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Network error updating status.");
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered payments by search term and status filter
  const filteredPayments = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    const flatNo = (p.flatNumber || "").toLowerCase();
    const ownerName = (p.paidByName || "").toLowerCase();
    const purpose = (p.purpose || "").toLowerCase();
    const txnId = (p.transactionId || "").toLowerCase();
    
    const matchesSearch =
      flatNo.includes(term) ||
      ownerName.includes(term) ||
      purpose.includes(term) ||
      txnId.includes(term);

    const matchesStatus =
      statusFilter === "ALL" ||
      (p.status || "").toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "VERIFIED" || s === "APPROVED" || s === "SUCCESS") {
      return <span className="badge bg-success">Verified</span>;
    } else if (s === "REJECTED" || s === "FAILED") {
      return <span className="badge bg-danger">Rejected</span>;
    } else {
      return <span className="badge bg-warning text-dark">Submitted</span>;
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{ color: "#2c3e50" }}>
            📊 Society Payments & Receipts Overview
          </h2>
          <p className="text-muted mb-0">
            View, search, and verify payments uploaded by flat owners in the society
          </p>
        </div>
        <button className="btn btn-outline-primary" onClick={fetchSocietyPayments}>
          🔄 Refresh Payments
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-4 border-primary p-3">
            <div className="text-muted small fw-semibold">Total Recorded Payments</div>
            <div className="fs-3 fw-bold text-primary">{filteredPayments.length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-4 border-success p-3">
            <div className="text-muted small fw-semibold">Total Amount (Filtered)</div>
            <div className="fs-3 fw-bold text-success">
              ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-4 border-info p-3">
            <div className="text-muted small fw-semibold">Society</div>
            <div className="fs-5 fw-bold text-dark text-truncate">
              {user?.societyName || "Registered Society"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
        <div className="card-header bg-white py-3 border-0 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h5 className="fw-bold mb-0 text-dark">Flat Owner Payment Records</h5>
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: "140px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by Owner, Flat, Purpose..."
              style={{ width: "250px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Loading payments list...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center p-5 text-muted">
              <h5>No payment receipts found.</h5>
              {searchTerm && <p>Try clearing your search query or filter.</p>}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Flat</th>
                    <th>Owner Name</th>
                    <th>Purpose</th>
                    <th>Amount Paid</th>
                    <th>Payment Mode</th>
                    <th>Txn / Ref ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Receipt</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <span className="badge bg-light text-dark border fs-6">
                          {p.flatNumber ? `Flat ${p.flatNumber}` : "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold">{p.paidByName || "Resident"}</div>
                        <small className="text-muted">{p.paidByEmail}</small>
                      </td>
                      <td>
                        <span className="fw-semibold text-dark">{p.purpose || "Maintenance"}</span>
                      </td>
                      <td className="fw-bold text-success">
                        ₹{p.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className="badge bg-secondary">{p.paymentMode || "UPI"}</span>
                      </td>
                      <td className="font-monospace small text-muted">
                        {p.transactionId || "—"}
                      </td>
                      <td>
                        <small>
                          {p.paymentDate
                            ? new Date(p.paymentDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </small>
                      </td>
                      <td>{getStatusBadge(p.status)}</td>
                      <td>
                        {p.receiptPath ? (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              setSelectedReceiptUrl(
                                `http://localhost:8080/payments/receipt/${p.receiptPath}`
                              )
                            }
                          >
                            👁️ View
                          </button>
                        ) : (
                          <span className="text-muted small">No File</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-success"
                            title="Verify / Approve Payment"
                            disabled={actionLoading === p.id || p.status === "Verified" || p.status === "Approved"}
                            onClick={() => handleUpdateStatus(p.id, "Verified")}
                          >
                            ✓ Verify
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Reject Payment"
                            disabled={actionLoading === p.id || p.status === "Rejected"}
                            onClick={() => handleUpdateStatus(p.id, "Rejected")}
                          >
                            ✗ Reject
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

      {/* Modal for previewing receipt */}
      {selectedReceiptUrl && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Uploaded Payment Receipt</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedReceiptUrl(null)}
                ></button>
              </div>
              <div
                className="modal-body text-center p-3"
                style={{ minHeight: "300px" }}
              >
                {selectedReceiptUrl.endsWith(".pdf") ? (
                  <iframe
                    src={selectedReceiptUrl}
                    title="Receipt PDF"
                    width="100%"
                    height="500px"
                    style={{ border: "none" }}
                  />
                ) : (
                  <img
                    src={selectedReceiptUrl}
                    alt="Uploaded Receipt"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "500px", objectFit: "contain" }}
                  />
                )}
              </div>
              <div className="modal-footer">
                <a
                  href={selectedReceiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  📥 Download / Open Full Document
                </a>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedReceiptUrl(null)}
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
