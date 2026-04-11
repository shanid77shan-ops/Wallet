import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react'
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

  const load = useCallback(async () => {
    try {
      const map = await fetchLivePrices(staticCoins)
      setLiveMap(map)
      setError(null)
      setLastUpdated(new Date())
    } catch {
      setError('Price update failed — showing last known data')
    } finally {
      if (isFirstFetch.current) {
        setLoading(false)
        isFirstFetch.current = false
      }
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [load])

  const coins = staticCoins.map(coin => {
    const live = liveMap[coin.id] ?? {}
    return {
      ...coin,
      ...live,
      image: live.image ?? coin.image,
    }
  })

  return (
    <CoinContext.Provider value={{ coins, loading, error, lastUpdated, refresh: load }}>
      {children}
    </CoinContext.Provider>
  )
}

export function useCoins() {
  return useContext(CoinContext)
}
