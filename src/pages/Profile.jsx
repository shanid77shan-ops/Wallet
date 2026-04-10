import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Bell, Globe, Palette, HelpCircle, LogOut,
  ChevronRight, Copy, Check, Fingerprint, Wallet, FileText, Gift,
} from 'lucide-react'
import { useAuth }      from '../context/AuthContext'
import { useXDTWallet } from '../context/XDTWalletContext'
import { clearWalletData } from '../services/walletKeyService'
import { fmtUSD }       from '../services/xdtPriceService'
import './Profile.css'

const menuSections = [
  {
    title: 'Security',
    items: [
      { icon: Shield,      label: 'Backup Phrase',    sub: 'Store safely',  color: '#10b981' },
      { icon: Fingerprint, label: 'PIN / Biometrics', sub: 'Enabled',       color: '#3b82f6' },
      { icon: Wallet,      label: 'Connected dApps',  sub: 'None',          color: '#7c3aed' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Globe,   label: 'Currency',      sub: 'USD',          color: '#f59e0b' },
      { icon: Palette, label: 'Appearance',    sub: 'Dark Mode',    color: '#8b5cf6' },
      { icon: Bell,    label: 'Notifications', sub: 'All enabled',  color: '#ec4899' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: Gift,     label: 'Refer & Earn',    sub: 'Invite friends', color: '#10b981' },
      { icon: FileText, label: 'Terms & Privacy', sub: '',               color: '#64748b' },
      { icon: HelpCircle, label: 'Help Center',   sub: '',               color: '#64748b' },
    ],
  },
]

export default function Profile() {
  const navigate  = useNavigate()
  const { user, email, logout } = useAuth()
  const { keys, tokens, totalUSD, prices } = useXDTWallet()

  const [copiedEth,  setCopiedEth]  = useState(false)
  const [copiedTron, setCopiedTron] = useState(false)

  const userEmail   = email || user?.email || 'user@xdtwallet.app'
  const userName    = userEmail.split('@')[0] || 'Trader'
  const userInitial = userName.charAt(0).toUpperCase()

  const ethAddress  = keys?.ethAddress  ?? '—'
  const tronAddress = keys?.tronAddress ?? '—'

  function copyEth() {
    navigator.clipboard.writeText(ethAddress).catch(() => {})
    setCopiedEth(true)
    setTimeout(() => setCopiedEth(false), 2000)
  }
  function copyTron() {
    navigator.clipboard.writeText(tronAddress).catch(() => {})
    setCopiedTron(true)
    setTimeout(() => setCopiedTron(false), 2000)
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleResetWallet() {
    if (window.confirm('Delete wallet from this device? Make sure you have your seed phrase saved!')) {
      clearWalletData()
      logout()
      navigate('/')
    }
  }

  // Portfolio allocation from the 3 tokens
  const ethUSD  = (tokens.find(t => t.id === 'eth')?.balance ?? 0) * prices.eth
  const ercUSD  = (tokens.find(t => t.id === 'usdt-erc')?.balance ?? 0) * prices.usdt
  const trcUSD  = (tokens.find(t => t.id === 'usdt-trc')?.balance ?? 0) * prices.usdt
  const total   = ethUSD + ercUSD + trcUSD || 1

  const allocation = [
    { color: '#627eea', pct: Math.round(ethUSD / total * 100), label: 'ETH' },
    { color: '#26a17b', pct: Math.round(ercUSD / total * 100), label: 'USDT ERC' },
    { color: '#eb0029', pct: Math.round(trcUSD / total * 100), label: 'USDT TRC' },
  ]

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      {/* Avatar & Info */}
      <div className="profile-hero">
        <div className="profile-avatar">
          <span>{userInitial}</span>
          <div className="avatar-badge"><Check size={10} strokeWidth={3} /></div>
        </div>
        <div className="profile-name">{userName}</div>
        <div className="profile-email">{userEmail}</div>
        <div className="level-badge">
          <div className="level-star">X</div>
          <span>XDT Wallet</span>
        </div>
      </div>

      {/* Wallet Addresses */}
      <div className="addresses-card">
        <div className="addr-item">
          <div className="addr-label"><span className="addr-dot-eth" /> ETH / ERC-20</div>
          <button className="addr-value-btn" onClick={copyEth}>
            <span className="addr-mono">{ethAddress.slice(0, 10)}…{ethAddress.slice(-6)}</span>
            {copiedEth ? <Check size={13} color="#10b981" /> : <Copy size={13} color="#6c7f9f" />}
          </button>
        </div>
        <div className="addr-divider" />
        <div className="addr-item">
          <div className="addr-label"><span className="addr-dot-trc" /> TRON / TRC-20</div>
          <button className="addr-value-btn" onClick={copyTron}>
            <span className="addr-mono">{tronAddress.slice(0, 10)}…{tronAddress.slice(-6)}</span>
            {copiedTron ? <Check size={13} color="#10b981" /> : <Copy size={13} color="#6c7f9f" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{fmtUSD(totalUSD)}</div>
          <div className="stat-label">Portfolio Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{fmtUSD(ethUSD)}</div>
          <div className="stat-label">ETH Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{fmtUSD(ercUSD + trcUSD)}</div>
          <div className="stat-label">USDT Total</div>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="allocation-card">
        <div className="alloc-title">Portfolio Allocation</div>
        <div className="alloc-bar-wrap">
          {allocation.map(a => (
            <div key={a.label} className="alloc-seg"
              style={{ width: `${a.pct}%`, background: a.color }}
              title={`${a.label}: ${a.pct}%`}
            />
          ))}
        </div>
        <div className="alloc-legend">
          {allocation.map(a => (
            <div key={a.label} className="legend-item">
              <span className="legend-dot" style={{ background: a.color }} />
              <span className="legend-label">{a.label}</span>
              <span className="legend-pct">{a.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map(section => (
        <div key={section.title} className="menu-section">
          <div className="menu-section-title">{section.title}</div>
          <div className="menu-section-card">
            {section.items.map(({ icon: Icon, label, sub, color }, i, arr) => (
              <button key={label} className={`menu-item${i < arr.length - 1 ? ' bordered' : ''}`}>
                <div className="menu-icon" style={{ background: `${color}20`, color }}>
                  <Icon size={17} />
                </div>
                <div className="menu-item-text">
                  <span className="menu-label">{label}</span>
                  {sub && <span className="menu-sub">{sub}</span>}
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Danger Zone */}
      <div className="menu-section">
        <div className="menu-section-title">Danger Zone</div>
        <div className="menu-section-card">
          <button className="menu-item danger" onClick={handleResetWallet}>
            <div className="menu-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              <LogOut size={17} />
            </div>
            <div className="menu-item-text">
              <span className="menu-label" style={{ color: '#ef4444' }}>Delete Wallet</span>
              <span className="menu-sub">Removes keys from this device</span>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      <button className="signout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        Sign Out
      </button>

      <div className="version-text">XDT Wallet v1.0.0</div>
    </div>
  )
}
