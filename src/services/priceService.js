const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

const TRACKED_COINS = {
  bitcoin:  'BTC',
  ethereum: 'ETH',
  solana:   'SOL',
}

/**
 * Fetches the current USD price for BTC, ETH, and SOL in a single request.
 * Returns: { BTC: number, ETH: number, SOL: number }
 */
export async function fetchCryptoPrices() {
  const ids = Object.keys(TRACKED_COINS).join(',')
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd`
  )
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)

  const data = await res.json()

  return Object.entries(TRACKED_COINS).reduce((acc, [id, symbol]) => {
    acc[symbol] = data[id]?.usd ?? null
    return acc
  }, {})
}
