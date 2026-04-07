import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext'
import { CoinProvider } from './context/CoinContext'
import { Web3Provider } from './providers/Web3Provider'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Trending from './pages/Trending'
import Trade from './pages/Trade'
import Profile from './pages/Profile'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Web3Provider>
        <WalletProvider>
          <CoinProvider>
            <div className="app-shell">
              <main className="app-content">
                <Routes>
                  <Route path="/"         element={<Home />}     />
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
    </BrowserRouter>
  )
}
