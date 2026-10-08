import axios from 'axios'

// axios = a library that sends HTTP requests (GET, POST, PUT) for us.
// This instance is pre-configured so EVERY request:
//  1. goes to our backend URL
//  2. automatically attaches the login token (so routes stay protected)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Request interceptor = runs BEFORE every request leaves the browser
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dp_token')
  if (token) {
    // "Authorization: Bearer <token>" is how the backend verifies us
    config.headers.Authorization = `Bearer ${token}` 
  }
  return config
})

// Response interceptor = runs AFTER every response arrives
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired/invalid -> backend returns 401 -> force logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('dp_token')
      localStorage.removeItem('dp_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
