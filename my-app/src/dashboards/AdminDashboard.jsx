import React from "react";
import { Outlet } from "react-router-dom";
import FooterComp from "../components/FooterComp";

export default function AdminDashboard() {
  return (
    <div className="container mt-5">
      <h2 className="text-center">Admin Dashboard</h2>
      <Outlet />
      <FooterComp />
    </div>
  );
}

