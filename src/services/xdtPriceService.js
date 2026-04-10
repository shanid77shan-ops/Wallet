/**
 * xdtPriceService.js
 * Real-time USD prices for ETH and USDT from CoinGecko (free tier, no API key).
 */

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

let cache = null
let cacheTime = 0
const CACHE_TTL = 60_000 // 60 s

/**
 * Returns { eth: number, usdt: number } prices in USD.
 * Uses a 60-second in-memory cache to avoid rate limiting.
 */
export async function fetchPrices() {
  const now = Date.now()
  if (cache && now - cacheTime < CACHE_TTL) return cache

  try {
    const res  = await fetch(
      `${COINGECKO_BASE}/simple/price?ids=ethereum,tether&vs_currencies=usd&include_24hr_change=true`
    )
    if (!res.ok) throw new Error('CoinGecko fetch failed')
    const data = await res.json()

    cache = {
      eth:        data.ethereum?.usd       ?? 0,
      ethChange:  data.ethereum?.usd_24h_change ?? 0,
      usdt:       data.tether?.usd         ?? 1,
      usdtChange: data.tether?.usd_24h_change   ?? 0,
    }
    cacheTime = now
    return cache
  } catch {
    // Return last cache or safe defaults on failure
    return cache ?? { eth: 0, ethChange: 0, usdt: 1, usdtChange: 0 }
  }
}

/** Formats a USD value as "$1,234.56". */
export function fmtUSD(n) {
  if (!n && n !== 0) return '$—'
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

/** Formats a token balance with up to 6 significant decimal places. */
export function fmtToken(n, decimals = 6) {
  if (!n && n !== 0) return '—'
  return parseFloat(n.toFixed(decimals)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  })
}
