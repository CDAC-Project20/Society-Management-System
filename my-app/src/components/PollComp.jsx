import React from "react";
import FooterComp from "../components/FooterComp";

export default function PollComp() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Polls</h2>
      <div className="card w-75 mx-auto mb-3">
        <div className="card-body">
          <h5 className="card-title">Should we install solar panels?</h5>
          <button className="btn btn-outline-success me-2">Yes</button>
          <button className="btn btn-outline-danger">No</button>
        </div>
      </div>
      <FooterComp />
    </div>
  );
}


