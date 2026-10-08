import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from '../../components/ui'
import { EmptyBoxArt } from '../../graphics/Illustrations'

// History = all DELIVERED jobs for this rider (proof of work).
export default function RiderHistory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('api/riders/history')
      setItems(data.data || [])
    } catch {
      setError('We could not load your history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const totalEarned = items.reduce((sum, d) => sum + Number(d.price || 0), 0)

  return (
    <div>
      <PageHeader
        title="Delivery history"
        subtitle={loading ? '' : `${items.length} completed · $${totalEarned.toFixed(2)} earned`}
      />

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState
          art={<EmptyBoxArt size={130} />}
          title="No completed deliveries yet"
          hint="Deliveries you mark as DELIVERED will appear here as your track record."
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>From</th>
                <th>To</th>
                <th>Price</th>
                <th>Delivered at</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id}>
                  <td className="cell-strong">{d.id}</td>
                  <td>{d.customer?.user?.firstName} {d.customer?.user?.lastName}</td>
                  <td>{d.pickupCity}</td>
                  <td>{d.dropoffCity}</td>
                  <td className="cell-strong">${d.price}</td>
                  <td>{d.deliveredAt ? new Date(d.deliveredAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
