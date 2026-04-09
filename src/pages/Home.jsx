import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { ArrowUpRight, ArrowDown, Plus, Clock, X, Copy, CaretRight } from '@phosphor-icons/react'
import { ethers } from 'ethers'
import { QRCodeSVG } from 'qrcode.react' // Real QR Code support

const SUPPORTED_COINS = [
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: '🌐', networks: ['Ethereum Mainnet', 'Arbitrum', 'Optimism', 'Base'] },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', networks: ['Bitcoin Mainnet', 'Lightning Network'] },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '💵', networks: ['Ethereum (ERC20)', 'Tron (TRC20)', 'BNB Smart Chain (BEP20)'] },
  { id: 'bnb', name: 'Binance Coin', symbol: 'BNB', icon: '🔶', networks: ['BNB Smart Chain', 'Beacon Chain'] }
]

const Home = ({ session }) => {
  const [transactions, setTransactions] = useState([])
  const [balance, setBalance] = useState("0.00")
  const [showSend, setShowSend] = useState(false)
  const [showReceive, setShowReceive] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    fetchTransactions()
    updateBalance() // Fetch real balance on load

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${session.user.id}` }, 
        (payload) => { if (payload.eventType === 'INSERT') setTransactions((prev) => [payload.new, ...prev]) })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [session])

  // --- NEW: Fetch Actual MetaMask Balance ---
  const updateBalance = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const rawBalance = await provider.getBalance(accounts[0])
      setBalance(ethers.formatEther(rawBalance).slice(0, 6)) // Shows e.g., 0.1234
    }
  }

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from('transactions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    if (!error) setTransactions(data)
  }

  const handleSendAction = async (e) => {
    e.preventDefault()
    if (!window.ethereum) return alert("Please install MetaMask!")
    try {
      setIsSending(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const tx = await signer.sendTransaction({ to: recipient, value: ethers.parseEther(amount) })
      
      await supabase.from('transactions').insert([{ 
        user_id: session.user.id, 
        amount, 
        type: 'send', 
        status: 'pending', 
        recipient_address: recipient, 
        tx_hash: tx.hash 
      }])
      
      setShowSend(false); setAmount(''); setRecipient('')
      updateBalance() // Refresh balance after send
    } catch (error) { alert("Transaction failed: " + error.message) } finally { setIsSending(false) }
  }

  const closeReceive = () => {
    setShowReceive(false)
    setSelectedCoin(null)
    setSelectedNetwork(null)
  }

  return (
    <div className="home-container">
      {/* Wallet Balance Card */}
      <div className="balance-card">
        <div className="card-glass-overlay"></div>
        <p className="balance-label">Total Balance</p>
        <h1 className="balance-amount">{balance} <span className="currency">ETH</span></h1>
        <div className="card-footer">
          <span className="network-badge">Live Network</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="action-grid">
        <button className="action-item" onClick={() => alert('Exchange coming soon!')}>
          <div className="icon-circle primary"><Plus size={24} weight="bold" /></div>
          <span>Buy</span>
        </button>
        <button className="action-item" onClick={() => setShowSend(true)}>
          <div className="icon-circle secondary"><ArrowUpRight size={24} weight="bold" /></div>
          <span>Send</span>
        </button>
        <button className="action-item" onClick={() => setShowReceive(true)}>
          <div className="icon-circle tertiary"><ArrowDown size={24} weight="bold" /></div>
          <span>Receive</span>
        </button>
      </div>

      {/* --- RECEIVE BOTTOM SHEET --- */}
      {showReceive && (
        <div className="sheet-overlay" onClick={closeReceive}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <h3>{!selectedCoin ? 'Select Asset' : !selectedNetwork ? 'Select Network' : 'Deposit Details'}</h3>
              <X size={24} onClick={closeReceive} style={{cursor: 'pointer'}} />
            </div>
            <div className="sheet-content">
              {!selectedCoin && (
                <div className="selection-list">
                  {SUPPORTED_COINS.map(coin => (
                    <div key={coin.id} className="selection-item" onClick={() => setSelectedCoin(coin)}>
                      <div className="item-left">
                        <span className="coin-icon-large">{coin.icon}</span>
                        <div className="coin-info-text">
                          <p className="coin-name">{coin.name}</p>
                          <p className="coin-symbol">{coin.symbol}</p>
                        </div>
                      </div>
                      <CaretRight size={20} color="#666" />
                    </div>
                  ))}
                </div>
              )}

              {selectedCoin && !selectedNetwork && (
                <div className="selection-list">
                  <p className="selection-hint">Choose network for <strong>{selectedCoin.symbol}</strong></p>
                  {selectedCoin.networks.map(net => (
                    <div key={net} className="selection-item" onClick={() => setSelectedNetwork(net)}>
                      <div className="item-left">
                        <div className="net-dot"></div>
                        <p className="net-name">{net}</p>
                      </div>
                      <CaretRight size={20} color="#666" />
                    </div>
                  ))}
                  <button className="back-btn" onClick={() => setSelectedCoin(null)}>← Back to Assets</button>
                </div>
              )}

              {selectedCoin && selectedNetwork && (
                <div className="receive-final">
                  <div className="qr-container">
                    <QRCodeSVG value={session.user.id} size={150} bgColor="#ffffff" fgColor="#000000" includeMargin={true} />
                  </div>
                  <p className="receive-label-small">Your {selectedCoin.symbol} Address ({selectedNetwork})</p>
                  <div className="address-card" onClick={() => {navigator.clipboard.writeText(session.user.id); alert('Copied!')}}>
                    <span className="address-text">{session.user.id}</span>
                    <Copy size={20} color="#6366f1" />
                  </div>
                  <div className="warning-box">
                    <p>⚠️ Only send <strong>{selectedCoin.symbol}</strong> via <strong>{selectedNetwork}</strong>.</p>
                  </div>
                  <button className="back-btn" onClick={() => setSelectedNetwork(null)}>Choose different network</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SEND BOTTOM SHEET --- */}
      {showSend && (
        <div className="sheet-overlay" onClick={() => setShowSend(false)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <h3>Send ETH</h3>
              <X size={24} onClick={() => setShowSend(false)} style={{cursor: 'pointer'}} />
            </div>
            <form onSubmit={handleSendAction} className="sheet-form">
              <div className="input-group">
                <label>Recipient Address</label>
                <input type="text" placeholder="0x..." value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Amount (ETH)</label>
                <input type="number" step="0.0001" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <button type="submit" className="sheet-action-btn" disabled={isSending}>
                {isSending ? "Processing..." : "Confirm Transfer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="section-header">
          <h3>Recent Activity</h3>
          <button className="view-all">See All</button>
        </div>
        <div className="transaction-list">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx.id} className="tx-item">
                <div className={`tx-icon ${tx.type}`}>
                  {tx.type === 'send' ? <ArrowUpRight size={20} /> : <ArrowDown size={20} />}
                </div>
                <div className="tx-info">
                  <p className="tx-title">{tx.type === 'send' ? 'Sent ETH' : 'Received ETH'}</p>
                  <p className="tx-date">{new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
                <div className="tx-amount-wrapper">
                  <p className={`tx-amount ${tx.type}`}>
                    {tx.type === 'send' ? '-' : '+'}{tx.amount} ETH
                  </p>
                  <p className="tx-status">{tx.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Clock size={48} weight="light" />
              <p>No transactions found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home