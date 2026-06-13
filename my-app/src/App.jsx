import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginComp from './components/LoginComp'
import HomeComp from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoutes'
import LogoutComp from './pages/LogOutComp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeComp />}>
            <Route path='login' element={<LoginComp />} />
            <Route path='register' element={<h1>Registration</h1>} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role={1}>
                <AdminDashboard />
              </ProtectedRoute>
            }> <Route path="user" element={<h1>Users</h1>} />
            <Route path="reports" element={<h1>Reports</h1>} />
            <Route path="logout" element={<LogoutComp />} />
            

          </Route>
          <Route
            path="/user"
            element={
              <ProtectedRoute role={2}>
                <UserDashboard />
              </ProtectedRoute>
            }>
              <Route path="search" element={<h1>Search</h1>} />
            <Route path="booking" element={<h1>Booking</h1>} />
            <Route path="logout" element={<LogoutComp />} />
          </Route>
            <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
