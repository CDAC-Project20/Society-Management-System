import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserRegister() {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Determine user type being registered based on current logged in user role
  const isOwner = user?.role === 3 || user?.roleName?.toLowerCase() === "owner";
  const userTypeToRegister = isOwner ? "Tenant" : "Owner";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Attach the ID of the logged in user who is creating this user
    const payload = {
      ...form,
      createdByAdminId: user?.id
    };

    try {
      const res = await fetch("http://localhost:8080/users/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || `Successfully registered new ${data.roleName || userTypeToRegister}!`);
        setIsError(false);
        // Clear form on success
        setForm({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "" });
      } else {
        setMessage(data.error || "Registration failed");
        setIsError(true);
      }

    } catch (err) {
      console.error(err);
      setMessage("Server error — check backend");
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
        <h3 className="text-center mb-4 text-dark fw-bold">Register New {userTypeToRegister}</h3>
        <form onSubmit={handleSubmit}>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">First Name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="form-control" placeholder="John" required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Last Name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="form-control" placeholder="Doe" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="user@example.com" required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="form-control" placeholder="e.g. 9876543210" required />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Create a temporary password" required />
            <small className="text-muted">The user will use this to log in.</small>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold fs-5">
            Register {userTypeToRegister}
          </button>
        </form>

        {message && (
          <div className={`alert mt-3 ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
            {message}
          </div>
        )}
        
      </div>
    </div>
  );
}
