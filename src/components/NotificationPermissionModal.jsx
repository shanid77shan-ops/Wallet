/**
 * NotificationPermissionModal
 * Asks the user to allow push notifications on first open.
 * Works on Android Chrome and iOS Safari (PWA / standalone mode).
 */
import { Bell, X } from '@phosphor-icons/react'
import './NotificationPermissionModal.css'

export default function NotificationPermissionModal({
  onAllow,
  onDismiss,
  ios = false,
}) {
  return (
    <div className="notif-overlay" role="dialog" aria-modal="true">
      <div className="notif-modal">
        {/* Close */}
        <button className="notif-close" onClick={onDismiss} aria-label="Dismiss">
          <X size={18} weight="bold" />
        </button>

        {/* Icon */}
        <div className="notif-icon-wrap">
          <Bell size={30} weight="fill" />
        </div>

        {/* Copy */}
        <h2 className="notif-title">Stay in the loop</h2>
        <p className="notif-body">
          Get instant alerts for incoming transfers, price movements, and
          important wallet activity.
        </p>

        {/* iOS note — notifications only work when added to Home Screen */}
        {ios && (
          <p className="notif-ios-note">
            On iPhone, notifications require adding XDT Wallet to your Home
            Screen first (tap <strong>Share → Add to Home Screen</strong>).
          </p>
        )}

        {/* Actions */}
        <div className="notif-actions">
          <button className="notif-btn-allow" onClick={onAllow}>
            Allow notifications
          </button>
          <button className="notif-btn-skip" onClick={onDismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
