import { useState } from 'react'
import './CoinImage.css'

export default function CoinImage({ coin, size = 36, className = '' }) {
  const [imgErr, setImgErr] = useState(false)

  const style = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    fontSize: size * 0.42,
  }

  if (coin?.image && !imgErr) {
    return (
      <img
        src={coin.image}
        alt={coin?.name ?? ''}
        className={`coin-img ${className}`}
        style={{ width: size, height: size, minWidth: size }}
        onError={() => setImgErr(true)}
      />
    )
  }

  return (
    <div
      className={`coin-img-fallback ${className}`}
      style={{
        ...style,
        background: `${coin?.color ?? '#888'}22`,
        color: coin?.color ?? '#888',
        borderRadius: '50%',
      }}
    >
      {(coin?.symbol ?? '?')[0]}
    </div>
  )
}
