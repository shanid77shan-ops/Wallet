import { useState } from 'react'
import { BrowserProvider } from 'ethers'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [loading, setLoading] = useState(false)

  async function handleConnect() {
    try {
      setLoading(true)
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const walletAddress = accounts[0]

      // 1. Generate deterministic credentials
      const email = `${walletAddress.toLowerCase()}@metamask.wallet`
      const password = `${walletAddress.toLowerCase()}::wallet-auth-salt`

      // 2. Auth with Supabase
      let { data, error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error && error.message.includes('Invalid login')) {
        const signUp = await supabase.auth.signUp({ email, password })
        data = signUp.data
        error = signUp.error
      }
      if (error) throw error

      // 3. Upsert Profile (Fixes the 404 error)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: data.user.id, wallet_address: walletAddress }, { onConflict: 'id' })

      if (profileError) throw profileError

      window.location.href = '/home' // Redirect after success
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <button onClick={handleConnect} disabled={loading}>
        {loading ? "Authenticating..." : "Connect MetaMask"}
      </button>
    </div>
  )
}