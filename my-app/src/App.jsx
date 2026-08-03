import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginComp from './pages/LoginComp'
import HomeComp from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
//import UserDashboard from './pages/UserDashboard'
import ProtectedRoute from './components/ProtectedRoutes'
import LogoutComp from './pages/LogOutComp'
import Navbar from './pages/Navbar'
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SecretaryDashboard from "./pages/SecretaryDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import SocietyRegisterComp from './pages/SocetyRegister';
import UserRegister from './pages/UserRegister';
import PublishNotice from './pages/PublishNotice';
import RaiseComplaint from './pages/RaiseComplaint';
import CreateFlat from './pages/CreateFlat';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Navbar />
        {/* <Routes>
         
          <Route path="/" element={<HomeComp/>} />
          <Route path="/login" element={<LoginComp />} />
          <Route path="/logout" element={<LogoutComp />} />

          
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute role={1}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="complaints" element={<h1>Complaints</h1>} />
            <Route path="payments" element={<h1>Payments</h1>} />
            <Route path="users" element={<h1>Users</h1>} />
            <Route path="flats" element={<h1>Flats</h1>} />
            <Route path="reports" element={<h1>Reports</h1>} />
            <Route path="documents" element={<h1>Documents</h1>} />
            <Route path="meetings" element={<h1>Meetings</h1>} />
            <Route path="notices" element={<h1>Notices</h1>} />
            <Route path="polls" element={<h1>Polls</h1>} />
          </Route>

          
          <Route
            path="/secretary"
            element={
              <ProtectedRoute role={2}>
                <SecretaryDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="complaints" element={<h1>Complaints</h1>} />
            <Route path="payments" element={<h1>Payments</h1>} />
            <Route path="meetings" element={<h1>Meetings</h1>} />
            <Route path="notices" element={<h1>Notices</h1>} />
          </Route>

          
          <Route
            path="/owner"
            element={
              <ProtectedRoute role={3}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="complaints" element={<h1>Complaints</h1>} />
            <Route path="payments" element={<h1>Payments</h1>} />
            <Route path="tenants" element={<h1>Manage Tenants</h1>} />
            <Route path="booking" element={<h1>Facility Booking</h1>} />
          </Route>

          
          <Route
            path="/tenant"
            element={
              <ProtectedRoute role={4}>
                <TenantDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="complaints" element={<h1>Complaints</h1>} />
            <Route path="payments" element={<h1>Payments</h1>} />
            <Route path="profile" element={<h1>My Profile</h1>} />
            <Route path="booking" element={<h1>Facility Booking</h1>} />
          </Route>
        </Routes> */}

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomeComp />} />
          <Route path="/login" element={<LoginComp />} />
          <Route path="/register" element={<SocietyRegisterComp />} />
          <Route path="/logout" element={<LogoutComp />} />

          {/* Super Admin routes */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute role={1}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<h2 className="text-center mt-5">Welcome to Super Admin Dashboard</h2>} />
            <Route path="users" element={<h1>Users Page</h1>} />
            {/* <Route path="flats" element={<h1>Flats Page</h1>} />
          <Route path="reports" element={<h1>Reports Page</h1>} />
          <Route path="documents" element={<h1>Documents Page</h1>} />
          <Route path="meetings" element={<h1>Meetings Page</h1>} />
          <Route path="notices" element={<h1>Notices Page</h1>} />
          <Route path="polls" element={<h1>Polls Page</h1>} /> */}
          </Route>
          {/* </Route> */}

          {/* Secretary routes */}
          <Route
            path="/secretary"
            element={
              <ProtectedRoute role={2}>
                <SecretaryDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<h2 className="text-center mt-5">Welcome to Secretary Dashboard</h2>} />
            <Route path="UserRegister" element={<UserRegister />} />
            <Route path="flats" element={<CreateFlat />} />
            <Route path="complaints" element={<h1>View Complaints</h1>} />
            <Route path="notices" element={<PublishNotice />} />
            <Route path="meetings" element={<h1>Meetings Page</h1>} />
          </Route>

          {/* Owner routes */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute role={3}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<h2 className="text-center mt-5">Welcome to Owner Dashboard</h2>} />
            <Route path='Notice' element={<h1>Notice</h1>} />

            <Route path="UserRegister" element={<UserRegister />} />
            <Route path="complaints" element={<RaiseComplaint />} />
            <Route path="documents" element={<h1>Documents Page</h1>} />
            <Route path="meetings" element={<h1>Meetings Page</h1>} />
            <Route path="polls" element={<h1>Polls Page</h1>} />
          </Route>

          {/* Tenant routes */}
          <Route
            path="/tenant"
            element={
              <ProtectedRoute role={4}>
                <TenantDashboard />
              </ProtectedRoute>
            }
          >
            <Route path='Notice' element={<h1>Notice</h1>} />
            <Route path="complaints" element={<RaiseComplaint />} />
            <Route path="documents" element={<h1>Documents Page</h1>} />
            <Route path="meetings" element={<h1>Meetings Page</h1>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
