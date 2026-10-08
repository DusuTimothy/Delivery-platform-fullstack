import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { PageHeader, StatsSkeleton, ErrorState } from '../../components/ui'
import { DonutChart, BarChart } from '../../graphics/Charts'
import { IconParcel, IconScooter, IconWarehouse, IconDispatch } from '../../graphics/Brand'

// Admin Dashboard = platform overview (live counts from the API)
// plus two charts so the numbers can be read at a glance.
export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('api/admin/dashboard')
      setStats(data.data)
    } catch {
      setError('We could not load the platform overview.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="stack">
        <PageHeader title="Platform overview" />
        <StatsSkeleton count={4} />
        <StatsSkeleton count={3} />
      </div>
    )
  }

  if (error || !stats) return <ErrorState hint={error} onRetry={load} />

  const cards = [
    { label: 'Total users', value: stats.totalUsers, tone: '', Icon: IconDispatch, to: '/admin/users' },
    { label: 'Customers', value: stats.totalCustomers, tone: 'stat--info', Icon: IconParcel, to: '/admin/users' },
    { label: 'Riders', value: stats.totalRiders, tone: 'stat--accent', Icon: IconScooter, to: '/admin/riders' },
    { label: 'Deliveries', value: stats.totalDeliveries, tone: 'stat--success', Icon: IconWarehouse, to: '/admin/deliveries' },
    { label: 'Pending', value: stats.pendingDeliveries, tone: 'stat--warning', Icon: IconDispatch, to: '/admin/deliveries' },
    { label: 'Delivered', value: stats.deliveredDeliveries, tone: 'stat--success', Icon: IconParcel, to: '/admin/deliveries' },
    { label: 'Paid (successful)', value: stats.successfulPayments, tone: 'stat--info', Icon: IconWarehouse, to: '/admin/payments' },
  ]

  const otherDeliveries = Math.max(
    stats.totalDeliveries - stats.pendingDeliveries - stats.deliveredDeliveries,
    0,
  )

  return (
    <div>
      <PageHeader title="Platform overview" subtitle="Live numbers from the API" />

      <div className="grid grid-4 mb-6">
        {cards.slice(0, 4).map(({ label, value, tone, Icon, to }) => (
          <Link to={to} key={label} className={`card stat interactive ${tone}`}>
            <span className="stat-icon" aria-hidden="true"><Icon size={20} /></span>
            <div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-sidebar mb-6">
        {/* Bar chart: platform totals side by side */}
        <div className="card">
          <div className="card-header">Platform totals</div>
          <div className="card-body">
            <BarChart
              data={[
                { label: 'Users', value: stats.totalUsers, color: 'var(--primary)' },
                { label: 'Customers', value: stats.totalCustomers, color: 'var(--info)' },
                { label: 'Riders', value: stats.totalRiders, color: 'var(--accent)' },
                { label: 'Deliveries', value: stats.totalDeliveries, color: 'var(--success)' },
                { label: 'Payments', value: stats.successfulPayments, color: 'var(--gray-500)' },
              ]}
            />
          </div>
        </div>

        {/* Donut: delivery status split */}
        <div className="card">
          <div className="card-header">Delivery status</div>
          <div className="card-body">
            <DonutChart
              size={150}
              thickness={20}
              centerValue={stats.totalDeliveries}
              centerLabel="total"
              data={[
                { label: 'Pending', value: stats.pendingDeliveries, color: 'var(--warning)' },
                { label: 'Delivered', value: stats.deliveredDeliveries, color: 'var(--success)' },
                { label: 'In progress / other', value: otherDeliveries, color: 'var(--primary)' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Secondary metrics row */}
      <div className="grid grid-3">
        {cards.slice(4).map(({ label, value, tone, Icon, to }) => (
          <Link to={to} key={label} className={`card stat interactive ${tone}`}>
            <span className="stat-icon" aria-hidden="true"><Icon size={20} /></span>
            <div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
