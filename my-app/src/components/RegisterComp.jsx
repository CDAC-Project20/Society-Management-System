import React from "react";
import FooterComp from "../components/FooterComp";

export default function RegisterComp() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Register</h2>
      <form className="w-75 mx-auto border p-4 rounded shadow">
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" />
        </div>
        <button type="submit" className="btn btn-success w-100">Register</button>
      </form>
      <FooterComp />
    </div>
  );
}


