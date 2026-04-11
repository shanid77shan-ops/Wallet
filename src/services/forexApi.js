export async function fetchExchangeRates() {
  const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR,AED')
  if (!res.ok) throw new Error(`FX API ${res.status}`)
  const data = await res.json()
  return {
    INR: data?.rates?.INR ?? 83.2,
    AED: data?.rates?.AED ?? 3.67,
  }
}

// backward-compat — P2P still uses this
export async function fetchUsdInrRate() {
  const rates = await fetchExchangeRates()
  return rates.INR
}
