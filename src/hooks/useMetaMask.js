import { useState, useEffect, useCallback } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { BrowserProvider } from 'ethers'
import { supabase } from '../supabaseClient'

/**
 * Detects MetaMask, connects the wallet, and syncs the address to Supabase.
 *
 * isInitializing — true while detectEthereumProvider is still polling (up to 3 s).
 *                  The UI must not show any "not found" warning during this window.
 * isMetaMaskInstalled — set only after polling finishes.
 *
 * @param {string|undefined} userId  Supabase user ID (session.user.id)
 */
export function useMetaMask(userId) {
  const [walletAddress,       setWalletAddress]       = useState(null)
  const [isConnecting,        setIsConnecting]        = useState(false)
  const [isInitializing,      setIsInitializing]      = useState(true)  // ← polling in progress
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [error,               setError]               = useState(null)

  // ── Persist address to Supabase profiles ──────────────────────────────────
  // Defined before the effects that call it so the reference is stable.
  const saveToSupabase = useCallback(async (address) => {
    if (!userId || !address) return
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert({ id: userId, wallet_address: address }, { onConflict: 'id' })
    if (dbError) console.error('Failed to save wallet address:', dbError.message)
  }, [userId])

  // ── Step 1: wait for MetaMask to inject, then restore any existing session ─
  useEffect(() => {
    let cancelled = false

    async function detect() {
      try {
        const provider = await detectEthereumProvider({ mustBeMetaMask: true, timeout: 3000 })

        if (cancelled) return
        const installed = Boolean(provider)
        setIsMetaMaskInstalled(installed)
        setIsInitializing(false)

        if (!installed) return

        // Check if the user already approved this site — restore silently
        const accounts = await provider.request({ method: 'eth_accounts' })
        if (cancelled) return

        if (accounts[0]) {
          setWalletAddress(accounts[0])
          await saveToSupabase(accounts[0]) // keep Supabase in sync on page reload
        }
      } catch {
        if (!cancelled) setIsInitializing(false)
      }
    }

    detect()
    return () => { cancelled = true }
  }, [saveToSupabase])

  // ── Step 2: react to account switches / disconnects inside MetaMask ────────
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts) => {
      const address = accounts[0] ?? null
      setWalletAddress(address)
      if (address) saveToSupabase(address)
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
  }, [saveToSupabase])

  // ── Connect: prompt MetaMask and save address ──────────────────────────────
  const connect = useCallback(async () => {
    setError(null)

    const provider = await detectEthereumProvider({ mustBeMetaMask: true, timeout: 3000 })
    if (!provider) {
      setError('MetaMask not found. Please install it from metamask.io.')
      return
    }

    setIsConnecting(true)
    try {
      const ethersProvider = new BrowserProvider(window.ethereum)
      const accounts = await ethersProvider.send('eth_requestAccounts', [])
      const address = accounts[0]
      setWalletAddress(address)
      await saveToSupabase(address)
    } catch (err) {
      setError(err.code === 4001 ? 'Connection rejected.' : err.message)
    } finally {
      setIsConnecting(false)
    }
  }, [saveToSupabase])

  return {
    walletAddress,
    isConnecting,
    isInitializing,
    isMetaMaskInstalled,
    error,
    connect,
  }
}
