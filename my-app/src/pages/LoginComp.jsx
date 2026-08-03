// import { useReducer, useState } from "react"
// import { useDispatch } from "react-redux"
// import { loginSuccess } from "../redux/authSlice"
// import { useNavigate } from "react-router-dom"

// export default function LoginComp() {
//     const [username, setusername] = useState("")
//     const [password, setpassword] = useState("")
//     const [message, setMessage] = useState("")
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const handlesubmit = (e) => {
//         e.preventDefault();
//         const reqoptions = {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username: username, password: password })
//         };
//         fetch("http://localhost:3000/login",reqoptions)
//         .then(resp => {
//             if(resp.status === 200){
//                 setMessage("Successful")
//                 return resp.json();
//             }
//             else if(resp.status === 404)
//                 setMessage("Invalid Username or Password")
//                 return {}
//         })
//         // .then(resp => resp.json())
//         .then(data => {
//             console.log(JSON.stringify(data));
//             //redux state modify
//             dispatch(loginSuccess({user: data.user , token: data.token}))
//             if(data.user.role === 1){ //admin
//                 //navigate admin dashboard
//                 navigate("/admin");
//             }
//             else if(data.user.role === 2){ //user
//                 //navigate to user dashboard
//                 navigate("/user");
//             }


//             // if (data.success){
//             //     setMessage("Incorrect password or username")
//             // }
//             // else{
//             //     setMessage("sucessful");
//             //     console.log("Response:", data);
//             // }
//         })
//         .catch(err =>{ 
//             setMessage("Incorrect password or username")
//             console.error("Error:", err)
//         });
//     };
//     return (
//         <>
//             <h1>Login Form </h1>
//             <form>
//                 Enter username :
//                 <input type="text" name="username" value={username} onChange={(e)=>{setusername(e.target.value)}} />
//                 <br />
//                 Enter password :
//                 <input type="password" name = "password" value={password} onChange={(e)=>{setpassword(e.target.value)}} />
//                 <br />
//                 <input type="submit" value="Login" onClick={handlesubmit}/>
//             </form>

//             {message && <p>{message}</p>}

//             <p> {username} </p>
//             <p> {password} </p>
//         </>
//     )
// }


import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginComp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Successful");
        const userData = data.user || {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role || 1,
          roleName: data.roleName || "SuperAdmin",
          societyName: data.societyName,
        };
        const token = data.token || "dummy-jwt-token";

        dispatch(loginSuccess({ user: userData, token }));

        if (userData.role === 1) navigate("/superadmin");
        else if (userData.role === 2) navigate("/secretary");
        else if (userData.role === 3) navigate("/owner");
        else if (userData.role === 4) navigate("/tenant");
      } else {
        setMessage(data.message || "Invalid Email or Password");
      }
    } catch (err) {
      setMessage("Server error — please verify backend is running");
      console.error("Error:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div
            className="card shadow-lg"
            style={{
              backgroundColor: "#f5f0ff",
              borderColor: "#8a2be2",
              borderRadius: "12px",
            }}
          >
            <div className="card-body">
              <h2 className="text-center mb-4 text-dark fw-bold">Login Form</h2>
              <form onSubmit={handlesubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              {message && (
                <p className="text-center mt-3 text-danger fw-semibold">
                  {message}
                </p>
              )}

              {/* <p className="text-center mt-3">
                Don’t have an account?{" "}
                <a href="/register" className="text-primary fw-bold">
                  Register here
                </a>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
