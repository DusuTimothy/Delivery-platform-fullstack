import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard'
import CreateDelivery from './pages/customer/CreateDelivery'
import MyDeliveries from './pages/customer/MyDeliveries'
import DeliveryDetail from './pages/customer/DeliveryDetail'
import MyPayments from './pages/customer/MyPayments'
import Profile from './pages/Profile'

// Rider pages
import RiderDashboard from './pages/rider/Dashboard'
import AvailableJobs from './pages/rider/AvailableJobs'
import AssignedDeliveries from './pages/rider/AssignedDeliveries'
import RiderHistory from './pages/rider/History'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminRiders from './pages/admin/Riders'
import AdminDeliveries from './pages/admin/Deliveries'
import AdminPayments from './pages/admin/Payments'

// App.jsx decides WHICH page shows for WHICH user:
//  - Nobody logged in  -> only Login/Register accessible
//  - Customer logged in -> customer pages
//  - Rider logged in    -> rider pages
//  - Admin logged in    -> admin pages
export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes: you must be logged in to see these */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        {/* Customer-only pages */}
        <Route element={<ProtectedRoute role="CUSTOMER" />}>
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/customer/new-delivery" element={<CreateDelivery />} />
          <Route path="/customer/deliveries" element={<MyDeliveries />} />
          <Route path="/customer/deliveries/:id" element={<DeliveryDetail />} />
          <Route path="/customer/payments" element={<MyPayments />} />
        </Route>

        {/* Rider-only pages */}
        <Route element={<ProtectedRoute role="RIDER" />}>
          <Route path="/rider" element={<RiderDashboard />} />
          <Route path="/rider/jobs" element={<AvailableJobs />} />
          <Route path="/rider/assigned" element={<AssignedDeliveries />} />
          <Route path="/rider/history" element={<RiderHistory />} />
        </Route>

        {/* Admin-only pages */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/riders" element={<AdminRiders />} />
          <Route path="/admin/deliveries" element={<AdminDeliveries />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
        </Route>

        {/* Shared */}
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Unknown URL -> send home */}
      <Route
        path="*"
        element={
          <Navigate to={user ? homePath(user.role) : '/login'} replace />
        }
      />
    </Routes>
  )
}

// Where should each role land after login?
function homePath(role) {
  if (role === 'ADMIN') return '/admin'
  if (role === 'RIDER') return '/rider'
  return '/customer'
}
