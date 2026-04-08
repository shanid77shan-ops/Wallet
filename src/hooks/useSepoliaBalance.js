import { useEffect, useRef, useState } from 'react'
import { getSepoliaEthBalance } from '../services/alchemyService'

const POLL_INTERVAL = 30_000

/**
 * Polls the Sepolia Testnet ETH balance for the given wallet address every 30s.
 * Resets automatically when the address changes or becomes null.
 *
 * @param {string|null} walletAddress
 * @returns {{ balance: string|null, loading: boolean, error: string|null }}
 */
export function useSepoliaBalance(walletAddress) {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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
        setBalance(eth)
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
