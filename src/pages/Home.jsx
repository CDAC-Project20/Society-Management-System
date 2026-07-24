// import { NavLink, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useState, useEffect } from "react";
// import { loginSuccess, logout } from "../redux/authSlice";

// export default function HomeComp() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // 🔁 Redirect automatically if already logged in
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       if (user.role === 1) navigate("/superadmin");
//       else if (user.role === 2) navigate("/secretary");
//       else if (user.role === 3) navigate("/owner");
//       else if (user.role === 4) navigate("/tenant");
//     }
//   }, [isAuthenticated, user, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:3000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         dispatch(loginSuccess(data));

//         // Redirect based on role
//         if (data.role === 1) navigate("/superadmin");
//         else if (data.role === 2) navigate("/secretary");
//         else if (data.role === 3) navigate("/owner");
//         else if (data.role === 4) navigate("/tenant");
//       } else {
//         alert(data.message || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error — check if backend is running on port 5000");
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <>

//       {/* Main content */}
//       <div className="container mt-5">
//         <div className="row align-items-center">
//           {/* Left section */}
//           <div className="col-md-6">
//             <h1 className="fw-bold mb-3">Welcome to Society Management System</h1>
//             <p className="lead mb-4">
//               Manage complaints, payments, meetings, and more — all in one place.
//             </p>
//           </div>

//           {/* Right section (Login form) */}
//           {!isAuthenticated && (
//             <div className="col-md-6 bg-light p-4 rounded shadow-sm">
//               <h3 className="fw-bold mb-4 text-center">Login</h3>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label">Username</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     placeholder="Enter your username"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100">Login</button>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { loginSuccess, logout } from "../redux/authSlice";
// import { useNavigate } from "react-router-dom";
// import RegisterComp from "./Register";

// export default function HomeComp() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showRegister, setShowRegister] = useState(false);

//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Redirect if already logged in
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       if (user.role === 1) navigate("/superadmin");
//       else if (user.role === 2) navigate("/secretary");
//       else if (user.role === 3) navigate("/owner");
//       else if (user.role === 4) navigate("/tenant");
//     }
//   }, [isAuthenticated, user, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:3000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         dispatch(loginSuccess({ user: data.user, token: data.token }));

//         if (data.user.role === 1) navigate("/superadmin");
//         else if (data.user.role === 2) navigate("/secretary");
//         else if (data.user.role === 3) navigate("/owner");
//         else if (data.user.role === 4) navigate("/tenant");
//       } else {
//         alert(data.message || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error — check backend");
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row align-items-center">
//         {/* Left section */}
//         <div className="col-md-6">
//           <h1 className="fw-bold mb-3">Welcome to Society Management System</h1>
//           <p className="lead mb-4">
//             Manage complaints, payments, meetings, and more — all in one place.
//           </p>
//         </div>

//         {/* Right section (Login or Register form) */}
//         <div className="col-md-6 bg-light p-4 rounded shadow-sm">
//           {!isAuthenticated && (
//             <>
//               {showRegister ? (
//                 <RegisterComp />
//               ) : (
//                 <>
//                   <h3 className="fw-bold mb-4 text-center">Login</h3>
//                   <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                       <label className="form-label">Username</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         placeholder="Enter your username"
//                         required
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label className="form-label">Password</label>
//                       <input
//                         type="password"
//                         className="form-control"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Enter your password"
//                         required
//                       />
//                     </div>
//                     <button type="submit" className="btn btn-primary w-100">
//                       Login
//                     </button>
//                   </form>
//                 </>
//               )}

//               {/* Toggle buttons */}
//               <div className="text-center mt-3">
//                 {showRegister ? (
//                   <button
//                     className="btn btn-link text-primary fw-bold"
//                     onClick={() => setShowRegister(false)}
//                   >
//                     Already have an account? Login
//                   </button>
//                 ) : (
//                   <button
//                     className="btn btn-link text-primary fw-bold"
//                     onClick={() => setShowRegister(true)}
//                   >
//                     Don’t have an account? Register
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import RegisterComp from "./Register";

export default function HomeComp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 1) navigate("/superadmin");
      else if (user.role === 2) navigate("/secretary");
      else if (user.role === 3) navigate("/owner");
      else if (user.role === 4) navigate("/tenant");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));

        if (data.user.role === 1) navigate("/superadmin");
        else if (data.user.role === 2) navigate("/secretary");
        else if (data.user.role === 3) navigate("/owner");
        else if (data.user.role === 4) navigate("/tenant");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server error — check backend");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Left section */}
        <div className="col-md-6">
          <h1 className="fw-bold mb-3">Welcome to Society Management System</h1>
          <p className="lead mb-4">
            Manage complaints, payments, meetings, and more — all in one place.
          </p>
        </div>

        {/* Right section (Login or Register form) */}
        <div className="col-md-6 bg-light p-4 rounded shadow-sm">
          {!isAuthenticated && (
            <>
              {showRegister ? (
                <RegisterComp />
              ) : (
                <>
                  <h3 className="fw-bold mb-4 text-center">Login</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Login
                    </button>
                  </form>

                  {/* ✅ Message + Link */}
                  <p className="text-center mt-3">
                    Don’t have an account?{" "}
                    <button
                      className="btn btn-link text-primary fw-bold p-0"
                      onClick={() => setShowRegister(true)}
                    >
                      Register
                    </button>
                  </p>
                </>
              )}

              {/* Toggle back to login */}
              {showRegister && (
                <div className="text-center mt-3">
                  Already have an account?{" "}
                  <button
                    className="btn btn-link text-primary fw-bold"
                    onClick={() => setShowRegister(false)}
                  >
                  Login
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
