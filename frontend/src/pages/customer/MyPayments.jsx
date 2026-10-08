import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from '../../components/ui'
import { EmptyReceiptArt } from '../../graphics/Illustrations'

// MyPayments = payment history of this customer (from API).
export default function MyPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('api/customers/mypayments')
      setPayments(data.data || [])
    } catch {
      setError('We could not load your payments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <PageHeader
        title="My payments"
        subtitle={loading ? '' : `${payments.length} record${payments.length === 1 ? '' : 's'}`}
      />

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : payments.length === 0 ? (
        <EmptyState
          art={<EmptyReceiptArt size={130} />}
          title="No payments yet"
          hint="Payments you record on a delivery will appear here."
          action={
            <Link to="/customer/deliveries" className="btn btn-secondary btn-sm">
              <Receipt size={14} aria-hidden="true" /> Go to my deliveries
            </Link>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Delivery</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="cell-strong">{p.id}</td>
                  <td>
                    <Link to={`/customer/deliveries/${p.deliveryId}`}>#{p.deliveryId}</Link>
                  </td>
                  <td className="cell-strong">${p.amount}</td>
                  <td>{p.paymentMethod}</td>
                  <td><StatusBadge value={p.paymentStatus} type="payment" /></td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
