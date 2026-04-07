import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import {
  mainnet, polygon, arbitrum, optimism, base, bsc, avalanche,
  arbitrumNova, zkSync, linea, scroll, mantle,
} from '@reown/appkit/networks'

// Get your free Project ID at https://cloud.reown.com
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export const networks = [
  mainnet, polygon, arbitrum, optimism, base, bsc, avalanche,
  arbitrumNova, zkSync, linea, scroll, mantle,
]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
})

export const queryClient = new QueryClient()

// Token contract addresses by chain ID
export const TOKEN_CONTRACTS = {
  // USDT
  'tether': {
    1:     '0xdAC17F958D2ee523a2206206994597C13D831ec7', // ETH
    137:   '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon
    56:    '0x55d398326f99059fF775485246999027B3197955', // BSC
    42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // Arbitrum
    10:    '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // Optimism
    8453:  '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', // Base
    43114: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', // AVAX
  },
  // USDC
  'usd-coin': {
    1:     '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    137:   '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    56:    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    10:    '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    8453:  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  },
  // DAI
  'dai': {
    1:     '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    137:   '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    56:    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    42161: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    10:    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
  // LINK
  'chainlink': {
    1:     '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    137:   '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
    56:    '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
    42161: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
  },
  // MATIC (on ETH as ERC-20)
  'matic-network': {
    1:     '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  },
  // UNI
  'uniswap': {
    1:     '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    137:   '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
    42161: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
  },
  // AAVE
  'aave': {
    1:     '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    137:   '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
    42161: '0xba5DdD1f9d7F570dc94a51479a000E3BCE967196',
  },
  // SHIB
  'shiba-inu': {
    1:     '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  },
  // WBTC
  'wrapped-bitcoin': {
    1:     '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    137:   '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    42161: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  },
}

// Token decimals (most ERC-20 use 18, stablecoins use 6)
export const TOKEN_DECIMALS = {
  'tether':   6,
  'usd-coin': 6,
  'dai':      18,
  'chainlink': 18,
  'matic-network': 18,
  'uniswap':  18,
  'aave':     18,
  'shiba-inu': 18,
  'wrapped-bitcoin': 8,
}

// EVM-compatible coin IDs (native gas tokens)
export const EVM_NATIVE = {
  1:     'ethereum',
  137:   'matic-network',
  56:    'binancecoin',
  43114: 'avalanche-2',
  42161: 'ethereum',   // Arbitrum uses ETH
  10:    'ethereum',   // Optimism uses ETH
  8453:  'ethereum',   // Base uses ETH
}

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'Crypto Wallet',
    description: 'Multi-chain non-custodial wallet',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://cryptowallet.app',
    icons: [],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    onramp: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent':               '#7c3aed',
    '--w3m-border-radius-master': '12px',
    '--w3m-font-family':          'Inter, sans-serif',
  },
})
