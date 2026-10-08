import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import UserAvatar from '../../components/UserAvatar'
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from '../../components/ui'
import { VehiclePhoto } from '../../graphics/Illustrations'

// Admin Riders = see all riders + force their availability.
export default function AdminRiders() {
  const [riders, setRiders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('api/admin/riders')
      setRiders(data.data || [])
    } catch {
      setError('We could not load riders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const changeAvailability = async (id, availability) => {
    try {
      await api.put(`api/admin/riders/${id}/availability`, { availability })
      toast.success(`Rider set to ${availability}`)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Riders"
        subtitle={loading ? '' : `${riders.length} rider${riders.length === 1 ? '' : 's'}`}
      />

      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : riders.length === 0 ? (
        <EmptyState title="No riders yet" hint="Riders appear here as soon as they register." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>License</th>
                <th>Availability</th>
                <th>Set availability</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((r) => (
                <tr key={r.id}>
                  <td className="cell-strong">{r.id}</td>
                  <td>
                    <span className="cluster cluster-2">
                      <UserAvatar user={r.user} size={28} />
                      <span className="cell-strong">{r.user?.firstName} {r.user?.lastName}</span>
                    </span>
                  </td>
                  <td>{r.user?.phone}</td>
                  <td>
                    <span className="cluster cluster-2">
                      <VehiclePhoto vehicleType={r.vehicleType} height={36} thumb />
                      <span>{r.vehicleType}</span>
                    </span>
                  </td>
                  <td>{r.licenseNumber}</td>
                  <td><StatusBadge value={r.availability} type="rider" /></td>
                  <td>
                    <select
                      className="select select-auto"
                      value={r.availability}
                      onChange={(e) => changeAvailability(r.id, e.target.value)}
                      aria-label={`Set availability for ${r.user?.firstName}`}
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="BUSY">BUSY</option>
                      <option value="OFFLINE">OFFLINE</option>
                    </select>
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
