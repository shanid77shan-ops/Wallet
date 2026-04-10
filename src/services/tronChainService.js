/**
 * tronChainService.js
 * TRON Mainnet — USDT TRC-20 balance queries and signed transaction broadcast.
 * Uses the public TronGrid REST API — no SDK dependency.
 */
import { ethers } from 'ethers'
import { tronAddressToBodyHex, tronAddressToHex21 } from './walletKeyService'

const TRON_GRID = 'https://api.trongrid.io'

// USDT TRC-20 contract on TRON Mainnet
const USDT_TRC20_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
const USDT_DECIMALS = 6

// ── Helpers ───────────────────────────────────────────────────────────────────
function tronApiHeaders() {
  const key = import.meta.env.VITE_TRONGRID_API_KEY
  return key
    ? { 'Content-Type': 'application/json', 'TRON-PRO-API-KEY': key }
    : { 'Content-Type': 'application/json' }
}

async function tronPost(path, body) {
  const res = await fetch(`${TRON_GRID}${path}`, {
    method:  'POST',
    headers: tronApiHeaders(),
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`TronGrid ${path} → HTTP ${res.status}`)
  return res.json()
}

async function tronGet(path) {
  const res = await fetch(`${TRON_GRID}${path}`, { headers: tronApiHeaders() })
  if (!res.ok) throw new Error(`TronGrid GET ${path} → HTTP ${res.status}`)
  return res.json()
}

// ── ABI encoding helper (manual — no dependency) ──────────────────────────────
/**
 * ABI-encode (address, uint256) for TRON triggersmartcontract.
 * TRON expects the raw hex without "0x", packed to 32-byte words.
 * The address is the 20-byte body of the TRON address (same secp256k1 bytes as ETH).
 */
function encodeTransferParams(toTronAddress, amountUnits) {
  // Slot 0: address padded to 32 bytes (zero-left-padded 20-byte body)
  const addrBody  = tronAddressToBodyHex(toTronAddress)            // 40 hex = 20 bytes
  const addrPadded = addrBody.padStart(64, '0')                    // 64 hex = 32 bytes

  // Slot 1: uint256 amount padded to 32 bytes
  const amountHex  = BigInt(amountUnits).toString(16)
  const amtPadded  = amountHex.padStart(64, '0')

  return addrPadded + amtPadded
}

// ── Sign a TRON transaction ───────────────────────────────────────────────────
/**
 * Sign a raw TRON transaction ID (txID hex string, 32 bytes) with the private key.
 * Returns the 65-byte signature as a lowercase hex string (r+s+v, v = 0 or 1).
 */
function signTronTx(privateKey, txID) {
  const signingKey  = new ethers.SigningKey(privateKey)
  const txBytes     = ethers.getBytes('0x' + txID)
  const sig         = signingKey.sign(txBytes)

  const r = sig.r.slice(2)                                       // 64 hex
  const s = sig.s.slice(2)                                       // 64 hex
  const v = (sig.v - 27).toString(16).padStart(2, '0')          // "00" | "01"
  return r + s + v
}

// ── Balance Queries ───────────────────────────────────────────────────────────
/**
 * Returns TRX balance in sun → converted to TRX (human units).
 * Needed to warn users if bandwidth/energy is too low to send.
 */
export async function getTRXBalance(tronAddress) {
  try {
    const data = await tronGet(`/v1/accounts/${tronAddress}`)
    const sun  = data?.data?.[0]?.balance ?? 0
    return sun / 1_000_000
  } catch {
    return 0
  }
}

/**
 * Returns USDT TRC-20 balance using triggerconstantcontract (read-only call).
 * Falls back to 0 on any error.
 */
export async function getUSDTTRC20Balance(tronAddress) {
  try {
    const ownerHex21 = tronAddressToHex21(tronAddress)           // "41" + 40 hex
    const ownerBody  = tronAddressToBodyHex(tronAddress)         // 40 hex (20 bytes)
    const parameter  = ownerBody.padStart(64, '0')               // ABI pad to 32 bytes

    const data = await tronPost('/wallet/triggerconstantcontract', {
      owner_address:     ownerHex21,
      contract_address:  tronAddressToHex21(USDT_TRC20_CONTRACT),
      function_selector: 'balanceOf(address)',
      parameter,
    })

    const hex = data?.constant_result?.[0]
    if (!hex) return 0
    return Number(BigInt('0x' + hex)) / 10 ** USDT_DECIMALS
  } catch {
    return 0
  }
}

// ── Send USDT TRC-20 ──────────────────────────────────────────────────────────
/**
 * Sends USDT TRC-20 to the given TRON address.
 *
 * @param {string} privateKey      hex private key (0x…)
 * @param {string} fromTronAddress sender TRON address (T…)
 * @param {string} toTronAddress   recipient TRON address (T…)
 * @param {number|string} amount   human-readable USDT (e.g. 50 = 50 USDT)
 * @returns {{ txID: string, result: boolean }}
 */
export async function sendUSDTTRC20(privateKey, fromTronAddress, toTronAddress, amount) {
  const amountUnits = Math.round(parseFloat(amount) * 10 ** USDT_DECIMALS)
  const fromHex21   = tronAddressToHex21(fromTronAddress)
  const parameter   = encodeTransferParams(toTronAddress, amountUnits)

  // 1. Build unsigned transaction
  const createResp = await tronPost('/wallet/triggersmartcontract', {
    owner_address:     fromHex21,
    contract_address:  tronAddressToHex21(USDT_TRC20_CONTRACT),
    function_selector: 'transfer(address,uint256)',
    parameter,
    fee_limit:   40_000_000,   // 40 TRX max energy
    call_value:  0,
  })

  if (!createResp?.transaction?.txID) {
    throw new Error(createResp?.result?.message || 'Failed to build TRON transaction')
  }

  const txn = createResp.transaction

  // 2. Sign
  const signature = signTronTx(privateKey, txn.txID)

  // 3. Broadcast
  const broadcastResp = await tronPost('/wallet/broadcasttransaction', {
    ...txn,
    signature: [signature],
  })

  if (!broadcastResp?.result) {
    throw new Error(broadcastResp?.message || 'TRON broadcast failed')
  }

  return { txID: txn.txID, result: true }
}

// ── Recent TRC-20 Transactions ────────────────────────────────────────────────
/**
 * Fetches recent USDT TRC-20 transactions for the given address.
 * Returns a simplified array for UI display.
 */
export async function getRecentTRC20Txs(tronAddress, limit = 10) {
  try {
    const usdtContractHex = tronAddressToHex21(USDT_TRC20_CONTRACT)
    const data = await tronGet(
      `/v1/accounts/${tronAddress}/transactions/trc20?limit=${limit}&contract_address=${USDT_TRC20_CONTRACT}`
    )
    return (data?.data ?? []).map(tx => ({
      txID:      tx.transaction_id,
      type:      tx.from === tronAddress ? 'send' : 'receive',
      amount:    Number(BigInt(tx.value ?? '0')) / 10 ** USDT_DECIMALS,
      from:      tx.from,
      to:        tx.to,
      timestamp: tx.block_timestamp,
      symbol:    'USDT',
      network:   'TRC20',
    }))
  } catch {
    return []
  }
}
