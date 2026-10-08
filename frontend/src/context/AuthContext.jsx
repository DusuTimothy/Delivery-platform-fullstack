import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

// AuthContext = a shared "memory" for the whole app.
// It remembers: who is logged in, their role, and their token.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Read saved session from localStorage (so refresh doesn't log you out)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dp_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('dp_token'))

  // Whenever user/token changes, save them (persistence)
  useEffect(() => {
    if (user) localStorage.setItem('dp_user', JSON.stringify(user))
    else localStorage.removeItem('dp_user')
  }, [user])

  useEffect(() => {
    if (token) localStorage.setItem('dp_token', token)
    else localStorage.removeItem('dp_token')
  }, [token])

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper so pages can write: const { user, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
