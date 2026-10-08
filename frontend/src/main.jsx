import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// The design system, in order: tokens (variables) -> base (reset/layout) -> components
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// main.jsx = where the app starts
// 1. BrowserRouter  -> enables page routes like /login, /dashboard
// 2. AuthProvider   -> shares login/user info with every page
// 3. ToastContainer -> small popup messages (success/error) for the user
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
