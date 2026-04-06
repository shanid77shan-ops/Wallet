import './LiveIndicator.css'

export default function LiveIndicator({ lastUpdated, error }) {
  if (!lastUpdated && !error) return null

  if (error) {
    return (
      <div className="live-indicator error">
        <span className="live-dot error-dot" />
        <span className="live-text">Update failed</span>
      </div>
    )
  }

  const time = lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return (
    <div className="live-indicator">
      <span className="live-dot" />
      <span className="live-text">Live · {time}</span>
    </div>
  )
}
