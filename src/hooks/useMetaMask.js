import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import { supabase } from '../supabaseClient'

/**
 * Handles MetaMask detection, connection, and syncing the wallet address
 * to the `profiles` table in Supabase for the given authenticated user.
 *
 * @param {string|undefined} userId - Supabase user ID (session.user.id)
 */
export function useMetaMask(userId) {
  const [walletAddress, setWalletAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const isMetaMaskInstalled =
    typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask)

  // Persist the address to Supabase profiles table
  const saveToSupabase = useCallback(
    async (address) => {
      if (!userId || !address) return
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({ id: userId, wallet_address: address }, { onConflict: 'id' })
      if (dbError) console.error('Failed to save wallet address:', dbError.message)
    },
    [userId]
  )

  // Request connection via MetaMask
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install it from metamask.io.')
      return
    }
    setIsConnecting(true)
    setError(null)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const address = accounts[0]
      setWalletAddress(address)
      await saveToSupabase(address)
    } catch (err) {
      // Error code 4001 = user rejected the request
      setError(err.code === 4001 ? 'Connection rejected.' : err.message)
    } finally {
      setIsConnecting(false)
    }
  }, [saveToSupabase])

  // If MetaMask already has an authorised connection, restore it silently
  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => { if (accounts[0]) setWalletAddress(accounts[0]) })
      .catch(() => {})
  }, [])

  // Keep state in sync when the user switches or disconnects accounts in MetaMask
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

  return { walletAddress, isConnecting, error, isMetaMaskInstalled, connect }
}
