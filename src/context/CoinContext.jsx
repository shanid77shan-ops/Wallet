import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { coins as staticCoins } from '../data/coins'
import { fetchLivePrices } from '../services/coinGeckoApi'

const CoinContext = createContext(null)

const POLL_INTERVAL = 30_000

export function CoinProvider({ children }) {
  const [liveMap,     setLiveMap]     = useState({})
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const isFirstFetch = useRef(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const map = await fetchLivePrices(staticCoins)
        if (cancelled) return
        setLiveMap(map)
        setError(null)
        setLastUpdated(new Date())
      } catch {
        if (cancelled) return
        setError('Price update failed — showing last known data')
      } finally {
        if (!cancelled && isFirstFetch.current) {
          setLoading(false)
          isFirstFetch.current = false
        }
      }
    }

    load()
    const id = setInterval(load, POLL_INTERVAL)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  const coins = staticCoins.map(coin => {
    const live = liveMap[coin.id] ?? {}
    return {
      ...coin,
      ...live,
      image: live.image ?? coin.image,  // live image when available, static CDN as fallback
    }
  })

  return (
    <CoinContext.Provider value={{ coins, loading, error, lastUpdated }}>
      {children}
    </CoinContext.Provider>
  )
}

export function useCoins() {
  return useContext(CoinContext)
}
