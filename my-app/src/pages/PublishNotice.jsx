import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function PublishNotice() {
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!title || !description || !publishedDate || !expiryDate) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    try {
      const payload = {
        societyId: user?.societyId || 1,
        userId: user?.id,
        title,
        description,
        publishedDate: new Date(publishedDate).toISOString(),
        expiryDate: new Date(expiryDate).toISOString()
      };

      const response = await fetch("http://localhost:8080/api/society/notices/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token ? { "Authorization": `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("Notice published successfully!");
        setMessageType("success");
        setTitle("");
        setDescription("");
        setPublishedDate("");
        setExpiryDate("");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Failed to publish notice");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
      setMessageType("error");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">Publish Notice</h3>
            </div>
            <div className="card-body bg-light">
              {message && (
                <div className={`alert alert-${messageType === "success" ? "success" : "danger"}`} role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notice title"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter notice description"
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Published Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={publishedDate}
                      onChange={(e) => setPublishedDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Expiry Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-center mt-3">
                  <button type="submit" className="btn btn-primary px-5 fw-bold">
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
