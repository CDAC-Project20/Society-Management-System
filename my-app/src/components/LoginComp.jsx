import React, { useState } from "react";
import "./LoginPage.css";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      alert("Password is required");
      return;
    }

    dispatch(
      loginSuccess({
        email: formData.email,
        remember: formData.remember,
      })
    );

    console.log("Login Data:", formData);

    alert("Login Successful");
  };

  const handleGoogleLogin = () => {
    console.log("Google Login");
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password");
  };

  const handleSignup = () => {
    console.log("Navigate to Signup");
  };

  return (
    <div className="login-page">
      <div className="logo">
        <span className="logo-icon">⬡</span>
        <h2>InsideBox</h2>
      </div>

      <div className="login-card">
        <p className="subtitle">Please enter your details</p>

        <h1 className="title">Welcome back</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
          />

          <div className="options-row">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember for 30 days
            </label>

            <button
              type="button"
              className="link-btn"
              onClick={handleForgotPassword}
            >
              Forgot password
            </button>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>

          {/* <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </button> */}

          <p className="signup-text">
            Don't have an account?
            <button
              type="button"
              className="link-btn"
              onClick={handleSignup}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;