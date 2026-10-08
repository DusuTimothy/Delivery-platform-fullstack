import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import UserAvatar from '../../components/UserAvatar'
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from '../../components/ui'

// Admin Users = manage every account.
// Admin can set account status: ACTIVE / INACTIVE / SUSPENDED.
// A SUSPENDED user cannot log in (backend blocks them) - requirement 7.
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('api/admin/users')
      setUsers(data.data || [])
    } catch {
      setError('We could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const changeStatus = async (id, accountStatus) => {
    try {
      await api.put(`api/admin/users/${id}/status`, { accountStatus })
      toast.success(`User is now ${accountStatus}`)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  const shown = filter === 'ALL' ? users : users.filter((u) => u.role === filter)

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={loading ? '' : `${shown.length} shown`}
        actions={
          <select className="select select-auto" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by role">
            <option value="ALL">All roles</option>
            <option value="CUSTOMER">Customers</option>
            <option value="RIDER">Riders</option>
            <option value="ADMIN">Admins</option>
          </select>
        }
      />

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : shown.length === 0 ? (
        <EmptyState title="No users match this filter" hint="Try a different role filter." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Change status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id}>
                  <td className="cell-strong">{u.id}</td>
                  <td>
                    <span className="cluster cluster-2">
                      <UserAvatar user={u} size={28} />
                      <span className="cell-strong">{u.firstName} {u.lastName}</span>
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-neutral">{u.role}</span></td>
                  <td><StatusBadge value={u.accountStatus} type="user" /></td>
                  <td>
                    <select
                      className="select select-auto"
                      value={u.accountStatus}
                      onChange={(e) => changeStatus(u.id, e.target.value)}
                      aria-label={`Change status for ${u.firstName}`}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
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
