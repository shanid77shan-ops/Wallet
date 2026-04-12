import { useRef, useEffect, useState } from 'react'
import jsQR from 'jsqr'
import { X } from '@phosphor-icons/react'
import './QRScanner.css'

export default function QRScanner({ onScan, onClose }) {
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef    = useRef(null)
  const [camError, setCamError] = useState('')

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(stream => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().then(tick)
        }
      })
      .catch(() => setCamError('Camera access denied. Please allow camera permission and try again.'))

    return () => {
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  function tick() {
    rafRef.current = requestAnimationFrame(() => {
      const video  = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return
      if (video.readyState < 2) { tick(); return }
      canvas.width  = video.videoWidth
      canvas.height = video.videoHeight
      const ctx  = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(video, 0, 0)
      const img  = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
      if (code?.data) {
        streamRef.current?.getTracks().forEach(t => t.stop())
        onScan(code.data)
      } else {
        tick()
      }
    })
  }

  return (
    <div className="qr-scanner-overlay" onClick={onClose}>
      <div className="qr-scanner-modal" onClick={e => e.stopPropagation()}>
        <div className="qr-scanner-header">
          <span>Scan Address QR</span>
          <button className="qr-scanner-close" onClick={onClose}><X size={20} /></button>
        </div>
        {camError ? (
          <p className="qr-scanner-error">{camError}</p>
        ) : (
          <div className="qr-scanner-viewport">
            <video ref={videoRef} playsInline muted />
            <div className="qr-scanner-frame" />
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!camError && <p className="qr-scanner-hint">Align QR code within the frame</p>}
      </div>
    </div>
  )
}
