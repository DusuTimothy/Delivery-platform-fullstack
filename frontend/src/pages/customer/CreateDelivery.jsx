import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PackagePlus, MapPin, Loader2, Send } from 'lucide-react'
import api from '../../api/axios'
import { PageHeader } from '../../components/ui'

// CreateDelivery = the form to request a new delivery.
// On submit -> POST /api/customers/deliveries -> saved in PostgreSQL.
// Backend validates the data, sets status = PENDING, then it flows
// through the lifecycle (PENDING -> CONFIRMED -> ASSIGNED -> ...).
export default function CreateDelivery() {
  const [form, setForm] = useState({
    pickupAddress: '',
    pickupCity: '',
    dropoffAddress: '',
    dropoffCity: '',
    itemDescription: '',
    weight: '',
    distanceKm: '',
    price: '',
    instructions: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side check (backend checks again - never trust only the frontend!)
    if (Number(form.price) <= 0) {
      toast.error('Price must be greater than 0')
      return
    }

    setLoading(true)
    try {
      const payload = { ...form }
      payload.price = Number(form.price)
      payload.distanceKm = form.distanceKm ? Number(form.distanceKm) : null
      await api.post('api/customers/deliveries', payload)
      toast.success('Delivery request created!')
      navigate('/customer/deliveries')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create delivery')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-narrow">
      <PageHeader
        title="Request a new delivery"
        subtitle="Tell us where the package goes - we handle the rest"
      />

      <div className="card">
        <div className="card-header">
          <span className="cluster cluster-2">
            <PackagePlus size={16} aria-hidden="true" /> Delivery details
          </span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="stack">
            {/* Pickup + drop-off */}
            <div className="stack">
              <p className="detail-label inline-icon mb-0">
                <MapPin size={14} aria-hidden="true" /> Route
              </p>
              <div className="form-grid">
                <div className="field">
                  <label className="label" htmlFor="cd-pickup-addr">Pickup address</label>
                  <input id="cd-pickup-addr" name="pickupAddress" className="input" placeholder="12 Main Street" value={form.pickupAddress} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label className="label" htmlFor="cd-pickup-city">Pickup city</label>
                  <input id="cd-pickup-city" name="pickupCity" className="input" placeholder="Accra" value={form.pickupCity} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label className="label" htmlFor="cd-drop-addr">Drop-off address</label>
                  <input id="cd-drop-addr" name="dropoffAddress" className="input" placeholder="45 Ring Road" value={form.dropoffAddress} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label className="label" htmlFor="cd-drop-city">Drop-off city</label>
                  <input id="cd-drop-city" name="dropoffCity" className="input" placeholder="Kumasi" value={form.dropoffCity} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* The item */}
            <div className="field">
              <label className="label" htmlFor="cd-item">Item description</label>
              <textarea id="cd-item" name="itemDescription" className="textarea" rows={3} placeholder="What are we delivering?" value={form.itemDescription} onChange={handleChange} required />
            </div>

            {/* Numbers */}
            <div className="form-grid-3">
              <div className="field">
                <label className="label" htmlFor="cd-weight">Weight</label>
                <input id="cd-weight" name="weight" className="input" placeholder="e.g. 2kg" value={form.weight} onChange={handleChange} />
              </div>
              <div className="field">
                <label className="label" htmlFor="cd-distance">Distance (km)</label>
                <input id="cd-distance" name="distanceKm" type="number" step="0.1" className="input" placeholder="Optional" value={form.distanceKm} onChange={handleChange} />
              </div>
              <div className="field">
                <label className="label" htmlFor="cd-price">Price ($)</label>
                <input id="cd-price" name="price" type="number" step="0.01" className="input" placeholder="40.00" value={form.price} onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="cd-instructions">Special instructions</label>
              <textarea id="cd-instructions" name="instructions" className="textarea" rows={2} placeholder="Anything the rider should know?" value={form.instructions} onChange={handleChange} />
            </div>

            <div className="cluster">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <><Loader2 size={16} className="spin" aria-hidden="true" /> Creating...</>
                ) : (
                  <>Create delivery request <Send size={15} aria-hidden="true" /></>
                )}
              </button>
              <span className="text-xs muted">The backend re-checks every value before saving.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
