import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from '../../components/ui'

// MyDeliveries = full list of the customer's deliveries (from API).
export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('api/customers/deliveries')
      setDeliveries(data.data || [])
    } catch {
      setError('We could not load your deliveries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <PageHeader
        title="My deliveries"
        subtitle={loading ? '' : `${deliveries.length} total`}
        actions={
          <Link to="/customer/new-delivery" className="btn btn-primary">
            <Plus size={16} aria-hidden="true" /> New delivery
          </Link>
        }
      />

      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : deliveries.length === 0 ? (
        <EmptyState
          title="You have no deliveries yet"
          hint="Create your first delivery and track it from pickup to drop-off."
          action={
            <Link to="/customer/new-delivery" className="btn btn-primary btn-sm">
              <Plus size={14} aria-hidden="true" /> New delivery
            </Link>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Pickup</th>
                <th>Drop-off</th>
                <th>Price</th>
                <th>Rider</th>
                <th>Status</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d.id}>
                  <td className="cell-strong">{d.id}</td>
                  <td>{d.pickupCity}</td>
                  <td>{d.dropoffCity}</td>
                  <td className="cell-strong">${d.price}</td>
                  <td>
                    {d.rider
                      ? `${d.rider.user?.firstName || ''} ${d.rider.user?.lastName || ''}`
                      : <span className="muted">Not assigned</span>}
                  </td>
                  <td><StatusBadge value={d.deliveryStatus} /></td>
                  <td className="text-end">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/customer/deliveries/${d.id}`)}
                    >
                      <Eye size={14} aria-hidden="true" /> View
                    </button>
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
