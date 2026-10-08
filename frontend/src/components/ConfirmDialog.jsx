import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

// ConfirmDialog = a styled replacement for window.confirm().
// It matches the app's design, traps attention with an overlay,
// closes on Escape, and returns focus to the page afterwards.
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null)

  // When the dialog opens: focus the confirm button so keyboard users land in it
  useEffect(() => {
    if (open) confirmRef.current?.focus()
  }, [open])

  // Escape closes the dialog (standard modal behavior)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onCancel} role="presentation">
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className={danger ? 'error-icon' : 'empty-icon'} aria-hidden="true">
            <AlertTriangle size={18} />
          </div>
          <h2 className="modal-title" id="confirm-title">{title}</h2>
        </div>
        <div className="modal-body">{message}</div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            <X size={14} aria-hidden="true" /> {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
