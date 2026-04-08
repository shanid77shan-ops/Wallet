import { JsonRpcProvider, formatEther } from 'ethers'

/**
 * Fetches the real-time ETH balance of a wallet address on Sepolia Testnet
 * using an Alchemy RPC provider via ethers.js.
 *
 * @param {string} address - Ethereum wallet address (0x...)
 * @returns {Promise<string>} Balance in ETH as a string (e.g. "0.482100")
 */
export async function getSepoliaEthBalance(address) {
  const rpcUrl = import.meta.env.VITE_ALCHEMY_SEPOLIA_URL
  if (!rpcUrl) throw new Error('VITE_ALCHEMY_SEPOLIA_URL is not configured in .env')
  if (!address) throw new Error('Wallet address is required')

  const provider = new JsonRpcProvider(rpcUrl)
  const balanceWei = await provider.getBalance(address)
  return formatEther(balanceWei) // Wei → ETH string, e.g. "0.482100"
}
