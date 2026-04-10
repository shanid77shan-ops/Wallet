/**
 * ethChainService.js
 * Ethereum Mainnet — native ETH and USDT ERC-20 operations.
 * Uses ethers v6 with public JSON-RPC endpoints (no API key required).
 */
import { ethers } from 'ethers'

// ── RPC endpoints (tried in order) ───────────────────────────────────────────
const ETH_RPC_URLS = [
  'https://eth.drpc.org',
  'https://ethereum.publicnode.com',
  'https://1rpc.io/eth',
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
  // Use Alchemy if configured, otherwise fall back to public RPC
  const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY
  if (alchemyKey) {
    return new ethers.AlchemyProvider('mainnet', alchemyKey)
  }
  return new ethers.JsonRpcProvider(ETH_RPC_URLS[0])
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
