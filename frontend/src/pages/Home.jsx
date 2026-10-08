import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// "/" is just a signpost: it sends each user to THEIR dashboard
export default function Home() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const home = user.role === 'ADMIN' ? '/admin' : user.role === 'RIDER' ? '/rider' : '/customer'
  return <Navigate to={home} replace />
}
