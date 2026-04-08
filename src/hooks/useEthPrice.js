import { useEffect, useRef, useState } from 'react'
import { getLivePrice } from '../services/coinGeckoApi'

const POLL_INTERVAL = 60_000

export function useEthPrice() {
  const [price, setPrice] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const isFirstFetch = useRef(true)

  useEffect(() => {
    let cancelled = false

    async function fetchPrice() {
      try {
        const usd = await getLivePrice('ethereum', 'usd')
        if (cancelled) return
        setPrice(usd)
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

    fetchPrice()
    const id = setInterval(fetchPrice, POLL_INTERVAL)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return { price, error, loading }
}
