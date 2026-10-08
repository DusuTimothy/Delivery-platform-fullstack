/* ==========================================================================
   ILLUSTRATIONS - custom SVG artwork for empty states, errors and maps.
   Everything is drawn with CSS variables (colors adapt to dark mode
   automatically) and scales crisply at any size.
   ========================================================================== */
import { useState } from 'react'
import { VEHICLE_PHOTOS, vehiclePhotoKey } from './photos'

// Small "open box" scene for empty delivery lists
export function EmptyBoxArt({ size = 140 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      {/* soft background blob */}
      <circle cx="80" cy="80" r="66" style={{ fill: 'var(--primary-soft)' }} />
      {/* back flaps */}
      <path d="M42 70 80 52l38 18-38 14z" style={{ fill: 'var(--accent-soft)', stroke: 'var(--accent)', strokeWidth: 2, strokeLinejoin: 'round' }} />
      {/* box body */}
      <path d="M42 70v42l38 16V84z" style={{ fill: 'var(--surface)', stroke: 'var(--gray-400)', strokeWidth: 2, strokeLinejoin: 'round' }} />
      <path d="M118 70v42l-38 16V84z" style={{ fill: 'var(--surface-hover)', stroke: 'var(--gray-400)', strokeWidth: 2, strokeLinejoin: 'round' }} />
      {/* front flaps */}
      <path d="M42 70 60 44l24 16-20 12z" style={{ fill: 'var(--accent-soft)', stroke: 'var(--accent)', strokeWidth: 2, strokeLinejoin: 'round' }} />
      <path d="M118 70 100 44l-24 16 20 12z" style={{ fill: 'var(--accent-soft)', stroke: 'var(--accent)', strokeWidth: 2, strokeLinejoin: 'round' }} />
      {/* tape */}
      <path d="M80 84v44" style={{ stroke: 'var(--accent)', strokeWidth: 2 }} />
      {/* sparkles */}
      <path d="M124 34l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" style={{ fill: 'var(--primary)' }} />
      <circle cx="36" cy="38" r="4" style={{ fill: 'var(--primary)', opacity: 0.5 }} />
      <circle cx="132" cy="96" r="3" style={{ fill: 'var(--accent)', opacity: 0.7 }} />
    </svg>
  )
}

// Receipt + coin scene for empty payment lists
export function EmptyReceiptArt({ size = 140 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="80" r="66" style={{ fill: 'var(--success-soft)' }} />
      {/* receipt with zigzag bottom */}
      <path
        d="M52 34h56v96l-9-7-9 7-9-7-9 7-9-7-11 8z"
        style={{ fill: 'var(--surface)', stroke: 'var(--gray-400)', strokeWidth: 2, strokeLinejoin: 'round' }}
      />
      {/* lines of "text" */}
      <path d="M64 54h32M64 68h32M64 82h20" style={{ stroke: 'var(--gray-400)', strokeWidth: 4, strokeLinecap: 'round' }} />
      {/* coin */}
      <circle cx="112" cy="104" r="20" style={{ fill: 'var(--warning-soft)', stroke: 'var(--warning)', strokeWidth: 2 }} />
      <path d="M112 94v20M106 99h9a4 4 0 0 1 0 8h-6a4 4 0 0 0 0 8h9" style={{ stroke: 'var(--warning)', strokeWidth: 2.4, strokeLinecap: 'round' }} />
    </svg>
  )
}

// Map + pin scene for empty job lists
export function EmptyRouteArt({ size = 140 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="80" r="66" style={{ fill: 'var(--info-soft)' }} />
      {/* folded map */}
      <path d="M34 50 66 40l28 12 32-12v70l-32 12-28-12-32 10z"
        style={{ fill: 'var(--surface)', stroke: 'var(--gray-400)', strokeWidth: 2, strokeLinejoin: 'round' }} />
      <path d="M66 40v70M94 52v70" style={{ stroke: 'var(--gray-300)', strokeWidth: 2 }} />
      {/* dashed route across the map */}
      <path d="M46 96c14-6 20-26 38-24s20 22 34 14"
        style={{ stroke: 'var(--primary)', strokeWidth: 3, strokeLinecap: 'round', strokeDasharray: '6 7' }} />
      {/* pins */}
      <circle cx="46" cy="96" r="6" style={{ fill: 'var(--primary)' }} />
      <path d="M118 68c6.6 0 12 5.2 12 11.6C130 88 118 100 118 100s-12-12-12-20.4C106 73.2 111.4 68 118 68z"
        style={{ fill: 'var(--danger)' }} />
      <circle cx="118" cy="79.5" r="4.4" style={{ fill: 'var(--surface)' }} />
    </svg>
  )
}

