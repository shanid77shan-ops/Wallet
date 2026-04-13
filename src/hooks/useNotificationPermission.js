/**
 * useNotificationPermission
 * Manages Web Push / Notification API permission state.
 * - Shows the modal once per install (tracked in localStorage).
 * - Detects iOS (requires PWA / Add to Home Screen) vs Android/desktop.
 */
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'xdt_notif_asked'

function isIOS() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function isInStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export function useNotificationPermission() {
  const supported = typeof Notification !== 'undefined'
  const [permission, setPermission] = useState(
    supported ? Notification.permission : 'unsupported'
  )
  const [showModal, setShowModal] = useState(false)
  const ios = isIOS()

  useEffect(() => {
    if (!supported) return
    // Already granted or explicitly denied — nothing to show
    if (Notification.permission !== 'default') return
    // Already asked this session / install
    if (localStorage.getItem(STORAGE_KEY)) return
    // On iOS, only possible inside a PWA (standalone)
    if (ios && !isInStandaloneMode()) return

    // Small delay so it doesn't fire before the page paints
    const t = setTimeout(() => setShowModal(true), 1200)
    return () => clearTimeout(t)
  }, [supported, ios])

  async function requestPermission() {
    localStorage.setItem(STORAGE_KEY, '1')
    setShowModal(false)
    if (!supported) return
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
    } catch {
      // Some browsers throw if not triggered by a user gesture — safe to ignore
    }
  }

  function dismissModal() {
    localStorage.setItem(STORAGE_KEY, '1')
    setShowModal(false)
  }

  return { permission, showModal, requestPermission, dismissModal, ios }
}
