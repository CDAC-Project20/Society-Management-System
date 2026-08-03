// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function RegisterComp() {
//   const [form, setForm] = useState({
//     userid: "",
//     username: "",
//     password: "",
//     firstname: "",
//     lastname: "",
//     roleid: "",
//     email: "",
//     contactnumber: "",
//   });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:3000/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage(data.message);
//         navigate("/login"); // redirect to login after success
//       } else {
//         setMessage(data.error || "Registration failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Server error — check backend");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-8">
//           <div className="card shadow-lg" style={{ backgroundColor: "#f5f0ff", borderColor: "#8a2be2", borderRadius: "12px" }}>
//             <div className="card-body">
//               <h2 className="text-center mb-4 text-dark fw-bold">Register</h2>
//               <form onSubmit={handleSubmit}>
//                 {["userid","username","password","firstname","lastname","email","contactnumber"].map((field) => (
//                   <div className="mb-3" key={field}>
//                     <label className="form-label">{field}</label>
//                     <input
//                       type={field === "password" ? "password" : "text"}
//                       name={field}
//                       value={form[field]}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder={`Enter ${field}`}
//                     />
//                   </div>
//                 ))}
//                 <div className="mb-3">
//                   <label className="form-label">Role</label>
//                   <select name="roleid" value={form.roleid} onChange={handleChange} className="form-select">
//                     <option value="">Select Role</option>
//                     <option value={1}>Super Admin</option>
//                     <option value={2}>Secretary</option>
//                     <option value={3}>Owner</option>
//                     <option value={4}>Tenant</option>
//                   </select>
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100">Register</button>
//               </form>
//               {message && <p className="text-center mt-3 text-danger fw-semibold">{message}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterComp() {
  const [form, setForm] = useState({
    userid: "",
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    roleid: "",
    email: "",
    contactnumber: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    for (const key in form) {
      if (!form[key]) {
        setMessage(`Field "${key}" is required`);
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:8080/societies/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Registration successful");
        navigate("/login");
      } else {
        setMessage(data.error || data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error — check backend");
    }
  };

  return (
    <div
      className="card shadow-sm mx-auto"
      style={{
        backgroundColor: "#f5f0ff",
        borderColor: "#8a2be2",
        borderRadius: "12px",
        maxWidth: "400px", // ✅ smaller width
      }}
    >
      <div className="card-body">
        <h3 className="text-center mb-3 text-dark fw-bold">Register</h3>
        <form onSubmit={handleSubmit}>
          {["userid","username","password","firstname","lastname","email","contactnumber"].map((field) => (
            <div className="mb-2" key={field}>
              <label className="form-label">{field}</label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="form-control"
                placeholder={`Enter ${field}`}
                required
              />
            </div>
          ))}
          <div className="mb-2">
            <label className="form-label">Role</label>
            <select
              name="roleid"
              value={form.roleid}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Role</option>
              <option value={2}>Secretary</option>
              <option value={3}>Owner</option>
              <option value={4}>Tenant</option>
              {/* ✅ Admin excluded — only one allowed */}
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">
            Register
          </button>
        </form>
        {message && (
          <p className="text-center mt-2 text-danger fw-semibold">{message}</p>
        )}
      </div>
    </div>
  );
}