// Broken-route warning scene for error states
export function WarningArt({ size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="80" r="66" style={{ fill: 'var(--danger-soft)' }} />
      {/* broken dashed path */}
      <path d="M36 112c16-4 22-30 44-34" style={{ stroke: 'var(--danger)', strokeWidth: 3.5, strokeLinecap: 'round', strokeDasharray: '7 8', opacity: 0.65 }} />
      <path d="M104 70c12 4 14 20 24 26" style={{ stroke: 'var(--danger)', strokeWidth: 3.5, strokeLinecap: 'round', strokeDasharray: '7 8', opacity: 0.65 }} />
      {/* warning triangle */}
      <path d="M80 34 126 114H34z" style={{ fill: 'var(--surface)', stroke: 'var(--danger)', strokeWidth: 3.5, strokeLinejoin: 'round' }} />
      <path d="M80 66v24" style={{ stroke: 'var(--danger)', strokeWidth: 6, strokeLinecap: 'round' }} />
      <circle cx="80" cy="102" r="4" style={{ fill: 'var(--danger)' }} />
    </svg>
  )
}

/* --------------------------------------------------------------------------
   ROUTE MAP - a stylized city map with an animated delivery route.
   Props: pickup / dropoff labels, status (animates when on the move).
   Purely decorative, but the labels are real data from the delivery.
   -------------------------------------------------------------------------- */
export function RouteMap({ pickup = 'Pickup', dropoff = 'Drop-off', active = false, height = 220 }) {
  return (
    <div className="route-map" style={{ height }}>
      <svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice" role="img"
        aria-label={`Route map from ${pickup} to ${dropoff}`}>
        {/* map base */}
        <rect width="640" height="240" style={{ fill: 'var(--surface-hover)' }} />
        {/* city blocks */}
        <g style={{ fill: 'var(--surface)', stroke: 'var(--border)', strokeWidth: 1.5 }}>
          <rect x="28" y="24" width="130" height="74" rx="8" />
          <rect x="182" y="24" width="168" height="74" rx="8" />
          <rect x="374" y="24" width="106" height="74" rx="8" />
          <rect x="504" y="24" width="108" height="74" rx="8" />
          <rect x="28" y="142" width="130" height="74" rx="8" />
          <rect x="182" y="142" width="168" height="74" rx="8" />
          <rect x="374" y="142" width="106" height="74" rx="8" />
          <rect x="504" y="142" width="108" height="74" rx="8" />
        </g>
        {/* roads between blocks */}
        <g style={{ stroke: 'var(--border-strong)', strokeWidth: 10, strokeLinecap: 'round' }}>
          <path d="M0 120h640" />
          <path d="M170 0v240M362 0v240M492 0v240" />
        </g>
        {/* the route itself */}
        <path
          className={`route-line ${active ? 'route-line--active' : ''}`}
          d="M80 186C140 186 150 120 210 120S300 60 362 60s90 60 150 60 60-40 60-40"
          style={{ stroke: 'var(--primary)', strokeWidth: 5, fill: 'none', strokeLinecap: 'round' }}
        />
        {/* pickup pin */}
        <g>
          <circle cx="80" cy="186" r="11" style={{ fill: 'var(--surface)', stroke: 'var(--primary)', strokeWidth: 5 }} />
        </g>
        {/* drop-off pin */}
        <g transform="translate(560 62)">
          <path d="M0-24c8.8 0 16 6.9 16 15.4C16 0 0 20 0 20s-16-20-16-28.6C-16-17.1-8.8-24 0-24z"
            style={{ fill: 'var(--danger)' }} />
          <circle cy="-9" r="5.6" style={{ fill: 'var(--surface)' }} />
        </g>
        {/* tiny parcel truck sitting on the route */}
        <g transform="translate(300 96)">
          <rect x="-18" y="-12" width="26" height="16" rx="3" style={{ fill: 'var(--primary)' }} />
          <path d="M8-6h7l5 6v4H8z" style={{ fill: 'var(--primary-hover)' }} />
          <circle cx="-8" cy="6" r="4.5" style={{ fill: 'var(--gray-700)' }} />
          <circle cx="14" cy="6" r="4.5" style={{ fill: 'var(--gray-700)' }} />
        </g>
        {/* labels */}
        <text x="80" y="216" textAnchor="middle" style={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
          {pickup}
        </text>
        <text x="560" y="34" textAnchor="middle" style={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
          {dropoff}
        </text>
      </svg>
    </div>
  )
}

/* --------------------------------------------------------------------------
   PHOTO FRAME - a real photo with a graceful fallback.
   If the image cannot load (offline, blocked CDN...) we swap in a branded
   gradient panel instead of ever showing a broken-image icon.
   -------------------------------------------------------------------------- */
export function PhotoFrame({ src, alt, caption, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`photo-frame photo-fallback ${className}`} role="img" aria-label={alt}>
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="400" height="200" style={{ fill: 'var(--primary-soft)' }} />
          <circle cx="70" cy="60" r="90" style={{ fill: 'var(--accent-soft)' }} />
          <circle cx="340" cy="170" r="110" style={{ fill: 'var(--surface)', opacity: 0.6 }} />
          <path
            d="M0 150c60-30 100 10 160-20s110-50 240-20"
            style={{ stroke: 'var(--primary)', strokeWidth: 5, fill: 'none', strokeDasharray: '12 14', strokeLinecap: 'round' }}
          />
        </svg>
        {caption && <span className="photo-caption">{caption}</span>}
      </div>
    )
  }

  return (
    <div className={`photo-frame ${className}`}>
      <img src={src} alt={alt} onError={() => setFailed(true)} />
      {caption && <span className="photo-caption">{caption}</span>}
    </div>
  )
}

