import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WalletProvider } from './context/WalletContext'
import { CoinProvider } from './context/CoinContext'
import { Web3Provider } from './providers/Web3Provider'
import BottomNav from './components/BottomNav'
import Login from './pages/Login'
import Home from './pages/Home'
import P2P from './pages/P2P'
import Trending from './pages/Trending'
import Trade from './pages/Trade'
import Profile from './pages/Profile'
import './App.css'

function AppContent() {
  const { isAuthenticated, isInitializing, topMessage } = useAuth()

  // Show loading state while checking auth
  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(180deg, #090f1a 0%, #0f1727 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
          <div style={{ color: '#aebdd7', fontSize: '14px' }}>Loading...</div>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {topMessage && <div className="top-popup-message">{topMessage}</div>}
        <Login />
      </>
    )
  }

  // Show app shell if authenticated
  return (
    <>
      {topMessage && <div className="top-popup-message">{topMessage}</div>}
      <Web3Provider>
        <WalletProvider>
          <CoinProvider>
            <div className="app-shell">
              <main className="app-content">
                <Routes>
                  <Route path="/"         element={<Home />}     />
                  <Route path="/p2p"      element={<P2P />}      />
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/trade"    element={<Trade />}    />
                  <Route path="/profile"  element={<Profile />}  />
                  <Route path="*"         element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <BottomNav />
            </div>
          </CoinProvider>
        </WalletProvider>
      </Web3Provider>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
