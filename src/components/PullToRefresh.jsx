import { useState, useRef, useCallback } from 'react'
import './PullToRefresh.css'

const THRESHOLD  = 64   // px before triggering
const MAX_PULL   = 80   // max visual stretch

export default function PullToRefresh({ onRefresh, scrollRef, children }) {
  const [pullY,      setPullY]      = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const startY    = useRef(0)
  const isPulling = useRef(false)
  const latestY   = useRef(0)

  const onTouchStart = useCallback((e) => {
    const el = scrollRef?.current
    if (el && el.scrollTop > 0) return
    startY.current    = e.touches[0].clientY
    isPulling.current = true
  }, [scrollRef])

  const onTouchMove = useCallback((e) => {
    if (!isPulling.current || refreshing) return
    const dy = e.touches[0].clientY - startY.current
    if (dy <= 0) { isPulling.current = false; setPullY(0); latestY.current = 0; return }
    const visual = Math.min(dy * 0.45, MAX_PULL)
    latestY.current = visual
    setPullY(visual)
  }, [refreshing])

  const onTouchEnd = useCallback(async () => {
    if (!isPulling.current) return
    isPulling.current = false
    const captured = latestY.current
    setPullY(0)
    latestY.current = 0
    if (captured >= THRESHOLD && onRefresh) {
      setRefreshing(true)
      try { await onRefresh() } catch {}
      setRefreshing(false)
    }
  }, [onRefresh])

  const progress  = Math.min(pullY / THRESHOLD, 1)
  const triggered = pullY >= THRESHOLD

  return (
    <div
      className="ptr-root"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Indicator */}
      <div
        className="ptr-indicator"
        style={{
          height:  refreshing ? 52 : pullY,
          opacity: refreshing ? 1  : progress,
        }}
      >
        <div
          className={`ptr-spinner${refreshing ? ' spin' : ''}`}
          style={{ transform: refreshing ? undefined : `rotate(${pullY * 4}deg)` }}
        />
        <span className="ptr-label">
          {refreshing ? 'Refreshing…' : triggered ? 'Release to refresh' : 'Pull to refresh'}
        </span>
      </div>

      {/* Content slides with pull */}
      <div
        className="ptr-content"
        style={{
          transform:  `translateY(${pullY}px)`,
          transition: pullY === 0 ? 'transform 0.28s ease' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}
