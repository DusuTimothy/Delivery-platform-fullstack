import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Package, Activity, CheckCircle2, XCircle } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import { PageHeader, StatsSkeleton, TableSkeleton, EmptyState, ErrorState } from '../../components/ui'
import { DonutChart } from '../../graphics/Charts'

// Customer Dashboard shows a quick summary:
// how many deliveries, how many active, how many delivered
// Data comes from the API - NOT hardcoded (requirement 11).
export default function CustomerDashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, delivered: 0, cancelled: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('api/customers/deliveries')
      const list = data.data || []
      setStats({
        total: list.length,
        active: list.filter((d) => !['DELIVERED', 'CANCELLED'].includes(d.deliveryStatus)).length,
        delivered: list.filter((d) => d.deliveryStatus === 'DELIVERED').length,
        cancelled: list.filter((d) => d.deliveryStatus === 'CANCELLED').length,
      })
      setRecent(list.slice(0, 5))
    } catch {
      setError('We could not load your deliveries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const cards = [
    { label: 'Total deliveries', value: stats.total, tone: '', Icon: Package },
    { label: 'Active now', value: stats.active, tone: 'stat--info', Icon: Activity },
    { label: 'Delivered', value: stats.delivered, tone: 'stat--success', Icon: CheckCircle2 },
    { label: 'Cancelled', value: stats.cancelled, tone: 'stat--danger', Icon: XCircle },
  ]

  return (
    <div>
      <PageHeader
        title="My Dashboard"
        subtitle="A quick look at your deliveries"
        actions={
          <Link to="/customer/new-delivery" className="btn btn-primary">
            <Plus size={16} aria-hidden="true" /> New delivery
          </Link>
        }
      />

      {loading ? (
        <div className="stack">
          <StatsSkeleton count={4} />
          <TableSkeleton rows={4} cols={5} />
        </div>
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : (
        <>
          <div className="grid grid-4 mb-6">
            {cards.map(({ label, value, tone, Icon }) => (
              <div className={`card stat ${tone}`} key={label}>
                <span className="stat-icon" aria-hidden="true"><Icon size={20} /></span>
                <div>
                  <div className="stat-label">{label}</div>
                  <div className="stat-value">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-sidebar mb-6">
            {/* Chart: status mix of this customer's deliveries */}
            <div className="card">
              <div className="card-header">Delivery mix</div>
              <div className="card-body">
                <DonutChart
                  centerValue={stats.total}
                  centerLabel="deliveries"
                  data={[
                    { label: 'Active', value: stats.active, color: 'var(--primary)' },
                    { label: 'Delivered', value: stats.delivered, color: 'var(--success)' },
                    { label: 'Cancelled', value: stats.cancelled, color: 'var(--danger)' },
                  ]}
                />
              </div>
            </div>

            {/* Quick actions */}
            <div className="card">
              <div className="card-header">Quick actions</div>
              <div className="card-body stack">
                <Link to="/customer/new-delivery" className="btn btn-primary btn-block">
                  <Plus size={16} aria-hidden="true" /> New delivery
                </Link>
                <Link to="/customer/deliveries" className="btn btn-secondary btn-block">
                  Track my deliveries
                </Link>
                <Link to="/customer/payments" className="btn btn-secondary btn-block">
                  Payment history
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span>Recent deliveries</span>
              <Link to="/customer/deliveries" className="text-sm">View all</Link>
            </div>
            {recent.length === 0 ? (
              <EmptyState
                title="No deliveries yet"
                hint="Create your first delivery and it will show up here."
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
                      <th>From</th>
                      <th>To</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((d) => (
                      <tr
                        key={d.id}
                        data-clickable="true"
                        onClick={() => navigate(`/customer/deliveries/${d.id}`)}
                      >
                        <td className="cell-strong">{d.id}</td>
                        <td>{d.pickupCity}</td>
                        <td>{d.dropoffCity}</td>
                        <td className="cell-strong">${d.price}</td>
                        <td><StatusBadge value={d.deliveryStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
