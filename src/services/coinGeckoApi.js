// CoinGecko IDs match local app IDs directly for all coins in our list
// (no special mapping needed — we use CoinGecko IDs as local IDs)

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
  const ids = staticCoins.map(c => c.id).join(',')
  const url =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd` +
    `&ids=${ids}` +
    `&sparkline=true` +
    `&price_change_percentage=24h` +
    `&per_page=250`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`)

  const data = await res.json()
  const liveMap = {}

  for (const item of data) {
    liveMap[item.id] = {
      price:      item.current_price ?? 0,
      change24h:  item.price_change_percentage_24h ?? 0,
      marketCap:  item.market_cap ?? 0,
      volume24h:  item.total_volume ?? 0,
      sparkline:  downsampleSparkline(item.sparkline_in_7d?.price),
      image:      item.image ?? null,
    }
  }

  return liveMap
}
