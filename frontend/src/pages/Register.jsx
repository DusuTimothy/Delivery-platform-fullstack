import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader2, Users, Bike } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { LogoMark, IconScooter, IconWarehouse, IconParcel } from '../graphics/Brand'
import { HERO_PHOTOS } from '../graphics/photos'
import { VehiclePhoto, PhotoFrame } from '../graphics/Illustrations'

// Register page:
// - new users pick a role: CUSTOMER or RIDER
// - if RIDER is picked -> extra fields (vehicle + license) appear
//   because a Rider row needs that info in the database
// - the backend hashes the password; we NEVER send plain passwords anywhere else
export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
    vehicleType: '',
    licenseNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Extra check before sending: riders MUST provide vehicle info
    if (form.role === 'RIDER' && (!form.vehicleType || !form.licenseNumber)) {
      toast.error('Vehicle type and license number are required for riders')
      return
    }

    setLoading(true)
    try {
      const payload = { ...form }
      // Customers don't need vehicle fields
      if (form.role === 'CUSTOMER') {
        delete payload.vehicleType
        delete payload.licenseNumber
      }
      const { data } = await api.post('/auth/register', payload)
      login(data.user, data.token)
      toast.success('Account created!')
      navigate(form.role === 'RIDER' ? '/rider' : '/customer', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Marketing hero: real courier photo + value props */}
      <aside className="auth-hero">
        <PhotoFrame
          className="auth-hero-photo"
          src={HERO_PHOTOS.register}
          alt="Fleet of delivery couriers on scooters"
          caption="Join hundreds of riders on the road"
        />
        <div>
          <h2 className="auth-hero-title">Start delivering<br />in minutes.</h2>
          <p className="auth-hero-sub">
            Create a customer account to send packages, or join as a rider and earn on every trip.
          </p>
        </div>
        <ul className="auth-features">
          <li className="auth-feature">
            <span className="auth-feature-icon"><IconScooter size={18} /></span>
            Riders pick jobs and move through the lifecycle step by step
          </li>
          <li className="auth-feature">
            <span className="auth-feature-icon"><IconWarehouse size={18} /></span>
            Customers book pickups and watch status update live
          </li>
          <li className="auth-feature">
            <span className="auth-feature-icon"><IconParcel size={18} /></span>
            Admins dispatch, oversee payments and keep everyone safe
          </li>
        </ul>
      </aside>

      <div className="auth-card wide">
        <div className="auth-brand">
          <LogoMark size={48} />
          <div>
            <h1 className="auth-title">Create an account</h1>
            <p className="auth-sub">Join the platform in less than a minute</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label className="label" htmlFor="reg-first">First name</label>
              <input id="reg-first" name="firstName" className="input" value={form.firstName} onChange={handleChange} required autoComplete="given-name" />
            </div>
            <div className="field">
              <label className="label" htmlFor="reg-last">Last name</label>
              <input id="reg-last" name="lastName" className="input" value={form.lastName} onChange={handleChange} required autoComplete="family-name" />
            </div>
            <div className="field">
              <label className="label" htmlFor="reg-email">Email</label>
              <input id="reg-email" type="email" name="email" className="input" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" />
            </div>
            <div className="field">
              <label className="label" htmlFor="reg-phone">Phone</label>
              <input id="reg-phone" name="phone" className="input" placeholder="08012345678" value={form.phone} onChange={handleChange} required autoComplete="tel" />
            </div>
            <div className="field">
              <label className="label" htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" name="password" className="input" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required minLength={6} autoComplete="new-password" />
            </div>

            {/* Role picker */}
            <div className="field">
              <label className="label" htmlFor="reg-role">I want to join as</label>
              <select id="reg-role" name="role" className="select" value={form.role} onChange={handleChange}>
                <option value="CUSTOMER">Customer (send deliveries)</option>
                <option value="RIDER">Rider (deliver packages)</option>
              </select>
            </div>
          </div>

          {/* Rider-only extra fields */}
          {form.role === 'RIDER' && (
            <div className="stack">
              <div className="form-grid">
                <div className="field">
                  <label className="label" htmlFor="reg-vehicle">Vehicle type</label>
                  <input id="reg-vehicle" name="vehicleType" className="input" placeholder="Bike, Motorbike..." value={form.vehicleType} onChange={handleChange} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="reg-license">License number</label>
                  <input id="reg-license" name="licenseNumber" className="input" placeholder="e.g. GH-12345" value={form.licenseNumber} onChange={handleChange} />
                </div>
              </div>
              {/* Real vehicle photo preview (falls back to line art if offline) */}
              <VehiclePhoto vehicleType={form.vehicleType} height={120} />
            </div>
          )}

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <><Loader2 size={16} className="spin" aria-hidden="true" /> Creating account...</>
            ) : (
              form.role === 'RIDER'
                ? <>Join as Rider <Bike size={16} aria-hidden="true" /></>
                : <>Create account <Users size={16} aria-hidden="true" /></>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
