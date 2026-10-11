import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SocietyRegisterComp({ onToggleLogin }) {
  const [form, setForm] = useState({
    societyName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactEmail: "",
    contactPhone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Frontend validation
    if (!form.societyName.trim()) {
      setMessage("Society Name is required");
      setIsError(true);
      return;
    }

    if (!form.contactEmail.trim()) {
      setMessage("Admin / Contact Email is required");
      setIsError(true);
      return;
    }

    if (!form.contactPhone.trim()) {
      setMessage("Contact Phone is required");
      setIsError(true);
      return;
    }

    if (!form.address.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setMessage("Complete society address details are required");
      setIsError(true);
      return;
    }

    if (!form.password) {
      setMessage("Password is required");
      setIsError(true);
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setIsError(true);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    setLoading(true);

    const payload = {
      societyName: form.societyName.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      password: form.password,
    };

    try {
      const res = await fetch("http://localhost:8080/societies/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          data.message ||
            "Society registered successfully! Application is PENDING SuperAdmin approval. Admin account has been registered."
        );
        setIsError(false);
        setForm({
          societyName: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          contactEmail: "",
          contactPhone: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          if (onToggleLogin) {
            onToggleLogin();
          } else {
            navigate("/login");
          }
        }, 3000);
      } else {
        setMessage(data.error || data.message || "Registration failed. Please check the entered details.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Unable to connect to the server. Please verify backend services are running.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = (e) => {
    if (onToggleLogin) {
      e.preventDefault();
      onToggleLogin();
    }
  };

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: "12px", background: "#ffffff" }}>
      {/* Header Banner */}
      <div
        className="card-header text-white text-center py-3"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        <h4 className="fw-bold mb-1">🏢 Register Society</h4>
        <p className="mb-0 text-white-50" style={{ fontSize: "0.85rem" }}>
          Admin account will be created automatically
        </p>
      </div>

      <div className="card-body p-3 p-md-4">
        {/* Status / Alert Message */}
        {message && (
          <div
            className={`alert ${isError ? "alert-danger" : "alert-success"} d-flex align-items-start mb-3 p-2`}
            role="alert"
          >
            <span className="me-2 fs-5">{isError ? "⚠️" : "🎉"}</span>
            <div className="small flex-grow-1">
              <strong>{isError ? "Error: " : "Success: "}</strong>
              {message}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Society Info */}
          <div className="mb-3">
            <h6 className="fw-bold text-primary mb-2 pb-1 border-bottom" style={{ fontSize: "0.95rem" }}>
              1. Society Information
            </h6>

            <div className="row g-2">
              <div className="col-12">
                <label className="form-label small fw-semibold mb-1">
                  Society Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="societyName"
                  value={form.societyName}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="e.g. Gokuldham Co-op Housing Society"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold mb-1">
                  Address <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="Street / Area / Landmark"
                  required
                />
              </div>

              <div className="col-5">
                <label className="form-label small fw-semibold mb-1">
                  City <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="City"
                  required
                />
              </div>

              <div className="col-4">
                <label className="form-label small fw-semibold mb-1">
                  State <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="State"
                  required
                />
              </div>

              <div className="col-3">
                <label className="form-label small fw-semibold mb-1">
                  Pincode <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="Pin"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Admin Credentials */}
          <div className="mb-3">
            <h6 className="fw-bold text-primary mb-2 pb-1 border-bottom" style={{ fontSize: "0.95rem" }}>
              2. Admin Credentials (Login Info)
            </h6>

            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label small fw-semibold mb-1">
                  Admin Email (Login ID) <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="admin@society.com"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold mb-1">
                  Contact Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold mb-1">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="input-group input-group-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Min 6 chars"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold mb-1">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`form-control form-control-sm ${
                    form.confirmPassword &&
                    (form.password === form.confirmPassword ? "is-valid" : "is-invalid")
                  }`}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-3">
            <button
              type="submit"
              disabled={loading}
              className="btn w-100 py-2 text-white fw-bold shadow-sm"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "8px",
              }}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering Society...
                </span>
              ) : (
                "🚀 Register Society"
              )}
            </button>
          </div>
        </form>

        {/* Single Footer Navigation */}
        <div className="text-center mt-3 pt-2 border-top">
          <small className="text-muted">
            Already have an account?{" "}
            {onToggleLogin ? (
              <button
                type="button"
                onClick={onToggleLogin}
                className="btn btn-link fw-bold text-decoration-none p-0 align-baseline"
                style={{ color: "#764ba2" }}
              >
                Login here
              </button>
            ) : (
              <Link
                to="/login"
                className="fw-bold text-decoration-none"
                style={{ color: "#764ba2" }}
              >
                Login here
              </Link>
            )}
          </small>
        </div>
      </div>
    </div>
  );
}
