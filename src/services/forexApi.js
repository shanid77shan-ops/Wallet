export async function fetchUsdInrRate() {
  const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR')
  if (!res.ok) throw new Error(`FX API ${res.status}`)

  const data = await res.json()
  const rate = data?.rates?.INR

  if (!Number.isFinite(rate)) {
    throw new Error('Invalid INR rate payload')
  }

  return rate
}
