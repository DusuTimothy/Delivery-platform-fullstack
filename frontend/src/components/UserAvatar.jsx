import { useState } from 'react'
import { userPhoto } from '../graphics/photos'

// UserAvatar = a REAL photo of the user.
// - The photo is picked deterministically from their email, so it never flips
//   between visits. seed = anything stable (email works best).
// - If the photo fails to load (offline...), we fall back to an initials
//   circle so there is never a broken-image icon on screen.
export default function UserAvatar({ user, seed, size = 32, className = '' }) {
  const [failed, setFailed] = useState(false)

  const stableSeed = seed || user?.email || `${user?.firstName || ''}${user?.lastName || ''}`
  const initials =
    `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() ||
    String(stableSeed || '?')[0].toUpperCase()

  if (failed) {
    return (
      <span
        className={`avatar ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        aria-hidden="true"
      >
        {initials}
      </span>
    )
  }

  return (
    <img
      className={`user-photo ${className}`}
      src={userPhoto(stableSeed)}
      width={size}
      height={size}
      alt={user ? `${user.firstName} ${user.lastName}` : 'User photo'}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
