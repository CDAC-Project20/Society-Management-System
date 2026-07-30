import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SocietyRegisterComp() {
  const [form, setForm] = useState({
    societyName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactEmail: "",
    contactPhone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    for (const key in form) {
      if (!form[key]) {
        setMessage(`Field "${key}" is required`);
        setIsError(true);
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:8080/societies/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Society Registration successful!");
        setIsError(false);
        // Optional: Redirect to login after a brief delay
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || "Registration failed");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error — check backend connection");
      setIsError(true);
    }
  };

  return (
    <div
      className="card shadow-sm mx-auto mt-5 mb-5"
      style={{
        backgroundColor: "#f5f0ff",
        borderColor: "#8a2be2",
        borderRadius: "12px",
        maxWidth: "500px",
      }}
    >
      <div className="card-body p-4">
        <h3 className="text-center mb-4 text-dark fw-bold">Register Society</h3>
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label fw-semibold">Society Name</label>
            <input type="text" name="societyName" value={form.societyName} onChange={handleChange} className="form-control" placeholder="Enter society name" required />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Contact Email</label>
              <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} className="form-control" placeholder="admin@example.com" required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Contact Phone</label>
              <input type="text" name="contactPhone" value={form.contactPhone} onChange={handleChange} className="form-control" placeholder="e.g. 9876543210" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className="form-control" placeholder="123 Street Name" required />
          </div>

          <div className="row">
            <div className="col-md-5 mb-3">
              <label className="form-label fw-semibold">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} className="form-control" placeholder="City" required />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">State</label>
              <input type="text" name="state" value={form.state} onChange={handleChange} className="form-control" placeholder="State" required />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-semibold">Pincode</label>
              <input type="text" name="pincode" value={form.pincode} onChange={handleChange} className="form-control" placeholder="Pin" required />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Create a password" required />
            <small className="text-muted">This will be used for the Society Admin account.</small>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold fs-5">
            Register Society
          </button>
        </form>

        {message && (
          <div className={`alert mt-3 ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
            {message}
          </div>
        )}

        <div className="text-center mt-3">
          <p>Already have a society account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}




