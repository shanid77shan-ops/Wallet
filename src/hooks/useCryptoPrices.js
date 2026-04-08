import { useEffect, useRef, useState } from 'react'
import { fetchCryptoPrices } from '../services/priceService'

const POLL_INTERVAL = 60_000

/**
 * Polls BTC, ETH, and SOL prices every 60 seconds.
 *
 * Returns:
 *   prices      — { BTC: number|null, ETH: number|null, SOL: number|null }
 *   loading     — true only on the initial fetch
 *   error       — error message string, or null
 *   lastUpdated — Date of the last successful fetch, or null
 */
export function useCryptoPrices() {
  const [prices, setPrices] = useState({ BTC: null, ETH: null, SOL: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const isFirstFetch = useRef(true)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const data = await fetchCryptoPrices()
        if (cancelled) return
        setPrices(data)
        setLastUpdated(new Date())
        setError(null)
      } catch (err) {
        if (cancelled) return
        setError(err.message)
      } finally {
        if (!cancelled && isFirstFetch.current) {
          setLoading(false)
          isFirstFetch.current = false
        }
      }
    }

    poll()
    const id = setInterval(poll, POLL_INTERVAL)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return { prices, loading, error, lastUpdated }
}
