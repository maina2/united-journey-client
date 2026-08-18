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
import { Statistics } from '../pages/Statistics'
import { Badges } from '../pages/Badges'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shared route */}
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        {/* Public-only Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/wrapped" element={<Wrapped />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/badges" element={<Badges />} />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen">Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}