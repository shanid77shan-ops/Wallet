import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Bell, Globe, Palette, HelpCircle, LogOut,
  ChevronRight, Copy, Check, Fingerprint, Wallet, FileText, Gift, X,
} from 'lucide-react'
import BackButton from '../components/BackButton'
import { useAuth }      from '../context/AuthContext'
import { useXDTWallet } from '../context/XDTWalletContext'
import { useCurrency, CURRENCIES } from '../context/CurrencyContext'
import { clearWalletData, clearAccounts, loadWalletData, decryptMnemonic } from '../services/walletKeyService'
import './Profile.css'

const securityItems = [
  { icon: Shield,      label: 'Backup Phrase',    sub: 'Store safely',  color: '#10b981', action: 'backup' },
  { icon: Fingerprint, label: 'PIN / Biometrics', sub: 'Enabled',       color: '#3b82f6' },
  { icon: Wallet,      label: 'Connected dApps',  sub: 'None',          color: '#7c3aed' },
]

const supportItems = [
  { icon: Gift,       label: 'Refer & Earn',    sub: 'Invite friends', color: '#10b981' },
  { icon: FileText,   label: 'Terms & Privacy', sub: '',               color: '#64748b' },
  { icon: HelpCircle, label: 'Help Center',     sub: '',               color: '#64748b' },
]

export default function Profile() {
  const navigate  = useNavigate()
  const { user, email } = useAuth()
  const { keys, tokens, totalUSD, prices, lockWallet, userId } = useXDTWallet()
  const { currency, setCurrency, fmt } = useCurrency()

  const [copiedEth,  setCopiedEth]  = useState(false)
  const [copiedTron, setCopiedTron] = useState(false)

  // ── Backup phrase modal ────────────────────────────────────────────────────
  const [backupOpen,    setBackupOpen]    = useState(false)
  const [backupPin,     setBackupPin]     = useState('')
  const [backupPhrase,  setBackupPhrase]  = useState('')
  const [backupErr,     setBackupErr]     = useState('')
  const [backupLoading, setBackupLoading] = useState(false)
  const [phraseCopied,  setPhraseCopied]  = useState(false)

  function openBackup() { setBackupOpen(true); setBackupPin(''); setBackupPhrase(''); setBackupErr('') }
  function closeBackup() { setBackupOpen(false); setBackupPhrase(''); setBackupPin('') }

  async function handleRevealPhrase(e) {
    e.preventDefault()
    setBackupErr('')
    setBackupLoading(true)
    try {
      const stored = loadWalletData(userId)
      if (!stored) throw new Error('No wallet found on this device')
      const phrase = await decryptMnemonic(stored.encryptedMnemonic, backupPin)
      setBackupPhrase(phrase)
    } catch (err) {
      setBackupErr(err.message || 'Wrong PIN')
    } finally {
      setBackupLoading(false)
    }
  }

  function copyPhrase() {
    navigator.clipboard.writeText(backupPhrase).catch(() => {})
    setPhraseCopied(true)
    setTimeout(() => setPhraseCopied(false), 2000)
  }

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
    lockWallet()
    navigate('/')
  }

  function handleResetWallet() {
    if (window.confirm('Delete wallet from this device? Make sure you have your seed phrase saved!')) {
      clearWalletData(userId)
      clearAccounts(userId)
      lockWallet()
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
        <BackButton to="/" />
        <h1>Profile</h1>
        <div style={{ width: 34 }} />
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
          <div className="stat-value">{fmt(totalUSD)}</div>
          <div className="stat-label">Portfolio Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{fmt(ethUSD)}</div>
          <div className="stat-label">ETH Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{fmt(ercUSD + trcUSD)}</div>
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

      {/* Security */}
      <div className="menu-section">
        <div className="menu-section-title">Security</div>
        <div className="menu-section-card">
          {securityItems.map(({ icon: Icon, label, sub, color, action }, i, arr) => (
            <button
              key={label}
              className={`menu-item${i < arr.length - 1 ? ' bordered' : ''}`}
              onClick={action === 'backup' ? openBackup : undefined}
            >
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

      {/* Preferences — currency picker inline */}
      <div className="menu-section">
        <div className="menu-section-title">Preferences</div>
        <div className="menu-section-card">
          {/* Currency */}
          <div className="menu-item bordered">
            <div className="menu-icon" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
              <Globe size={17} />
            </div>
            <div className="menu-item-text">
              <span className="menu-label">Currency</span>
              <div className="currency-picker">
                {CURRENCIES.map(c => (
                  <button
                    key={c.code}
                    className={`currency-chip${currency === c.code ? ' active' : ''}`}
                    onClick={() => setCurrency(c.code)}
                  >
                    {c.flag} {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Appearance */}
          <button className="menu-item bordered">
            <div className="menu-icon" style={{ background: '#8b5cf620', color: '#8b5cf6' }}>
              <Palette size={17} />
            </div>
            <div className="menu-item-text">
              <span className="menu-label">Appearance</span>
              <span className="menu-sub">Dark Mode</span>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </button>
          {/* Notifications */}
          <button className="menu-item">
            <div className="menu-icon" style={{ background: '#ec489920', color: '#ec4899' }}>
              <Bell size={17} />
            </div>
            <div className="menu-item-text">
              <span className="menu-label">Notifications</span>
              <span className="menu-sub">All enabled</span>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      {/* Support */}
      <div className="menu-section">
        <div className="menu-section-title">Support</div>
        <div className="menu-section-card">
          {supportItems.map(({ icon: Icon, label, sub, color }, i, arr) => (
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

      {/* ── Backup Phrase Modal ──────────────────────────────────────────────── */}
      {backupOpen && (
        <div className="backup-overlay" onClick={closeBackup}>
          <div className="backup-sheet" onClick={e => e.stopPropagation()}>
            <div className="backup-header">
              <h3>Backup Phrase</h3>
              <button className="backup-close" onClick={closeBackup}><X size={20} /></button>
            </div>

            {!backupPhrase ? (
              <>
                <p className="backup-warning">
                  ⚠️ Your seed phrase gives full access to your wallet. Never share it with anyone.
                </p>
                <form className="backup-form" onSubmit={handleRevealPhrase}>
                  <label className="backup-pin-label">Enter your PIN to reveal</label>
                  <input
                    className="backup-pin-input"
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="PIN"
                    value={backupPin}
                    onChange={e => { setBackupPin(e.target.value.replace(/\D/g, '')); setBackupErr('') }}
                    autoFocus
                  />
                  {backupErr && <p className="backup-error">{backupErr}</p>}
                  <button className="backup-reveal-btn" type="submit" disabled={backupLoading || !backupPin}>
                    {backupLoading ? 'Decrypting…' : 'Reveal Phrase'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="backup-warning">
                  Write these 12 words down in order and store them somewhere safe offline.
                </p>
                <div className="backup-phrase-grid">
                  {backupPhrase.split(' ').map((word, i) => (
                    <div key={i} className="backup-word">
                      <span className="backup-word-num">{i + 1}</span>
                      <span className="backup-word-val">{word}</span>
                    </div>
                  ))}
                </div>
                <button className="backup-copy-btn" onClick={copyPhrase}>
                  {phraseCopied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy to clipboard</>}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
