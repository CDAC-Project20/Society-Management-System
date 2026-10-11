import { useState } from "react";
import { useSelector } from "react-redux";

export default function CreateFlat() {
  const { user, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    flatNumber: "",
    floorNumber: "",
    flatType: "2BHK",
    status: "Vacant",
    ownerId: "",
    tenantId: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      flatNumber: form.flatNumber,
      floorNumber: form.floorNumber ? parseInt(form.floorNumber, 10) : null,
      flatType: form.flatType,
      status: form.status,
      ownerId: form.ownerId ? parseInt(form.ownerId, 10) : null,
      tenantId: form.tenantId ? parseInt(form.tenantId, 10) : null,
      secretaryId: user?.id,
    };

    try {
      const res = await fetch("http://localhost:8080/flats/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Flat ${data.flatNumber || form.flatNumber} created successfully!`);
        setIsError(false);
        setForm({
          flatNumber: "",
          floorNumber: "",
          flatType: "2BHK",
          status: "Vacant",
          ownerId: "",
          tenantId: "",
        });
      } else {
        setMessage(data.error || "Failed to create flat.");
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
        maxWidth: "550px",
      }}
    >
      <div className="card-body p-4">
        <h3 className="text-center mb-4 text-dark fw-bold">Create New Flat</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Flat Number *</label>
              <input
                type="text"
                name="flatNumber"
                value={form.flatNumber}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. A-101"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Floor Number</label>
              <input
                type="number"
                name="floorNumber"
                value={form.floorNumber}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. 1"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Flat Type</label>
              <select
                name="flatType"
                value={form.flatType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
                <option value="4BHK">4 BHK</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Vacant">Vacant</option>
                <option value="Occupied">Occupied</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Owner User ID *</label>
            <input
              type="number"
              name="ownerId"
              value={form.ownerId}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter User ID of Owner"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Tenant User ID (Optional)</label>
            <input
              type="number"
              name="tenantId"
              value={form.tenantId}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter User ID of Tenant if occupied"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold fs-5">
            Create Flat
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
