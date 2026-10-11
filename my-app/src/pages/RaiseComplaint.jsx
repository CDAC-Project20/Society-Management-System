import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function RaiseComplaint() {
    const { user, token } = useSelector((state) => state.auth);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [myComplaints, setMyComplaints] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Fetch complaints raised by this user
    const fetchMyComplaints = async () => {
        const societyId = user?.societyId || 1;
        try {
            const res = await fetch(`http://localhost:8080/complaints/society/${societyId}`, {
                headers: { Authorization: `Bearer ${token || ""}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    const mine = data.filter(c => c.raisedById === user?.id || c.userId === user?.id);
                    setMyComplaints(mine);
                }
            }
        } catch (err) {
            console.error("Error fetching complaints:", err);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchMyComplaints();
        }
    }, [user, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!title.trim() || !description.trim() || !category || !priority) {
            setMessage('Please fill in all required fields.');
            setIsError(true);
            return;
        }

        if (!user?.id) {
            setMessage('User session not found. Please log in again.');
            setIsError(true);
            return;
        }

        setSubmitting(true);
        try {
            // Using userId only - no dependency on flatId
            const payload = {
                userId: user.id,
                societyId: user?.societyId || 1,
                title: title.trim(),
                description: description.trim(),
                category,
                priority
            };

            const res = await fetch("http://localhost:8080/api/society/complaints/raise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token || ""}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Complaint registered successfully!");
                setIsError(false);
                setTitle('');
                setDescription('');
                setCategory('');
                setPriority('Medium');
                fetchMyComplaints();
            } else {
                setMessage(data.error || "Failed to raise complaint.");
                setIsError(true);
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error — check backend connection");
            setIsError(true);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const s = (status || 'Open').toLowerCase();
        if (s === 'resolved' || s === 'closed') {
            return <span className="badge bg-success">Resolved</span>;
        }
        if (s === 'in progress') {
            return <span className="badge bg-info text-dark">In Progress</span>;
        }
        return <span className="badge bg-warning text-dark">Open</span>;
    };

    const getPriorityBadge = (p) => {
        const pr = (p || 'Medium').toLowerCase();
        if (pr === 'high') return <span className="badge bg-danger">High</span>;
        if (pr === 'low') return <span className="badge bg-secondary">Low</span>;
        return <span className="badge bg-primary">Medium</span>;
    };

    return (
        <div className="container py-4">
            <div className="row g-4 justify-content-center">
                {/* Raise Complaint Form Card */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0" style={{ borderRadius: "14px" }}>
                        <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
                            <h4 className="fw-bold text-dark mb-1">📢 Raise a Complaint</h4>
                            <p className="text-muted small">
                                Submitting as: <strong>{user?.firstName || 'User'} {user?.lastName || ''}</strong> ({user?.roleName || (user?.role === 4 ? 'Tenant' : 'Owner')})
                            </p>
                        </div>
                        <div className="card-body p-4">
                            {message && (
                                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
                                    {message}
                                    <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Title */}
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label fw-semibold">
                                        Complaint Title <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Water leakage, Electricity issue"
                                        required
                                    />
                                </div>

                                {/* Category & Priority row */}
                                <div className="row g-2 mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="category" className="form-label fw-semibold">
                                            Category <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Water">Water</option>
                                            <option value="Electricity">Electricity</option>
                                            <option value="Plumbing">Plumbing</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Security">Security</option>
                                            <option value="Lift">Lift / Elevator</option>
                                            <option value="Parking">Parking</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="priority" className="form-label fw-semibold">
                                            Priority <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            id="priority"
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            required
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label htmlFor="description" className="form-label fw-semibold">
                                        Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        rows="4"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Provide detailed description of the grievance..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 fw-semibold"
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Submit Complaint"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Complaints History Card */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "14px" }}>
                        <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="fw-bold text-dark mb-1">📋 My Complaints</h4>
                                <p className="text-muted small">Track status of previously submitted grievances</p>
                            </div>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={fetchMyComplaints}
                                title="Refresh Complaints"
                            >
                                🔄 Refresh
                            </button>
                        </div>
                        <div className="card-body p-4">
                            {myComplaints.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <div className="fs-1 mb-2">📑</div>
                                    <p className="mb-0">No complaints registered yet.</p>
                                    <small className="text-secondary">When you raise a complaint, its progress will appear here.</small>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {myComplaints.map((c) => (
                                        <div key={c.id} className="list-group-item px-0 py-3 border-bottom">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <h6 className="fw-bold mb-0 text-dark">
                                                    #{c.id} {c.title}
                                                </h6>
                                                <div className="d-flex gap-1">
                                                    {getPriorityBadge(c.priority)}
                                                    {getStatusBadge(c.status)}
                                                </div>
                                            </div>
                                            <p className="text-muted small mb-2">{c.description}</p>
                                            <div className="d-flex flex-wrap gap-3 text-secondary small">
                                                {c.flatNumber && (
                                                    <span>🏢 Flat: <strong>{c.flatNumber}</strong></span>
                                                )}
                                                <span>🏷️ Category: <strong>{c.category || 'General'}</strong></span>
                                                {c.createdAt && (
                                                    <span>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}