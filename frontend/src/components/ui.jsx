import { RefreshCw } from 'lucide-react'
import { EmptyBoxArt, WarningArt } from '../graphics/Illustrations'

// Shared "furniture" used by many pages:
// PageHeader, EmptyState, ErrorState and Skeleton loaders.
// Having them in ONE file keeps every page looking identical.

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  )
}

// Shown when a list has nothing in it yet - never a blank screen.
// `art` lets a page pass its own illustration (receipt, map, ...).
export function EmptyState({ title, hint, action, art }) {
  return (
    <div className="empty-state">
      {art || <EmptyBoxArt size={130} />}
      <p className="empty-title">{title}</p>
      {hint && <p className="empty-hint">{hint}</p>}
      {action}
    </div>
  )
}

// Shown when loading failed - offers a Retry button (better than a toast alone)
export function ErrorState({ title = 'Something went wrong', hint, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <WarningArt size={110} />
      <p className="error-title">{title}</p>
      {hint && <p className="error-hint">{hint}</p>}
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
          <RefreshCw size={14} aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  )
}

// Loading placeholders. Using skeletons (instead of "Loading...")
// makes the page feel faster because the layout appears immediately.
export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card stat" key={i}>
          <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-line" style={{ width: '50%', marginBottom: 8 }} />
            <div className="skeleton skeleton-line-lg" style={{ width: '35%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="table-wrap" aria-hidden="true">
      <table className="table">
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((__, c) => (
                <td key={c}>
                  <div className="skeleton skeleton-line" style={{ width: c === 0 ? '40%' : '75%' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CardSkeleton({ lines = 4 }) {
  return (
    <div className="card card-body" aria-hidden="true">
      <div className="stack">
        {Array.from({ length: lines }).map((_, i) => (
          <div className="skeleton skeleton-line" key={i} style={{ width: `${100 - i * 12}%` }} />
        ))}
      </div>
    </div>
  )
}
