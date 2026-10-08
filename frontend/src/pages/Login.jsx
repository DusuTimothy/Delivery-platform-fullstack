import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { LogoMark, IconRoute, IconParcel, IconDispatch } from '../graphics/Brand'
import { HERO_PHOTOS } from '../graphics/photos'
import { PhotoFrame } from '../graphics/Illustrations'

// Login page:
// 1. user types email + password
// 2. we POST to /api/auth/login
// 3. backend checks password (hashed) and returns a JWT token
// 4. we save token + user in AuthContext (memory + localStorage)
// 5. we send the user to THEIR dashboard based on role
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.user, data.token)
      toast.success('Welcome back!')
      // Go back to the page they tried to open, or their dashboard
      const dest = location.state?.from?.pathname
      const home =
        data.user.role === 'ADMIN' ? '/admin' : data.user.role === 'RIDER' ? '/rider' : '/customer'
      navigate(dest || home, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Marketing hero: real photo + value props (visible on wide screens) */}
      <aside className="auth-hero">
        <PhotoFrame
          className="auth-hero-photo"
          src={HERO_PHOTOS.signin}
          alt="Customer signing for a parcel delivery on a phone"
          caption="Proof of delivery, signed in seconds"
        />
        <div>
          <h2 className="auth-hero-title">Deliver anything,<br />across any city.</h2>
          <p className="auth-hero-sub">
            One platform for customers, riders and operators - from pickup to proof of delivery.
          </p>
        </div>
        <ul className="auth-features">
          <li className="auth-feature">
            <span className="auth-feature-icon"><IconRoute size={18} /></span>
            Live status tracking from PENDING to DELIVERED
          </li>
          <li className="auth-feature">
            <span className="auth-feature-icon"><IconDispatch size={18} /></span>
            Smart rider dispatch - online riders get jobs instantly
          </li>
          <li className="auth-feature">
            <span className="auth-feature-icon"><IconParcel size={18} /></span>
            Payments and refunds recorded on every delivery
          </li>
        </ul>
      </aside>

      <div className="auth-card">
        <div className="auth-brand">
          <LogoMark size={48} />
          <div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Sign in to your Delivery Platform account</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="login-email">Email</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                name="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="login-password">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" aria-hidden="true" />
              <input
                id="login-password"
                type="password"
                name="password"
                className="input"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <><Loader2 size={16} className="spin" aria-hidden="true" /> Signing in...</>
            ) : (
              <>Sign In <ArrowRight size={16} aria-hidden="true" /></>
            )}
          </button>
        </form>

        <p className="auth-footer">
          No account? <Link to="/register">Create one here</Link>
        </p>
      </div>
    </div>
  )
}
