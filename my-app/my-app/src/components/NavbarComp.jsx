import React from "react";
import { Link } from "react-router-dom";

export default function NavbarComp() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Society System</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/create-account">Create Account</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/complaints">Complaints</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/payment">Payments</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/polls">Polls</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/visitor">Visitors</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/notice">Notices</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
