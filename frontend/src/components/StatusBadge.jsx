// StatusBadge = turns plain text like "PENDING" into a colored pill.
// Colors map straight to the badge classes from components.css,
// so every badge in the app has the same shape, size and rhythm.
const deliveryColors = {
  PENDING: 'badge-neutral',
  CONFIRMED: 'badge-info',
  ASSIGNED: 'badge-primary',
  PICKED_UP: 'badge-warning',
  IN_TRANSIT: 'badge-accent',
  DELIVERED: 'badge-success',
  CANCELLED: 'badge-danger',
}

const paymentColors = {
  PENDING: 'badge-neutral',
  SUCCESSFUL: 'badge-success',
  FAILED: 'badge-danger',
  REFUNDED: 'badge-warning',
}

const riderColors = {
  AVAILABLE: 'badge-success',
  BUSY: 'badge-warning',
  OFFLINE: 'badge-neutral',
}

const userColors = {
  ACTIVE: 'badge-success',
  INACTIVE: 'badge-neutral',
  SUSPENDED: 'badge-danger',
}

export default function StatusBadge({ value, type = 'delivery' }) {
  const map =
    type === 'payment' ? paymentColors
    : type === 'rider' ? riderColors
    : type === 'user' ? userColors
    : deliveryColors
  return <span className={`badge ${map[value] || 'badge-neutral'}`}>{value}</span>
}
