import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { User, KeyRound, Save, ShieldCheck, Mail } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { PageHeader } from '../components/ui'
import StatusBadge from '../components/StatusBadge'

// Profile page = shared by all 3 roles.
// Users can update their name/phone; password change needs old password
// (backend re-hashes the new one).
export default function Profile() {
  const { user, login, token } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' })
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' })
    }
  }, [user])

  const handleProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.put('/users/me', form)
      // refresh saved user so navbar shows new names
      login({ ...user, ...form }, token)
      toast.success(data.message || 'Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.put('/users/me/password', passwords)
      toast.success(data.message || 'Password updated')
      setPasswords({ oldPassword: '', newPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed')
    } finally {
      setLoading(false)
    }
  }

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account details and password" />

      <div className="grid grid-2">
        {/* Left: identity card + edit form */}
        <div className="stack">
          <div className="card">
            <div className="card-body cluster cluster-4">
              <span className="avatar avatar-lg" aria-hidden="true">
                {initials}
              </span>
              <div>
                <p className="semibold mb-0">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm muted mb-0 inline-icon">
                  <Mail size={14} aria-hidden="true" /> {user?.email}
                </p>
              </div>
              <div className="cluster cluster-2 ml-auto">
                <span className="role-chip">{user?.role}</span>
                <StatusBadge value="ACTIVE" type="user" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="cluster cluster-2">
                <User size={16} aria-hidden="true" /> Account details
              </span>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfile} className="stack">
                <div className="form-grid">
                  <div className="field">
                    <label className="label" htmlFor="pf-first">First name</label>
                    <input id="pf-first" className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="pf-last">Last name</label>
                    <input id="pf-last" className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor="pf-phone">Phone</label>
                  <input id="pf-phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <button className="btn btn-primary" disabled={loading}>
                    <Save size={15} aria-hidden="true" /> Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right: password change */}
        <div className="card">
          <div className="card-header">
            <span className="cluster cluster-2">
              <KeyRound size={16} aria-hidden="true" /> Change password
            </span>
          </div>
          <div className="card-body">
            <form onSubmit={handlePassword} className="stack">
              <div className="field">
                <label className="label" htmlFor="pf-old">Current password</label>
                <input id="pf-old" type="password" className="input" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} required autoComplete="current-password" />
              </div>
              <div className="field">
                <label className="label" htmlFor="pf-new">New password</label>
                <input id="pf-new" type="password" className="input" placeholder="At least 6 characters" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={6} autoComplete="new-password" />
              </div>
              <p className="text-xs muted mb-0 inline-icon">
                <ShieldCheck size={14} aria-hidden="true" />
                Your password is re-hashed by the server before saving.
              </p>
              <div>
                <button className="btn btn-secondary" disabled={loading}>
                  Update password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
