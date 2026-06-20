import React from "react";
import FooterComp from "../components/FooterComp";

export default function ComplaintComp() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Complaints</h2>
      <form className="w-75 mx-auto border p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="4"></textarea>
        </div>
        <button type="submit" className="btn btn-danger w-100">Submit Complaint</button>
      </form>
      <FooterComp />
    </div>
  );
}
