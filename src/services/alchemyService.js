import { JsonRpcProvider, formatEther } from 'ethers'

/**
 * Fetches the real ETH balance of a wallet address on Sepolia Testnet
 * via an Alchemy JSON-RPC provider.
 *
 * Wei → ETH conversion:
 *   provider.getBalance() returns a BigInt in Wei (1 ETH = 1e18 Wei).
 *   ethers formatEther() divides by 1e18 and returns the human-readable ETH string.
 *   We parse that to a JS number so callers can do arithmetic directly.
 *
 * @param {string} address  Ethereum wallet address (0x…)
 * @returns {Promise<number>} Balance in ETH, e.g. 0.4821  (0 if the wallet is empty)
 */
export async function getSepoliaEthBalance(address) {
  const rpcUrl = import.meta.env.VITE_ALCHEMY_SEPOLIA_URL
  if (!rpcUrl) throw new Error('VITE_ALCHEMY_SEPOLIA_URL is not set in .env')
  if (!address) throw new Error('Wallet address is required')

  const provider   = new JsonRpcProvider(rpcUrl)
  const balanceWei = await provider.getBalance(address)  // BigInt, e.g. 482100000000000000n
  const balanceEth = parseFloat(formatEther(balanceWei)) // 0.4821

  return balanceEth // always a number; 0 when wallet is empty
}
