import React from "react";

export default function FooterComp() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-5">
      <div className="container">
        <p className="mb-1">© 2026 Society Management System</p>
        <p className="mb-0">
          <a href="/notice" className="text-light me-3">Notices</a>
          <a href="/complaints" className="text-light me-3">Complaints</a>
          <a href="/payment" className="text-light">Payments</a>
        </p>
      </div>
    </footer>
  );
}


