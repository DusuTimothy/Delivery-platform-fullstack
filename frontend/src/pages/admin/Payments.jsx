import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { RotateCcw } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import ConfirmDialog from '../../components/ConfirmDialog'
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from '../../components/ui'
import { EmptyReceiptArt } from '../../graphics/Illustrations'

// Admin Payments = all payments + admin can mark REFUNDED
// (e.g. delivery was cancelled after payment).
export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refundTarget, setRefundTarget] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/admin/payments')
      setPayments(data.data || [])
    } catch {
      setError('We could not load payments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const refund = async (payment) => {
    setRefundTarget(null)
    try {
      await api.post(`/deliveries/${payment.deliveryId}/payments`, {
        paymentMethod: payment.paymentMethod,
        paymentStatus: 'REFUNDED',
      })
      toast.success('Payment refunded')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Refund failed')
    }
  }

  const totalPaid = payments
    .filter((p) => p.paymentStatus === 'SUCCESSFUL')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle={loading ? '' : `${payments.length} record${payments.length === 1 ? '' : 's'} · $${totalPaid.toFixed(2)} collected`}
      />

      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : error ? (
        <ErrorState hint={error} onRetry={load} />
      ) : payments.length === 0 ? (
        <EmptyState
          art={<EmptyReceiptArt size={130} />}
          title="No payments yet"
          hint="Payments recorded by customers will appear here."
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
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="cell-strong">{p.id}</td>
                  <td>#{p.deliveryId}</td>
                  <td className="cell-strong">${p.amount}</td>
                  <td>{p.paymentMethod}</td>
                  <td><StatusBadge value={p.paymentStatus} type="payment" /></td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="text-end">
                    {p.paymentStatus === 'SUCCESSFUL' && (
                      <button className="btn btn-outline-danger btn-sm" onClick={() => setRefundTarget(p)}>
                        <RotateCcw size={13} aria-hidden="true" /> Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!refundTarget}
        danger
        title="Refund this payment?"
        message={`Payment #${refundTarget?.id} ($${refundTarget?.amount}) will be marked as REFUNDED for delivery #${refundTarget?.deliveryId}.`}
        confirmLabel="Yes, refund"
        onConfirm={() => refund(refundTarget)}
        onCancel={() => setRefundTarget(null)}
      />
    </div>
  )
}
