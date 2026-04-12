const API_BASE = 'http://localhost:3001'

function authHeaders() {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers ?? {}) },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

/** Save ETH and TRON addresses for the authenticated user */
export async function saveWalletAddresses(userId, ethAddress, tronAddress) {
  try {
    await apiFetch('/api/wallet/save-addresses', {
      method: 'POST',
      body: JSON.stringify({ ethAddress, tronAddress }),
    })
  } catch (err) {
    console.error('saveWalletAddresses:', err.message)
  }
}

/**
 * Upsert a batch of transactions.
 * Each tx: { txID, type, symbol, network, amount, from, to, timestamp }
 */
export async function syncTransactions(userId, transactions) {
  if (!transactions?.length) return
  try {
    await apiFetch('/api/wallet/sync-transactions', {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    })
  } catch (err) {
    console.error('syncTransactions:', err.message)
  }
}

/** Fetch all stored transactions for the authenticated user */
export async function fetchTransactions(userId) {
  try {
    const data = await apiFetch('/api/wallet/transactions')
    return data.transactions ?? []
  } catch (err) {
    console.error('fetchTransactions:', err.message)
    return []
  }
}

/**
 * Save token balances.
 * tokens: array of { id, balance }
 */
export async function saveBalances(userId, tokens) {
  if (!tokens?.length) return
  try {
    const balances = tokens.map(t => ({ tokenId: t.id, balance: t.balance ?? 0 }))
    await apiFetch('/api/wallet/save-balances', {
      method: 'POST',
      body: JSON.stringify({ balances }),
    })
  } catch (err) {
    console.error('saveBalances:', err.message)
  }
}
