import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Check } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import { PageHeader, EmptyState, ErrorState } from '../../components/ui'
import { EmptyRouteArt } from '../../graphics/Illustrations'

// AvailableJobs = unassigned deliveries any AVAILABLE rider can accept.
// Accepting = riderId set + status -> ASSIGNED + rider becomes BUSY.
export default function AvailableJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/riders/available-jobs')
      setJobs(data.data || [])
    } catch {
      setError('We could not load the job list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const accept = async (id) => {
    try {
      await api.put(`/riders/deliveries/${id}/accept`)
      toast.success('Delivery accepted!')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot accept this job')
    }
  }

  return (
    <div>
      <PageHeader
        title="Available jobs"
        subtitle={loading ? '' : `${jobs.length} open job${jobs.length === 1 ? '' : 's'}`}
      />

      {loading ? (
        <div className="grid grid-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="card card-body" key={i}>
              <div className="stack">
                <div className="skeleton skeleton-line" style={{ width: '40%' }} />
                <div className="skeleton skeleton-line" style={{ width: '90%' }} />
                <div className="skeleton skeleton-line" style={{ width: '75%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : jobs.length === 0 ? (
        <EmptyState
          art={<EmptyRouteArt size={130} />}
          title="No open jobs right now"
          hint="New deliveries will appear here as customers create them. Check back soon!"
        />
      ) : (
        <div className="grid grid-3">
          {jobs.map((job) => (
            <div className="card stretch" key={job.id}>
              <div className="card-body stack">
                <div className="cluster between">
                  <span className="semibold">#{job.id}</span>
                  <StatusBadge value={job.deliveryStatus} />
                </div>
                <div className="text-sm">
                  <p className="mb-0">
                    <span className="muted">From:</span> {job.pickupAddress}, {job.pickupCity}
                  </p>
                  <p className="mb-0">
                    <span className="muted">To:</span> {job.dropoffAddress}, {job.dropoffCity}
                  </p>
                </div>
                <p className="text-xs muted mb-0">{job.itemDescription}</p>
                <div className="cluster between mt-auto">
                  <span className="price">${job.price}</span>
                  <button className="btn btn-success btn-sm" onClick={() => accept(job.id)}>
                    <Check size={14} aria-hidden="true" /> Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
