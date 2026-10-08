import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Phone, User, PackageCheck } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import { PageHeader, EmptyState, ErrorState } from '../../components/ui'

// AssignedDeliveries = jobs currently on this rider's plate.
// The rider moves each delivery forward through the lifecycle:
//   ASSIGNED -> PICKED_UP -> IN_TRANSIT -> DELIVERED
// The backend REJECTS illegal jumps (e.g. skipping IN_TRANSIT).
export default function AssignedDeliveries() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/riders/assigned-deliveries')
      setDeliveries(data.data || [])
    } catch {
      setError('We could not load your deliveries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/riders/deliveries/${id}/update-status`, { status })
      toast.success(`Moved to ${status}`)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed')
    }
  }

  // Which button to show depends on current status (legal next step)
  const nextAction = (status) => {
    if (status === 'ASSIGNED') return { label: 'Mark picked up', status: 'PICKED_UP', cls: 'btn-secondary' }
    if (status === 'PICKED_UP') return { label: 'Start transit', status: 'IN_TRANSIT', cls: 'btn-primary' }
    if (status === 'IN_TRANSIT') return { label: 'Mark delivered', status: 'DELIVERED', cls: 'btn-success' }
    return null
  }

  return (
    <div>
      <PageHeader
        title="My active deliveries"
        subtitle={loading ? '' : `${deliveries.length} in progress`}
      />

      {loading ? (
        <div className="grid grid-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="card card-body" key={i}>
              <div className="stack">
                <div className="skeleton skeleton-line" style={{ width: '40%' }} />
                <div className="skeleton skeleton-line" style={{ width: '85%' }} />
                <div className="skeleton skeleton-line" style={{ width: '65%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : deliveries.length === 0 ? (
        <EmptyState
          title="No active deliveries"
          hint="Browse the available jobs list and accept one to get started."
        />
      ) : (
        <div className="grid grid-3">
          {deliveries.map((d) => {
            const action = nextAction(d.deliveryStatus)
            return (
              <div className="card stretch" key={d.id}>
                <div className="card-body stack">
                  <div className="cluster between">
                    <span className="semibold">#{d.id}</span>
                    <StatusBadge value={d.deliveryStatus} />
                  </div>

                  <div className="text-sm">
                    <p className="mb-0"><span className="muted">From:</span> {d.pickupCity}</p>
                    <p className="mb-0"><span className="muted">To:</span> {d.dropoffCity}</p>
                    <p className="text-xs muted mb-0">{d.itemDescription}</p>
                  </div>

                  <div className="text-sm stack" style={{ gap: 'var(--space-1)' }}>
                    <span className="inline-icon muted">
                      <User size={13} aria-hidden="true" />
                      {d.customer?.user?.firstName} {d.customer?.user?.lastName}
                    </span>
                    <span className="inline-icon muted text-xs">
                      <Phone size={13} aria-hidden="true" />
                      {d.customer?.user?.phone}
                    </span>
                    {d.payment && <StatusBadge value={d.payment.paymentStatus} type="payment" />}
                  </div>

                  <div className="cluster between mt-auto">
                    <span className="price">${d.price}</span>
                    {action && (
                      <button
                        className={`btn btn-sm ${action.cls}`}
                        onClick={() => updateStatus(d.id, action.status)}
                      >
                        {action.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
