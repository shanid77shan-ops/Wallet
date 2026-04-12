/**
 * ethChainService.js
 * Ethereum Mainnet — native ETH and USDT ERC-20 operations.
 * Uses ethers v6 with public JSON-RPC endpoints (no API key required).
 */
import { ethers } from 'ethers'

// ── RPC endpoints (tried in order) ───────────────────────────────────────────
const ETH_RPC_URLS = [
  'https://cloudflare-eth.com',
  'https://ethereum.publicnode.com',
  'https://rpc.ankr.com/eth',
]

// ── USDT ERC-20 contract (Ethereum Mainnet) ───────────────────────────────────
export const USDT_ERC20_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
const USDT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)',
  'function decimals() view returns (uint8)',
]
const USDT_DECIMALS = 6

// ── Provider Factory ──────────────────────────────────────────────────────────
function getProvider() {
  const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY
  if (alchemyKey) return new ethers.AlchemyProvider('mainnet', alchemyKey)

  // FallbackProvider tries each URL in order, uses quorum=1 (first success wins)
  const providers = ETH_RPC_URLS.map((url, i) => ({
    provider: new ethers.JsonRpcProvider(url, 1, { staticNetwork: ethers.Network.from(1) }),
    priority: i,
    weight:   1,
    stallTimeout: 2000,
  }))
  return new ethers.FallbackProvider(providers, 1, { quorum: 1 })
}

// ── Balance Queries ───────────────────────────────────────────────────────────
/** Returns ETH balance in ether units (e.g. "0.0421"). */
export async function getETHBalance(address) {
  const provider = getProvider()
  const raw = await provider.getBalance(address)
  return parseFloat(ethers.formatEther(raw))
}

/** Returns USDT ERC-20 balance (6-decimal token → human units). */
export async function getUSDTERC20Balance(address) {
  const provider = getProvider()
  const contract = new ethers.Contract(USDT_ERC20_ADDRESS, USDT_ABI, provider)
  const raw = await contract.balanceOf(address)
  return parseFloat(ethers.formatUnits(raw, USDT_DECIMALS))
}

// ── Transaction Builders ──────────────────────────────────────────────────────
/**
 * Send ETH.
 * @param {string} privateKey  hex private key (0x…)
 * @param {string} toAddress   recipient ETH address
 * @param {string|number} amount  ETH amount (human units)
 * @returns {ethers.TransactionResponse}
 */
export async function sendETH(privateKey, toAddress, amount) {
  const provider = getProvider()
  const signer   = new ethers.Wallet(privateKey, provider)

  const feeData = await provider.getFeeData()
  const tx = await signer.sendTransaction({
    to:       toAddress,
    value:    ethers.parseEther(String(amount)),
    maxFeePerGas:         feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
  })
  return tx
}

/**
 * Send USDT ERC-20.
 * @param {string} privateKey  hex private key (0x…)
 * @param {string} toAddress   recipient ETH address
 * @param {string|number} amount  USDT amount (human units, e.g. 100.50)
 * @returns {ethers.TransactionResponse}
 */
export async function sendUSDTERC20(privateKey, toAddress, amount) {
  const provider = getProvider()
  const signer   = new ethers.Wallet(privateKey, provider)
  const contract = new ethers.Contract(USDT_ERC20_ADDRESS, USDT_ABI, signer)

  const amountUnits = ethers.parseUnits(String(amount), USDT_DECIMALS)
  const tx = await contract.transfer(toAddress, amountUnits)
  return tx
}

// ── Transaction History (Etherscan API v2) ───────────────────────────────────
const ETHERSCAN_BASE = 'https://api.etherscan.io/v2/api?chainid=1'

function etherscanKey() {
  return import.meta.env.VITE_ETHERSCAN_KEY ?? ''
}

function etherscanUrl(params) {
  const key = etherscanKey()
  const qs  = new URLSearchParams({ ...params, ...(key ? { apikey: key } : {}) })
  return `${ETHERSCAN_BASE}&${qs}`
}

/**
 * Fetch recent normal ETH transactions for an address.
 * Returns array normalised to the app's txHistory shape.
 */
export async function getRecentETHTxs(address, limit = 20) {
  const url = etherscanUrl({
    module:  'account',
    action:  'txlist',
    address,
    sort:    'desc',
    page:    1,
    offset:  limit,
  })
  const res  = await fetch(url)
  const json = await res.json()
  if (json.status !== '1' || !Array.isArray(json.result)) return []

  const myAddr = address.toLowerCase()
  return json.result
    .filter(tx => tx.isError === '0' && parseFloat(tx.value) > 0)
    .map(tx => ({
      txID:      tx.hash,
      type:      tx.from.toLowerCase() === myAddr ? 'send' : 'receive',
      amount:    parseFloat(ethers.formatEther(tx.value)),
      symbol:    'ETH',
      network:   'Ethereum',
      to:        tx.to,
      from:      tx.from,
      timestamp: parseInt(tx.timeStamp) * 1000,
    }))
}

/**
 * Fetch recent USDT ERC-20 token transfers for an address.
 * Returns array normalised to the app's txHistory shape.
 */
export async function getRecentUSDTERC20Txs(address, limit = 20) {
  const url = etherscanUrl({
    module:          'account',
    action:          'tokentx',
    address,
    contractaddress: USDT_ERC20_ADDRESS,
    sort:            'desc',
    page:            1,
    offset:          limit,
  })
  const res  = await fetch(url)
  const json = await res.json()
  if (json.status !== '1' || !Array.isArray(json.result)) return []

  const myAddr = address.toLowerCase()
  return json.result.map(tx => ({
    txID:      tx.hash,
    type:      tx.from.toLowerCase() === myAddr ? 'send' : 'receive',
    amount:    parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || 6)),
    symbol:    'USDT',
    network:   'ERC-20',
    to:        tx.to,
    from:      tx.from,
    timestamp: parseInt(tx.timeStamp) * 1000,
  }))
}

// ── Gas Estimate ──────────────────────────────────────────────────────────────
/** Returns estimated gas fee in ETH for a USDT ERC-20 transfer. */
export async function estimateUSDTGas(fromAddress) {
  try {
    const provider  = getProvider()
    const contract  = new ethers.Contract(USDT_ERC20_ADDRESS, USDT_ABI, provider)
    const feeData   = await provider.getFeeData()
    const gasLimit  = await contract.transfer.estimateGas(
      fromAddress, // dummy "to" — same address for estimate
      ethers.parseUnits('1', USDT_DECIMALS),
      { from: fromAddress }
    )
    const gasFee = gasLimit * (feeData.maxFeePerGas ?? feeData.gasPrice ?? 0n)
    return parseFloat(ethers.formatEther(gasFee))
  } catch {
    return 0
  }
}
