import { useEffect, useRef, useState } from 'react'
import { getSepoliaEthBalance } from '../services/alchemyService'

const POLL_INTERVAL = 30_000

/**
 * Polls the real ETH balance on Sepolia Testnet every 30 s via Alchemy.
 * Resets automatically when walletAddress changes or goes null.
 *
 * @param {string|null} walletAddress
 * @returns {{
 *   balance:  number|null,   // ETH amount (0 is a valid, non-null value)
 *   loading:  boolean,       // true only during the very first fetch
 *   error:    string|null
 * }}
 */
export function useSepoliaBalance(walletAddress) {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const isFirstFetch = useRef(true)

  useEffect(() => {
    if (!walletAddress) {
      setBalance(null)
      setError(null)
      setLoading(false)
      isFirstFetch.current = true
      return
    }

    let cancelled = false
    isFirstFetch.current = true
    setLoading(true)

    async function poll() {
      try {
        const eth = await getSepoliaEthBalance(walletAddress)
        if (cancelled) return
        setBalance(eth)   // number, including 0
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
  }, [walletAddress])

  return { balance, loading, error }
}
