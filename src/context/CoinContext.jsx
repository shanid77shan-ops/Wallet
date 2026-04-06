import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { coins as staticCoins } from '../data/coins'
import { fetchLivePrices } from '../services/coinGeckoApi'

const CoinContext = createContext(null)

const POLL_INTERVAL = 30_000

export function CoinProvider({ children }) {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const isFirstFetch = useRef(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const liveMap = await fetchLivePrices(staticCoins)
        if (cancelled) return
        const merged = staticCoins.map(coin => ({
          ...coin,
          ...(liveMap[coin.id] ?? {}),
        }))
        setCoins(merged)
        setError(null)
        setLastUpdated(new Date())
      } catch (err) {
        if (cancelled) return
        setError('Price update failed — showing last known data')
        // Preserve existing coins (stale is better than empty)
        if (isFirstFetch.current) {
          // First load failed: show static coins as fallback
          setCoins(staticCoins)
        }
      } finally {
        if (!cancelled && isFirstFetch.current) {
          setLoading(false)
          isFirstFetch.current = false
        }
      }
    }

    load()
    const id = setInterval(load, POLL_INTERVAL)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return (
    <CoinContext.Provider value={{ coins, loading, error, lastUpdated }}>
      {children}
    </CoinContext.Provider>
  )
}

export function useCoins() {
  return useContext(CoinContext)
}
