import React from "react";
import { Outlet } from "react-router-dom";
import FooterComp from "../components/FooterComp";

export default function UserDashboard() {
  return (
    <div className="container mt-5">
      <h2 className="text-center">User Dashboard</h2>
      <Outlet />
      <FooterComp />
    </div>
  );
}





