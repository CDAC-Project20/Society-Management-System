import React from "react";
import FooterComp from "../components/FooterComp";

export default function CreateAccountComp() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create New Account</h2>
      <form className="w-75 mx-auto border p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile Number</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input type="password" className="form-control" />
        </div>
        <button type="submit" className="btn btn-success w-100">Create Account</button>
      </form>
      <FooterComp />
    </div>
  );
}


