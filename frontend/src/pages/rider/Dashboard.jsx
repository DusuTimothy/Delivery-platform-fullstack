import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Inbox, PackageCheck, Trophy, ArrowRight, Bike } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import { PageHeader, StatsSkeleton, ErrorState } from '../../components/ui'
import { BarChart } from '../../graphics/Charts'
import { VehiclePhoto } from '../../graphics/Illustrations'

// Rider Dashboard:
//  - shows their availability switch (AVAILABLE / BUSY / OFFLINE)
//  - counts of available jobs + assigned deliveries
// Availability matters: rider can only ACCEPT jobs when AVAILABLE.
export default function RiderDashboard() {
  const [profile, setProfile] = useState(null)
  const [counts, setCounts] = useState({ available: 0, assigned: 0, history: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [prof, jobs, mine, hist] = await Promise.all([
        api.get('/riders/profile'),
        api.get('/riders/available-jobs'),
        api.get('/riders/assigned-deliveries'),
        api.get('/riders/history'),
      ])
      setProfile(prof.data.data)
      setCounts({
        available: jobs.data.results || 0,
        assigned: mine.data.results || 0,
        history: hist.data.results || 0,
      })
    } catch {
      setError('We could not load your rider dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const setAvailability = async (availability) => {
    try {
      await api.put('/riders/availability', { availability })
      toast.success(`Now ${availability}`)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update')
    }
  }

  if (loading) {
    return (
      <div className="stack">
        <PageHeader title="Rider dashboard" />
        <StatsSkeleton count={3} />
      </div>
    )
  }

  if (error) return <ErrorState hint={error} onRetry={load} />

  const cards = [
    { label: 'Available jobs', value: counts.available, tone: 'stat--info', Icon: Inbox, to: '/rider/jobs' },
    { label: 'My active deliveries', value: counts.assigned, tone: '', Icon: PackageCheck, to: '/rider/assigned' },
    { label: 'Completed', value: counts.history, tone: 'stat--success', Icon: Trophy, to: '/rider/history' },
  ]

  return (
    <div>
      <PageHeader
        title="Rider dashboard"
        subtitle="Go online to start receiving jobs"
        actions={profile && <StatusBadge value={profile.availability} type="rider" />}
      />

      {/* Availability switch: segmented buttons, current one highlighted */}
      <div className="card mb-6">
        <div className="card-header">My availability</div>
        <div className="card-body cluster">
          {['AVAILABLE', 'BUSY', 'OFFLINE'].map((a) => (
            <button
              key={a}
              className={`btn btn-sm ${profile?.availability === a ? 'btn-success' : 'btn-secondary'}`}
              onClick={() => setAvailability(a)}
              aria-pressed={profile?.availability === a}
            >
              {a}
            </button>
          ))}
          <span className="text-sm muted">Go ONLINE (AVAILABLE) to receive jobs</span>
        </div>
      </div>

      <div className="grid grid-3 mb-6">
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
        {/* Chart: workload at a glance */}
        <div className="card">
          <div className="card-header">My workload</div>
          <div className="card-body">
            <BarChart
              data={[
                { label: 'Available jobs', value: counts.available, color: 'var(--info)' },
                { label: 'Active deliveries', value: counts.assigned, color: 'var(--primary)' },
                { label: 'Completed', value: counts.history, color: 'var(--success)' },
              ]}
            />
          </div>
        </div>

        {/* Real vehicle photo with line-art fallback */}
        <div className="card">
          <div className="card-header">
            <span className="cluster cluster-2">
              <Bike size={16} aria-hidden="true" /> My vehicle
            </span>
          </div>
          <div className="card-body stack">
            <VehiclePhoto vehicleType={profile?.vehicleType} height={130} />
            <p className="text-sm mb-0">
              <span className="semibold">{profile?.vehicleType || 'Motorbike'}</span>
              <span className="muted"> · License {profile?.licenseNumber || '—'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="cluster">
        <Link to="/rider/jobs" className="btn btn-primary">
          <Inbox size={15} aria-hidden="true" /> Browse jobs
        </Link>
        <Link to="/rider/assigned" className="btn btn-secondary">
          <PackageCheck size={15} aria-hidden="true" /> My deliveries
        </Link>
        <Link to="/rider/history" className="btn btn-secondary">
          History <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
