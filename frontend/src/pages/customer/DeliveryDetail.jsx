import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, MapPin, Package, Bike, CreditCard, XCircle } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import ConfirmDialog from '../../components/ConfirmDialog'
import { PageHeader, CardSkeleton, ErrorState } from '../../components/ui'
import { RouteMap } from '../../graphics/Illustrations'

// DeliveryDetail = one delivery in full:
//  - who the rider is
//  - where it's going
//  - status timeline
//  - pay for it (record payment)
//  - cancel it (only if still PENDING/CONFIRMED - backend enforces this)
export default function DeliveryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [delivery, setDelivery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [paymentForm, setPaymentForm] = useState({ paymentMethod: 'CASH', paymentStatus: 'SUCCESSFUL' })

  const load = async () => {
    try {
      const { data } = await api.get(`api/customers/deliveries/${id}`)
      setDelivery(data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delivery not found')
      navigate('/customer/deliveries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handlePay = async (e) => {
    e.preventDefault()
    setPaying(true)
    try {
      await api.post(`api/deliveries/${id}/payments`, paymentForm)
      toast.success('Payment recorded!')
      load() // reload so the new payment shows up
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  const handleCancel = async () => {
    setConfirmCancel(false)
    try {
      await api.put(`api/customers/deliveries/${id}/cancel`)
      toast.success('Delivery cancelled')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel')
    }
  }

  if (loading) {
    return (
      <div className="grid grid-sidebar">
        <CardSkeleton lines={7} />
        <CardSkeleton lines={4} />
      </div>
    )
  }
  if (!delivery) return null

  const canCancel = ['PENDING', 'CONFIRMED'].includes(delivery.deliveryStatus)
  const payment = delivery.payment

  // The lifecycle steps, in order - we light up to where we are
  const steps = ['PENDING', 'CONFIRMED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED']
  const currentIdx = steps.indexOf(delivery.deliveryStatus)
  const progress =
    delivery.deliveryStatus === 'CANCELLED'
      ? 0
      : Math.max(((currentIdx + 1) / steps.length) * 100, 8)

  return (
    <div>
      <PageHeader
        title={`Delivery #${delivery.id}`}
        subtitle={`${delivery.pickupCity} → ${delivery.dropoffCity}`}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/customer/deliveries')}>
            <ArrowLeft size={14} aria-hidden="true" /> Back to list
          </button>
        }
      />

      <div className="grid grid-sidebar">
        {/* Main info */}
        <div className="stack">
          <div className="card">
            <div className="card-header">
              <span className="cluster cluster-2">
                <Package size={16} aria-hidden="true" /> Overview
              </span>
              <StatusBadge value={delivery.deliveryStatus} />
            </div>

            {/* Stylized route map with the real pickup/drop-off cities */}
            <RouteMap
              pickup={delivery.pickupCity}
              dropoff={delivery.dropoffCity}
              active={['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(delivery.deliveryStatus)}
            />

            <div className="card-body stack">
              {/* Progress bar of the delivery lifecycle */}
              {delivery.deliveryStatus !== 'CANCELLED' && (
                <div>
                  <div className="steps">
                    {steps.map((s, i) => (
                      <span key={s} className={`step ${i <= currentIdx ? 'done' : ''}`}>
                        {s.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                  <div className="steps-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                    <div className="steps-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <div className="detail-grid">
                <div>
                  <p className="detail-label inline-icon"><MapPin size={13} aria-hidden="true" /> Pickup</p>
                  <p className="detail-value mb-0">{delivery.pickupAddress}</p>
                  <p className="text-sm muted">{delivery.pickupCity}</p>
                </div>
                <div>
                  <p className="detail-label inline-icon"><MapPin size={13} aria-hidden="true" /> Drop-off</p>
                  <p className="detail-value mb-0">{delivery.dropoffAddress}</p>
                  <p className="text-sm muted">{delivery.dropoffCity}</p>
                </div>
                <div>
                  <p className="detail-label inline-icon"><Package size={13} aria-hidden="true" /> Item</p>
                  <p className="detail-value mb-0">{delivery.itemDescription}</p>
                  {delivery.weight && <p className="text-sm muted">Weight: {delivery.weight}</p>}
                </div>
                <div>
                  <p className="detail-label">Price</p>
                  <p className="price mb-0">${delivery.price}</p>
                  {delivery.distanceKm && <p className="text-sm muted">{delivery.distanceKm} km</p>}
                </div>
                {delivery.instructions && (
                  <div className="span-all">
                    <p className="detail-label">Instructions</p>
                    <p className="detail-value muted">{delivery.instructions}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="detail-label inline-icon"><Bike size={13} aria-hidden="true" /> Rider</p>
                {delivery.rider ? (
                  <p className="detail-value mb-0">
                    {delivery.rider.user?.firstName} {delivery.rider.user?.lastName}{' '}
                    <span className="muted">({delivery.rider.user?.phone}) - {delivery.rider.vehicleType}</span>
                  </p>
                ) : (
                  <p className="detail-value muted mb-0">Waiting for a rider to be assigned...</p>
                )}
              </div>

              {canCancel && (
                <div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => setConfirmCancel(true)}>
                    <XCircle size={14} aria-hidden="true" /> Cancel delivery
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment panel */}
        <div className="card">
          <div className="card-header">
            <span className="cluster cluster-2">
              <CreditCard size={16} aria-hidden="true" /> Payment
            </span>
            {payment && <StatusBadge value={payment.paymentStatus} type="payment" />}
          </div>
          <div className="card-body">
            {payment ? (
              <div className="stack">
                <div>
                  <p className="detail-label">Amount</p>
                  <p className="price mb-0">${payment.amount}</p>
                </div>
                <div>
                  <p className="detail-label">Method</p>
                  <p className="detail-value mb-0">{payment.paymentMethod}</p>
                </div>
                {payment.transactionId && (
                  <p className="text-xs muted mb-0">Ref: {payment.transactionId}</p>
                )}
              </div>
            ) : (
              <form onSubmit={handlePay} className="stack">
                <div className="field">
                  <label className="label" htmlFor="pay-method">Payment method</label>
                  <select
                    id="pay-method"
                    className="select"
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="TRANSFER">Transfer</option>
                  </select>
                </div>
                <div className="field">
                  <label className="label" htmlFor="pay-status">Payment status</label>
                  <select
                    id="pay-status"
                    className="select"
                    value={paymentForm.paymentStatus}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentStatus: e.target.value })}
                  >
                    <option value="SUCCESSFUL">Successful</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <button className="btn btn-success btn-block" disabled={paying}>
                  {paying ? 'Processing...' : `Pay $${delivery.price}`}
                </button>
                <p className="text-xs muted mb-0 text-center">
                  Simulated payment (no real gateway needed)
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Styled replacement for window.confirm() */}
      <ConfirmDialog
        open={confirmCancel}
        danger
        title="Cancel this delivery?"
        message="The delivery will be cancelled and cannot be resumed. This action is final."
        confirmLabel="Yes, cancel it"
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  )
}
