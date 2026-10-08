import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from '../../components/ui'

// Admin Deliveries = the control tower.
// Here an admin can manually ASSIGN a rider to a delivery
// (the rider must be AVAILABLE - backend enforces it).
export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([])
  const [riders, setRiders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [d, r] = await Promise.all([
        api.get('api/admin/deliveries'),
        api.get('api/admin/riders'),
      ])
      setDeliveries(d.data.data || [])
      setRiders(r.data.data || [])
    } catch {
      setError('We could not load deliveries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const assign = async (deliveryId, riderId) => {
    if (!riderId) return
    try {
      await api.put(`api/admin/deliveries/${deliveryId}/assign`, { riderId: Number(riderId) })
      toast.success('Rider assigned!')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed')
    }
  }

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']
  const shown = filter === 'ALL' ? deliveries : deliveries.filter((d) => d.deliveryStatus === filter)

  // Only AVAILABLE riders should appear as assignable
  const availableRiders = riders.filter((r) => r.availability === 'AVAILABLE')

  return (
    <div>
      <PageHeader
        title="Deliveries"
        subtitle={loading ? '' : `${shown.length} shown`}
        actions={
          <select className="select select-auto" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        }
      />

      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : shown.length === 0 ? (
        <EmptyState
          title="No deliveries with this status"
          hint="Pick a different status filter to see more."
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Route</th>
                <th>Price</th>
                <th>Rider</th>
                <th>Status</th>
                <th>Assign rider</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((d) => (
                <tr key={d.id}>
                  <td className="cell-strong">{d.id}</td>
                  <td>{d.customer?.user?.firstName} {d.customer?.user?.lastName}</td>
                  <td>{d.pickupCity} → {d.dropoffCity}</td>
                  <td className="cell-strong">${d.price}</td>
                  <td>
                    {d.rider
                      ? `${d.rider.user?.firstName || ''} ${d.rider.user?.lastName || ''}`
                      : <span className="muted">None</span>}
                  </td>
                  <td><StatusBadge value={d.deliveryStatus} /></td>
                  <td>
                    {/* Assignment only makes sense before a rider is set
                        and before the delivery is finished/cancelled */}
                    {!d.rider && !['DELIVERED', 'CANCELLED'].includes(d.deliveryStatus) ? (
                      <select
                        className="select select-auto"
                        defaultValue=""
                        onChange={(e) => assign(d.id, e.target.value)}
                        aria-label={`Assign rider to delivery ${d.id}`}
                      >
                        <option value="" disabled>Choose rider...</option>
                        {availableRiders.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.user?.firstName} {r.user?.lastName} ({r.vehicleType})
                          </option>
                        ))}
                        {availableRiders.length === 0 && (
                          <option disabled>No available riders</option>
                        )}
                      </select>
                    ) : (
                      <span className="muted text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
