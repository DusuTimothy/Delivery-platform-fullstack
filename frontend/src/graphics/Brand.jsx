// Brand graphics: the logo and the small set of BRANDED delivery icons.
// Brand icons are used for decoration (stats, empty states, hero bullets);
// day-to-day UI controls keep using the regular Lucide icon set.

// The logo mark: a parcel riding a scooter, drawn as one friendly glyph.
export function LogoMark({ size = 32 }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        {/* parcel box with tape */}
        <rect x="3" y="5" width="11" height="9" rx="1.5" fill="currentColor" opacity="0.95" />
        <path d="M8.5 5v9" stroke="var(--primary)" strokeWidth="1.6" />
        {/* scooter body + wheels */}
        <path
          d="M14 17.5h4.2a1.8 1.8 0 0 0 1.76-1.4l.9-4.1H14"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7.2" cy="18.2" r="2.2" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.6" cy="18.2" r="2.2" stroke="currentColor" strokeWidth="1.7" />
        {/* motion lines */}
        <path d="M1.5 8.5h3M1 11.5h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      </svg>
    </span>
  )
}

// Full logo = mark + wordmark
export function Logo({ size = 32 }) {
  return (
    <span className="brand">
      <LogoMark size={size} />
      Delivery Platform
    </span>
  )
}

/* --------------------------------------------------------------------------
   Branded delivery icons (24x24, stroke style matches the UI icon set)
   -------------------------------------------------------------------------- */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// Parcel with speed lines
export function IconParcel({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M12 6v12M6 10h3M15 10h3" />
      <path d="M2 9h2M1 13h2" opacity="0.6" />
    </svg>
  )
}

// Scooter courier
export function IconScooter({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M9 17h6" />
      <path d="M12 17V9a3 3 0 0 1 3-3h2" />
      <rect x="4" y="5" width="6" height="5" rx="1" />
    </svg>
  )
}

// Route between two pins
export function IconRoute({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M7 6h6a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h8" strokeDasharray="2.5 3" />
    </svg>
  )
}

// Warehouse / depot
export function IconWarehouse({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M3 10.5 12 5l9 5.5V20H3z" />
      <path d="M8 20v-6h8v6" />
      <path d="M8 17h8" />
    </svg>
  )
}

// Radar/dispatch hub (jobs, availability)
export function IconDispatch({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 5.5a6.5 6.5 0 0 1 6.5 6.5" />
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.55" />
      <path d="M12 8.5A3.5 3.5 0 0 0 8.5 12" />
    </svg>
  )
}
