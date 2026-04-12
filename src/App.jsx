/**
 * App.jsx — xdt-wallet root
 * Routing:
 *   • No wallet on device → Setup
 *   • Wallet exists, session cold → Unlock (PIN)
 *   • Wallet unlocked + auth session → Main app shell
 *   • Not authenticated → Auth (email OTP)
 */
import { useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { XDTWalletProvider, useXDTWallet } from './context/XDTWalletContext'
import { CoinProvider, useCoins } from './context/CoinContext'

import { CurrencyProvider } from './context/CurrencyContext'
import BottomNav     from './components/BottomNav'
import PullToRefresh from './components/PullToRefresh'
import Setup      from './pages/Setup'
import Unlock     from './pages/Unlock'
import Home       from './pages/Home'
import Trending   from './pages/Trending'
import Trade      from './pages/Trade'
import Profile    from './pages/Profile'
import P2P          from './pages/P2P'
import Assets       from './pages/Assets'
import CoinDetail   from './pages/CoinDetail'
import ResetPassword from './pages/ResetPassword'

import './App.css'

// ── Auth gate ─────────────────────────────────────────────────────────────────
import Auth from './Auth'

function AuthGate({ children }) {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) return <Auth />
  return children
}

const DEV_BYPASS_WALLET = false

// ── Wallet gate (inside AuthGate) ─────────────────────────────────────────────
function WalletGate({ children }) {
  const { isUnlocked, isLocked } = useXDTWallet()

  // DEV: skip wallet setup and PIN screens during testing
  if (DEV_BYPASS_WALLET) return children

  if (!isUnlocked && !isLocked) {
    // No wallet stored on this device → onboarding
    return <Setup />
  }

  if (!isUnlocked && isLocked) {
    // Wallet exists but PIN not entered this session
    return <Unlock />
  }

  return children
}

// ── Inner shell — needs both wallet + coin contexts ───────────────────────────
function InnerShell() {
  const { refreshBalances } = useXDTWallet()
  const { refresh: refreshCoins } = useCoins()
  const scrollRef = useRef(null)

  async function handleRefresh() {
    await Promise.allSettled([refreshBalances(), refreshCoins()])
  }

  return (
    <div className="app-shell">
      <main className="app-content" ref={scrollRef}>
        <PullToRefresh onRefresh={handleRefresh} scrollRef={scrollRef}>
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/coin/:id"  element={<CoinDetail />} />
            <Route path="/trending"  element={<Trending />} />
            <Route path="/trade"     element={<Trade />} />
            <Route path="/p2p"       element={<P2P />} />
            <Route path="/assets"    element={<Assets />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </PullToRefresh>
      </main>
      <BottomNav />
    </div>
  )
}

// ── Main App Shell ────────────────────────────────────────────────────────────
function AppShell() {
  return (
    <WalletGate>
      <CoinProvider>
      <CurrencyProvider>
        <InnerShell />
      </CurrencyProvider>
      </CoinProvider>
    </WalletGate>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route — accessible without auth */}
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* All other routes go through auth + wallet gate */}
          <Route path="*" element={
            <XDTWalletProvider>
              <AuthGate>
                <AppShell />
              </AuthGate>
            </XDTWalletProvider>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
