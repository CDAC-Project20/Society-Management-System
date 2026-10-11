import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function OwnerPayments() {
  const { user, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    amount: "",
    purpose: "Monthly Maintenance",
    customPurpose: "",
    paymentMode: "UPI",
    transactionId: "",
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState(null);

  const fetchPayments = async () => {
    if (!user?.id) return;
    setFetching(true);
    try {
      const res = await fetch(`http://localhost:8080/payments/owner/${user.id}`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      } else {
        console.error("Failed to fetch payments");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setMessage("User not logged in properly.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("paidById", user.id);
    if (user.societyId) formData.append("societyId", user.societyId);
    const flatId = user.flatId || user.flat?.id;
    if (flatId) formData.append("flatId", flatId);

    formData.append("amount", form.amount);
    formData.append(
      "purpose",
      form.purpose === "Other" ? form.customPurpose : form.purpose
    );
    formData.append("paymentMode", form.paymentMode);
    formData.append("transactionId", form.transactionId);

    if (receiptFile) {
      formData.append("receiptFile", receiptFile);
    }

    try {
      const res = await fetch("http://localhost:8080/payments/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token || ""}`
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Payment details & receipt uploaded successfully!");
        setIsError(false);
        setForm({
          amount: "",
          purpose: "Monthly Maintenance",
          customPurpose: "",
          paymentMode: "UPI",
          transactionId: "",
        });
        setReceiptFile(null);
        // Reset file input
        const fileInput = document.getElementById("receiptFileInput");
        if (fileInput) fileInput.value = "";

        fetchPayments();
      } else {
        setMessage(data.error || "Failed to upload payment receipt.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server connection error.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4" style={{ color: "#4a154b" }}>
        💳 My Maintenance & Payment Management
      </h2>

      <div className="row g-4">
        {/* Upload Form */}
        <div className="col-lg-5">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "12px", backgroundColor: "#fbf9ff" }}
          >
            <div
              className="card-header text-white fw-bold py-3"
              style={{
                backgroundColor: "#6f42c1",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
            >
              📤 Upload Payment Receipt
            </div>
            <div className="card-body p-4">
              {message && (
                <div
                  className={`alert ${isError ? "alert-danger" : "alert-success"
                    } alert-dismissible fade show`}
                  role="alert"
                >
                  {message}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage("")}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Amount Paid (₹) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. 2500"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Payment Purpose <span className="text-danger">*</span>
                  </label>
                  <select
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Monthly Maintenance">Monthly Maintenance</option>
                    <option value="Clubhouse / Facility Fee">
                      Clubhouse / Facility Fee
                    </option>
                    <option value="Emergency Corpus Fund">
                      Emergency Corpus Fund
                    </option>
                    <option value="Event Contribution">Event Contribution</option>
                    <option value="Penalty / Late Charge">
                      Penalty / Late Charge
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {form.purpose === "Other" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Specify Purpose <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="customPurpose"
                      value={form.customPurpose}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. Water Tanker Payment"
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Payment Mode</label>
                  <select
                    name="paymentMode"
                    value={form.paymentMode}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="UPI">UPI / GPay / PhonePe / Paytm</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                    <option value="Bank Transfer (NEFT/RTGS)">
                      Bank Transfer (NEFT/RTGS)
                    </option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Transaction ID / Reference No.
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    value={form.transactionId}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. UPI/123456789012"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Upload Payment Receipt (Image or PDF)
                  </label>
                  <input
                    type="file"
                    id="receiptFileInput"
                    onChange={handleFileChange}
                    className="form-control"
                    accept="image/*,application/pdf"
                  />
                  <small className="text-muted">
                    Supports JPG, PNG, WEBP, or PDF files.
                  </small>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 fw-bold py-2"
                  style={{ backgroundColor: "#6f42c1", borderColor: "#6f42c1" }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Uploading...
                    </>
                  ) : (
                    "Submit Payment Receipt"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Payments History Table */}
        <div className="col-lg-7">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "12px", backgroundColor: "#ffffff" }}
          >
            <div
              className="card-header bg-dark text-white fw-bold py-3 d-flex justify-content-between align-items-center"
              style={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
            >
              <span>📋 My Payment History</span>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={fetchPayments}
              >
                🔄 Refresh
              </button>
            </div>
            <div className="card-body p-0">
              {fetching ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted">Loading your payments...</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center p-5 text-muted">
                  <h5>No payments uploaded yet.</h5>
                  <p>Use the form on the left to submit your payment receipt.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Purpose</th>
                        <th>Amount</th>
                        <th>Mode / Txn ID</th>
                        <th>Status</th>
                        <th>Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td>
                            {p.paymentDate
                              ? new Date(p.paymentDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            <span className="fw-semibold">{p.purpose}</span>
                          </td>
                          <td className="fw-bold text-success">
                            ₹{p.amount?.toLocaleString()}
                          </td>
                          <td>
                            <small className="d-block text-muted">
                              {p.paymentMode || "N/A"}
                            </small>
                            <small className="font-monospace text-dark">
                              {p.transactionId || "N/A"}
                            </small>
                          </td>
                          <td>
                            <span
                              className={`badge ${p.status === "Approved" || p.status === "Success" || p.status === "Verified"
                                ? "bg-success"
                                : p.status === "Rejected"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                                }`}
                            >
                              {p.status || "Submitted"}
                            </span>
                          </td>
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
                                🔍 View
                              </button>
                            ) : (
                              <span className="text-muted small">No file</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for previewing receipts */}
      {selectedReceiptUrl && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Payment Receipt Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedReceiptUrl(null)}
                ></button>
              </div>
              <div className="modal-body text-center p-3" style={{ minHeight: "300px" }}>
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
                    alt="Payment Receipt"
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
                  📥 Open / Download Full File
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
