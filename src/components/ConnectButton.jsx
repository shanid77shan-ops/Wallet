import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useBalance } from 'wagmi'
import { Wallet, ChevronDown, Wifi } from 'lucide-react'
import './ConnectButton.css'

export default function ConnectButton({ variant = 'default' }) {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const { data: balance } = useBalance({ address, query: { enabled: isConnected } })

  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
  const chainName = caipNetwork?.name ?? ''
  const ethBal = balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : ''

  if (isConnected) {
    return (
      <button className="connect-btn connected" onClick={() => open({ view: 'Account' })}>
        <div className="connect-dot" />
        <div className="connect-info">
          <span className="connect-address">{short}</span>
          {ethBal && <span className="connect-balance">{ethBal}</span>}
        </div>
        <ChevronDown size={14} color="var(--text-muted)" />
      </button>
    )
  }

  if (variant === 'large') {
    return (
      <button className="connect-btn-large" onClick={() => open()}>
        <Wallet size={20} />
        Connect Wallet
      </button>
    )
  }

  return (
    <button className="connect-btn disconnected" onClick={() => open()}>
      <Wifi size={15} />
      <span>Connect</span>
    </button>
  )
}
