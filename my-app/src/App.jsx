import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavbarComp from './components/NavbarComp'
import HomeComp from './components/HomeComp'
import LoginComp from './components/LoginComp'
import RegisterComp from './components/RegisterComp'
import CreateAccountComp from './components/CreateAccountComp'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './dashboards/AdminDashboard'
import ComplaintComp from './components/ComplaintComp'
import PollComp from './components/PollComp'
import LogoutComp from './components/LogoutComp'
import UserDashboard from './dashboards/UserDashboard'
import PaymentComp from './components/PaymentComp'
import NoticeComp from './components/NoticeComp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      
      <NavbarComp />

      {/* Define routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeComp />} />
        <Route path="/login" element={<LoginComp />} />
        <Route path="/register" element={<RegisterComp />} />
        <Route path="/create-account" element={<CreateAccountComp />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={1}>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        >
          <Route path="complaints" element={<ComplaintComp />} />
          <Route path="polls" element={<PollComp />} />
          <Route path="logout" element={<LogoutComp />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role={2}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="complaints" element={<ComplaintComp />} />
          <Route path="polls" element={<PollComp />} />
          <Route path="payment" element={<PaymentComp />} />
          <Route path="logout" element={<LogoutComp />} />
        </Route>

        {/* Common Routes 
        <Route path="/visitor" element={<VisitorCom />} />*/}
        <Route path="/notice" element={<NoticeComp />} />
        <Route path="/unauthorized" element={<h1 className="text-center mt-5">Unauthorized Access</h1>} />
      </Routes>
      
      
      </BrowserRouter>
    </>
  )
}

export default App
