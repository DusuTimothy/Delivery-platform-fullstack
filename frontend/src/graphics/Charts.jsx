/* ==========================================================================
   CHARTS - tiny hand-built SVG/CSS visualizations (no chart library).
   Colors are passed as CSS variables (tokens), so charts follow the theme.
   ========================================================================== */

// DonutChart = ring split into segments. Data: [{ label, value, color }]
// color is a CSS variable name, e.g. 'var(--success)'.
export function DonutChart({ data, size = 160, thickness = 22, centerLabel, centerValue }) {
  const total = data.reduce((sum, seg) => sum + seg.value, 0) || 1
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  let offset = 0
  const segments = data.map((seg) => {
    const fraction = seg.value / total
    const length = fraction * circumference
    const dash = `${length} ${circumference - length}`
    const dashOffset = -offset
    offset += length
    return { ...seg, dash, dashOffset }
  })

  const summary = data.map((s) => `${s.label}: ${s.value}`).join(', ')

  return (
    <div className="donut">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Donut chart. ${summary}`}
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            style={{ stroke: 'var(--gray-100)', strokeWidth: thickness }}
          />
          {/* segments */}
          {segments.map((seg) => (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeDasharray={seg.dash}
              strokeDashoffset={seg.dashOffset}
              style={{ stroke: seg.color, strokeWidth: thickness, transition: 'stroke-dasharray 400ms ease-out' }}
            />
          ))}
        </g>
        {/* center readout */}
        {centerValue != null && (
          <>
            <text
              x="50%" y="47%"
              textAnchor="middle"
              style={{ fill: 'var(--text)', fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-sans)' }}
            >
              {centerValue}
            </text>
            <text
              x="50%" y="62%"
              textAnchor="middle"
              style={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-sans)' }}
            >
              {centerLabel}
            </text>
          </>
        )}
      </svg>

      {/* legend: color dot + label + count */}
      <ul className="chart-legend">
        {data.map((seg) => (
          <li key={seg.label}>
            <span className="legend-dot" style={{ background: seg.color }} aria-hidden="true" />
            <span className="legend-label">{seg.label}</span>
            <span className="legend-value">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// BarChart = horizontal bars. Data: [{ label, value, color? }]
export function BarChart({ data, unit = '' }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="bar-chart" role="img" aria-label={`Bar chart. ${data.map((d) => `${d.label}: ${d.value}`).join(', ')}`}>
      {data.map((d) => (
        <div className="bar-row" key={d.label}>
          <span className="bar-label">{d.label}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${Math.max((d.value / max) * 100, 2)}%`,
                background: d.color || 'var(--primary)',
              }}
            />
          </div>
          <span className="bar-value">
            {d.value}{unit}
          </span>
        </div>
      ))}
    </div>
  )
}
