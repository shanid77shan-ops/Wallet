import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { AuthProvider } from './context/AuthContext'
import { WalletProvider } from './context/WalletContext'
import { CoinProvider } from './context/CoinContext'
import { Web3Provider } from './providers/Web3Provider'
import { useMetaMask } from './hooks/useMetaMask'
import BottomNav from './components/BottomNav'
import AuthPage from './AuthPage'
import Home from './pages/Home'
import P2P from './pages/P2P'
import Trending from './pages/Trending'
import Trade from './pages/Trade'
import Profile from './pages/Profile'
import './App.css'

function MetaMaskConnector({ userId }) {
  const { walletAddress, isConnecting, isInitializing, isMetaMaskInstalled, error, connect } =
    useMetaMask(userId)

  const short = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  return (
    <div className="metamask-bar">
      {isInitializing ? (
        <span className="metamask-initializing">
          <span className="metamask-spinner" />
          Detecting wallet…
        </span>
      ) : !isMetaMaskInstalled ? (
        <span className="metamask-warning">MetaMask not detected</span>
      ) : walletAddress ? (
        <span className="metamask-address">{short}</span>
      ) : (
        <button
          className="metamask-connect-btn"
          onClick={connect}
          disabled={isConnecting}
        >
          {isConnecting && <span className="metamask-spinner" />}
          {isConnecting ? 'Connecting…' : 'Connect Wallet'}
        </button>
      )}
      {error && <span className="metamask-error">{error}</span>}
    </div>
  )
}

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="App">
      {!session ? (
        <AuthPage />
      ) : (
        <BrowserRouter>
          <AuthProvider>
            <Web3Provider>
              <WalletProvider>
                <CoinProvider>
                  <div className="app-shell">
                    <MetaMaskConnector userId={session.user.id} />
                    <main className="app-content">
                      <Routes>
                        <Route path="/" element={<Home session={session} />} />
                        <Route path="/p2p" element={<P2P />} />
                        <Route path="/trending" element={<Trending />} />
                        <Route path="/trade" element={<Trade />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                    <BottomNav />
                  </div>
                </CoinProvider>
              </WalletProvider>
            </Web3Provider>
          </AuthProvider>
        </BrowserRouter>
      )}
    </div>
  )
}

export default App
