import React from "react";
import { useDispatch } from "react-redux";
import {logout} from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import FooterComp from "../components/FooterComp";

export default function LogoutComp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Are you sure you want to logout?</h2>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
      <FooterComp />
    </div>
  );
}


