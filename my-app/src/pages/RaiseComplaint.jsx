import React, { useState } from 'react'
import { useSelector } from 'react-redux';

export default function RaiseComplaint() {
    const { user, token } = useSelector((state) => state.auth);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!title || !description || !category || !priority) {
            setMessage('Please fill in all required fields.');
            setIsError(true);
            return;
        }

        try {
            const payload = {
                userId: user?.id,
                societyId: user?.societyId || 1,
                title,
                description,
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
                setPriority('');
            } else {
                setMessage(data.error || "Failed to raise complaint.");
                setIsError(true);
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error — check backend connection");
            setIsError(true);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px", borderRadius: "12px" }}>
                <h3 className="text-center mb-4 fw-bold">Raise Complaint</h3>
                {message && (
                    <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label fw-semibold">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter complaint title"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label fw-semibold">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your issue"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label fw-semibold">Category</label>
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
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="priority" className="form-label fw-semibold">Priority</label>
                        <select
                            className="form-select"
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            required
                        >
                            <option value="">Select Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Submit Complaint</button>
                </form>
            </div>
        </div>
    );
}