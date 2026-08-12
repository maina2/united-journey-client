import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { Layout } from '../components/common/Layout'

import { Landing } from '../pages/Landing'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Dashboard } from '../pages/Dashboard'
import { Matches } from '../pages/Matches'
import { Leaderboards } from '../pages/Leaderboards'
import { Wrapped } from '../pages/Wrapped'
import { Cards } from '../pages/Cards'
import { Profile } from '../pages/Profile'
import { Admin } from '../pages/Admin'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<PublicRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/wrapped" element={<Wrapped />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>

        <Route path="*" element={<div className="flex items-center justify-center min-h-screen">Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
