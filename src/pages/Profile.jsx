import { useState } from 'react'
import {
  User, Shield, Bell, Palette, HelpCircle, LogOut,
  ChevronRight, Copy, Check, Fingerprint, Globe,
  Moon, Sun, Wallet, Gift, FileText
} from 'lucide-react'
import './Profile.css'

const address = '0x7f3a8B9c...2d4E5f6A'

const menuSections = [
  {
    title: 'Account',
    items: [
      { icon: Shield, label: 'Security', sub: '2FA Enabled', color: '#10b981' },
      { icon: Fingerprint, label: 'Biometrics', sub: 'Face ID on', color: '#3b82f6' },
      { icon: Wallet, label: 'Connected Wallets', sub: '2 wallets', color: '#7c3aed' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Globe, label: 'Currency', sub: 'USD', color: '#f59e0b' },
      { icon: Palette, label: 'Appearance', sub: 'Dark Mode', color: '#8b5cf6' },
      { icon: Bell, label: 'Notifications', sub: 'All enabled', color: '#ec4899' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: Gift, label: 'Refer & Earn', sub: 'Invite friends', color: '#10b981' },
      { icon: FileText, label: 'Terms & Privacy', sub: '', color: '#64748b' },
      { icon: HelpCircle, label: 'Help Center', sub: '', color: '#64748b' },
    ],
  },
]

const stats = [
  { label: 'Portfolio Value', value: '$51,438' },
  { label: 'Total Trades', value: '247' },
  { label: 'P&L (All Time)', value: '+$9,338', positive: true },
]

export default function Profile() {
  const [copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const copyAddress = () => {
    navigator.clipboard.writeText('0x7f3a8B9c2d4E5f6A').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1>Profile</h1>
        <button className="theme-toggle" onClick={() => setDarkMode(d => !d)}>
          {darkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Avatar & Info */}
      <div className="profile-hero">
        <div className="profile-avatar">
          <span>S</span>
          <div className="avatar-badge">
            <Check size={10} strokeWidth={3} />
          </div>
        </div>
        <div className="profile-name">ShaN</div>
        <div className="profile-email">shan@cryptowallet.app</div>

        {/* Wallet Address */}
        <button className="address-pill" onClick={copyAddress}>
          <span className="address-text">{address}</span>
          {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} color="var(--text-muted)" />}
        </button>

        {/* Level badge */}
        <div className="level-badge">
          <div className="level-star">★</div>
          <span>Pro Trader</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-value ${s.positive ? 'positive' : ''}`}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Portfolio Allocation */}
      <div className="allocation-card">
        <div className="alloc-title">Portfolio Allocation</div>
        <div className="alloc-bar-wrap">
          {[
            { color: '#f7931a', pct: 44, label: 'BTC' },
            { color: '#627eea', pct: 28, label: 'ETH' },
            { color: '#9945ff', pct: 13, label: 'SOL' },
            { color: '#f3ba2f', pct: 10, label: 'BNB' },
            { color: '#6b7280', pct: 5, label: 'Other' },
          ].map(a => (
            <div
              key={a.label}
              className="alloc-seg"
              style={{ width: `${a.pct}%`, background: a.color }}
              title={`${a.label}: ${a.pct}%`}
            />
          ))}
        </div>
        <div className="alloc-legend">
          {[
            { color: '#f7931a', label: 'BTC', pct: 44 },
            { color: '#627eea', label: 'ETH', pct: 28 },
            { color: '#9945ff', label: 'SOL', pct: 13 },
            { color: '#f3ba2f', label: 'BNB', pct: 10 },
            { color: '#6b7280', label: 'Other', pct: 5 },
          ].map(a => (
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

      {/* Sign Out */}
      <button className="signout-btn">
        <LogOut size={18} />
        Sign Out
      </button>

      <div className="version-text">Crypto Wallet v1.0.0</div>
    </div>
  )
}
