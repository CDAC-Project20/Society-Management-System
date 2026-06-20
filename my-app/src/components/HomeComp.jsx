import React from "react";
import FooterComp from "../components/FooterComp";

export default function HomeComp() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to Society Management System</h1>
      <p className="text-center">Manage complaints, payments, polls, visitors, and notices all in one place.</p>
      <FooterComp />
    </div>
  );
}

