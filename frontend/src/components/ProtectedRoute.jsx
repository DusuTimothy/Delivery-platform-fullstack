import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ProtectedRoute = a security guard.
//  - Not logged in? -> kick to /login
//  - Wrong role?    -> kick to their own home page
// This is the FRONTEND version of protection;
// the real security still happens on the backend (JWT + role checks).
export default function ProtectedRoute({ role }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Nobody logged in -> login page, remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    // Logged in but wrong area -> send to their own dashboard
    const home =
      user.role === 'ADMIN' ? '/admin' : user.role === 'RIDER' ? '/rider' : '/customer'
    return <Navigate to={home} replace />
  }

  return <Outlet />
}
