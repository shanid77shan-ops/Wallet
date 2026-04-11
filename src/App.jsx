/**
 * App.jsx — xdt-wallet root
 * Routing:
 *   • No wallet on device → Setup
 *   • Wallet exists, session cold → Unlock (PIN)
 *   • Wallet unlocked + auth session → Main app shell
 *   • Not authenticated → Auth (email OTP)
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { XDTWalletProvider, useXDTWallet } from './context/XDTWalletContext'
import { CoinProvider } from './context/CoinContext'

import { CurrencyProvider } from './context/CurrencyContext'
import BottomNav  from './components/BottomNav'
import Setup      from './pages/Setup'
import Unlock     from './pages/Unlock'
import Home       from './pages/Home'
import Trending   from './pages/Trending'
import Trade      from './pages/Trade'
import Profile    from './pages/Profile'
import P2P        from './pages/P2P'
import CoinDetail from './pages/CoinDetail'

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

// ── Wallet gate (inside AuthGate) ─────────────────────────────────────────────
function WalletGate({ children }) {
  const { isUnlocked, isLocked } = useXDTWallet()

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

// ── Main App Shell ────────────────────────────────────────────────────────────
function AppShell() {
  return (
    <WalletGate>
      <CoinProvider>
      <CurrencyProvider>
        <div className="app-shell">
          <main className="app-content">
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/coin/:id"  element={<CoinDetail />} />
              <Route path="/trending"  element={<Trending />} />
              <Route path="/trade"     element={<Trade />} />
              <Route path="/p2p"       element={<P2P />} />
              <Route path="/profile"   element={<Profile />} />
              <Route path="*"          element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
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
        <XDTWalletProvider>
          <AuthGate>
            <AppShell />
          </AuthGate>
        </XDTWalletProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
