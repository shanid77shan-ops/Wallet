// Maps local app coin IDs to CoinGecko API IDs
const GECKO_ID_MAP = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  bnb: 'binancecoin',
  cardano: 'cardano',
  avalanche: 'avalanche-2',
  polkadot: 'polkadot',
  chainlink: 'chainlink',
}

// Reverse map: geckoId → local appId
const REVERSE_MAP = Object.fromEntries(
  Object.entries(GECKO_ID_MAP).map(([appId, geckoId]) => [geckoId, appId])
)

function downsampleSparkline(prices) {
  if (!prices || prices.length === 0) return []
  const slice = prices.slice(-Math.min(24, prices.length))
  const result = []
  for (let i = 0; i < 9; i++) {
    const idx = Math.round((i * (slice.length - 1)) / 8)
    result.push(slice[idx])
  }
  return result
}

export async function fetchLivePrices(staticCoins) {
  const geckoIds = staticCoins.map(c => GECKO_ID_MAP[c.id]).filter(Boolean)
  const url =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd` +
    `&ids=${geckoIds.join(',')}` +
    `&sparkline=true` +
    `&price_change_percentage=24h`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`)

  const data = await res.json()
  const liveMap = {}

  for (const item of data) {
    const appId = REVERSE_MAP[item.id]
    if (!appId) continue
    liveMap[appId] = {
      price: item.current_price ?? 0,
      change24h: item.price_change_percentage_24h ?? 0,
      marketCap: item.market_cap ?? 0,
      volume24h: item.total_volume ?? 0,
      sparkline: downsampleSparkline(item.sparkline_in_7d?.price),
    }
  }

  return liveMap
}
