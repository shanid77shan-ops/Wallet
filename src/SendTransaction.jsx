import { useCallback, useRef, useState } from 'react'
import { BrowserProvider, parseEther } from 'ethers'
import { supabase } from './supabaseClient'
import './SendTransaction.css'

const SEPOLIA_CHAIN_ID = 11155111n
const SEPOLIA_HEX      = '0xaa36a7'

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type = 'success', onDismiss }) {
  return (
    <div className={`send-toast send-toast--${type}`} role="alert">
      <span className="send-toast__icon">{type === 'success' ? '✓' : '✕'}</span>
      <span className="send-toast__msg">{message}</span>
      <button className="send-toast__close" onClick={onDismiss} aria-label="Dismiss">×</button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SendTransaction({ session }) {
  const [to, setTo]         = useState('')
  const [amount, setAmount] = useState('')

  // 'idle' | 'sending' | 'confirming' | 'done' | 'error'
  const [phase, setPhase]     = useState('idle')
  const [txHash, setTxHash]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast]     = useState(null)
  const toastTimer = useRef(null)

  function showToast(message, type = 'success', duration = 6000) {
    clearTimeout(toastTimer.current)
    setToast({ message, type })
    toastTimer.current = setTimeout(() => setToast(null), duration)
  }

  const handleSend = useCallback(async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setTxHash(null)

    // ── Guard: MetaMask must be present ────────────────────────────────────
    if (!window.ethereum) {
      setErrorMsg('MetaMask is not installed. Please install it to send transactions.')
      return
    }

    setPhase('sending')
    let supabaseRowId = null

    try {
      const provider = new BrowserProvider(window.ethereum)

      // ── Ensure the user is on Sepolia ────────────────────────────────────
      const network = await provider.getNetwork()
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_HEX }],
          })
        } catch {
          throw new Error('Please switch MetaMask to the Sepolia Testnet and try again.')
        }
      }

      const signer = await provider.getSigner()

      // ── Broadcast the transaction ─────────────────────────────────────────
      const tx = await signer.sendTransaction({
        to,
        value: parseEther(amount),
      })

      setTxHash(tx.hash)

      // ── Insert 'pending' row in Supabase immediately ──────────────────────
      const { data: row, error: insertError } = await supabase
        .from('transactions')
        .insert([{
          user_id:          session.user.id,
          amount:           parseFloat(amount),
          symbol:           'ETH',
          status:           'pending',
          transaction_hash: tx.hash,
          to_address:       to,
          network:          'Sepolia',
        }])
        .select('id')
        .single()

      if (insertError) {
        // Row failed to insert — log but do not abort; tx is already broadcast
        console.error('Supabase insert failed:', insertError.message)
      } else {
        supabaseRowId = row.id
      }

      // ── Wait for on-chain confirmation ────────────────────────────────────
      setPhase('confirming')
      await tx.wait()

      // ── Update Supabase row to 'confirmed' ────────────────────────────────
      if (supabaseRowId) {
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ status: 'confirmed' })
          .eq('id', supabaseRowId)

        if (updateError) {
          console.error('Supabase status update failed:', updateError.message)
        }
      }

      // ── Success ───────────────────────────────────────────────────────────
      setPhase('done')
      setTo('')
      setAmount('')
      setTxHash(null)
      showToast(`Transaction confirmed! ${tx.hash.slice(0, 10)}…${tx.hash.slice(-6)}`)

    } catch (err) {
      setPhase('error')
      const msg =
        err.code === 4001 || err.code === 'ACTION_REJECTED'
          ? 'Transaction rejected in MetaMask.'
          : err.message
      setErrorMsg(msg)
    }
  }, [to, amount, session])

  const isBusy = phase === 'sending' || phase === 'confirming'

  return (
    <div className="send-tx">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <h3 className="send-tx__title">Send ETH <span className="send-tx__network">Sepolia</span></h3>

      <form className="send-tx__form" onSubmit={handleSend}>
        <label className="send-tx__label">Recipient address</label>
        <input
          className="send-tx__input"
          type="text"
          placeholder="0x..."
          value={to}
          onChange={e => setTo(e.target.value)}
          required
          disabled={isBusy}
          pattern="^0x[0-9a-fA-F]{40}$"
          title="Valid Ethereum address (0x followed by 40 hex characters)"
        />

        <label className="send-tx__label">Amount (ETH)</label>
        <input
          className="send-tx__input"
          type="number"
          placeholder="0.001"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          min="0.000001"
          step="any"
          disabled={isBusy}
        />

        <button className="send-tx__btn" type="submit" disabled={isBusy}>
          {phase === 'sending'    && 'Broadcasting…'}
          {phase === 'confirming' && 'Waiting for confirmation…'}
          {(phase === 'idle' || phase === 'done' || phase === 'error') && 'Send'}
        </button>
      </form>

      {/* Inline status while broadcast is in flight */}
      {txHash && phase === 'confirming' && (
        <div className="send-tx__status">
          <span className="send-tx__spinner" />
          <span>
            Pending —{' '}
            <a
              className="send-tx__etherscan"
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              view on Etherscan ↗
            </a>
          </span>
        </div>
      )}

      {phase === 'error' && errorMsg && (
        <p className="send-tx__error">{errorMsg}</p>
      )}
    </div>
  )
}