/* --------------------------------------------------------------------------
   VEHICLE PHOTO with an illustrated fallback.
   Shows a real photo; if it fails to load we draw the vehicle instead,
   so a broken image never appears.
   -------------------------------------------------------------------------- */
export function VehiclePhoto({ photoUrl, vehicleType = '', height = 140, thumb = false }) {
  const [failed, setFailed] = useState(false)
  const key = vehiclePhotoKey(vehicleType)
  const src = photoUrl || VEHICLE_PHOTOS[key]

  if (failed) {
    return (
      <div
        className={`vehicle-photo vehicle-photo--fallback${thumb ? ' vehicle-photo--thumb' : ''}`}
        style={{ height }}
        aria-hidden="true"
      >
        <VehicleGlyph type={key} size={thumb ? 34 : 72} />
      </div>
    )
  }

  return (
    <img
      className={`vehicle-photo${thumb ? ' vehicle-photo--thumb' : ''}`}
      src={src}
      style={{ height }}
      alt={`${vehicleType || 'Delivery'} vehicle`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

// Simple line-art vehicle used if the photo cannot load
export function VehicleGlyph({ type = 'MOTORBIKE', size = 72 }) {
  const common = {
    width: size,
    height: size * 0.66,
    viewBox: '0 0 120 80',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  if (type === 'BIKE') {
    return (
      <svg {...common}>
        <circle cx="26" cy="56" r="16" />
        <circle cx="94" cy="56" r="16" />
        <path d="M26 56 50 28h22l16 28M50 28l12 28H26M72 28l8-12h10" />
        <rect x="66" y="34" width="22" height="16" rx="3" />
      </svg>
    )
  }
  if (type === 'VAN') {
    return (
      <svg {...common}>
        <path d="M10 54V26h62v28M72 34h20l14 14v6" />
        <circle cx="34" cy="58" r="10" />
        <circle cx="92" cy="58" r="10" />
        <path d="M10 54h14M44 54h38M102 54h6" />
        <path d="M74 38h14l8 10H74z" />
      </svg>
    )
  }
  // MOTORBIKE (default)
  return (
    <svg {...common}>
      <circle cx="24" cy="56" r="14" />
      <circle cx="96" cy="56" r="14" />
      <path d="M24 56h22l16-22h18l10 22M62 34l-8-12h-12" />
      <rect x="66" y="20" width="26" height="18" rx="3" />
      <path d="M46 56h36" />
    </svg>
  )
}
