/**
 * App.jsx — xdt-wallet root
 * Routing:
 *   • No wallet on device → Setup (create or import)
 *   • Wallet exists, session cold → Unlock (PIN)
 *   • Wallet unlocked → Main app shell
 */
import { useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { XDTWalletProvider, useXDTWallet } from './context/XDTWalletContext'
import { CoinProvider, useCoins } from './context/CoinContext'

import { CurrencyProvider } from './context/CurrencyContext'
import BottomNav     from './components/BottomNav'
import PullToRefresh from './components/PullToRefresh'
import Setup      from './pages/Setup'
import Unlock     from './pages/Unlock'
import Home       from './pages/Home'
import Profile    from './pages/Profile'
import Assets     from './pages/Assets'
import CoinDetail   from './pages/CoinDetail'
import ResetPassword from './pages/ResetPassword'

import './App.css'

// ── Wallet gate ───────────────────────────────────────────────────────────────
function WalletGate({ children }) {
  const { isUnlocked, isLocked } = useXDTWallet()

  if (!isUnlocked && !isLocked) return <Setup />   // no wallet → onboarding
  if (!isUnlocked && isLocked)  return <Unlock />  // wallet locked → PIN screen

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
              <AppShell />
            </XDTWalletProvider>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
