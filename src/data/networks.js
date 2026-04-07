// Coin IDs match src/data/coins.js (CoinGecko IDs used as local IDs)

const ETH = {
  id: 'eth-mainnet', name: 'Ethereum', shortName: 'ERC-20', color: '#627eea',
  fee: '~$3.50', feeLabel: 'Medium', confirmations: '~2 min',
  address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
}
const ARBITRUM = {
  id: 'arbitrum', name: 'Arbitrum One', shortName: 'ARB', color: '#12aaff',
  fee: '~$0.10', feeLabel: 'Low', confirmations: 'Instant',
  address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
}
const OPTIMISM = {
  id: 'optimism', name: 'Optimism', shortName: 'OP', color: '#ff0420',
  fee: '~$0.15', feeLabel: 'Low', confirmations: 'Instant',
  address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
}
const POLYGON = {
  id: 'polygon', name: 'Polygon', shortName: 'MATIC', color: '#8247e5',
  fee: '~$0.01', feeLabel: 'Very Low', confirmations: '~5 min',
  address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
}
const BASE = {
  id: 'base', name: 'Base', shortName: 'BASE', color: '#0052ff',
  fee: '~$0.05', feeLabel: 'Low', confirmations: 'Instant',
  address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
}
const BSC = {
  id: 'bsc', name: 'BNB Smart Chain', shortName: 'BEP-20', color: '#f3ba2f',
  fee: '~$0.20', feeLabel: 'Low', confirmations: '~15 sec',
  address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
}
const TRON = {
  id: 'tron', name: 'Tron', shortName: 'TRC-20', color: '#eb0029',
  fee: '~$1.00', feeLabel: 'Medium', confirmations: '~1 min',
  address: 'TQn9Y2khDD95bJY2KDXCy8iEFLdGhtzFjp',
}
const SOLANA_NET = {
  id: 'solana', name: 'Solana', shortName: 'SPL', color: '#9945ff',
  fee: '~$0.001', feeLabel: 'Very Low', confirmations: '~400ms',
  address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
}
const AVAX_C = {
  id: 'avax-c', name: 'Avalanche C-Chain', shortName: 'C-Chain', color: '#e84142',
  fee: '~$0.05', feeLabel: 'Low', confirmations: '~2 sec',
  address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
}
const TON = {
  id: 'ton', name: 'TON', shortName: 'TON', color: '#0088cc',
  fee: '~$0.05', feeLabel: 'Low', confirmations: '~5 sec',
  address: 'UQBvI0aFLnw2QbZgjMPCLRdtRHxhUyinQudg6sdiohIwg5jL',
}
const OPBNB = {
  id: 'opbnb', name: 'opBNB', shortName: 'opBNB', color: '#f3ba2f',
  fee: '~$0.001', feeLabel: 'Very Low', confirmations: 'Instant',
  address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
}

export const COIN_NETWORKS = {
  bitcoin: [
    {
      id: 'bitcoin', name: 'Bitcoin', shortName: 'BTC', color: '#f7931a',
      fee: '~$1.20', feeLabel: 'Medium', confirmations: '~30 min',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    },
    {
      id: 'bitcoin-lightning', name: 'Lightning Network', shortName: 'LN', color: '#f7931a',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: 'Instant',
      address: 'lnbc1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyq',
    },
  ],
  ethereum: [ETH, ARBITRUM, OPTIMISM, POLYGON, BASE, TRON, BSC],
  tether: [TRON, ETH, BSC, SOLANA_NET, POLYGON, AVAX_C, ARBITRUM, OPTIMISM, BASE, TON,
    {
      id: 'ton', name: 'TON', shortName: 'TON', color: '#0088cc',
      fee: '~$0.05', feeLabel: 'Low', confirmations: '~5 sec',
      address: 'UQBvI0aFLnw2QbZgjMPCLRdtRHxhUyinQudg6sdiohIwg5jL',
    },
  ],
  binancecoin: [BSC, ETH, OPBNB],
  solana: [SOLANA_NET],
  'usd-coin': [ETH, SOLANA_NET, POLYGON, BASE, ARBITRUM, OPTIMISM, BSC, AVAX_C,
    {
      id: 'stellar-net', name: 'Stellar', shortName: 'XLM', color: '#7d7d7d',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '~5 sec',
      address: 'GDRFA4DO3AOVQK4HG4LHGLJJ3SVJSPQFYIBI4LPKDPQM6FWHFGGX4ZM',
    },
  ],
  ripple: [
    {
      id: 'xrp', name: 'XRP Ledger', shortName: 'XRP', color: '#346aa9',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '~4 sec',
      address: 'rN7n3473SaZBCG4dFL83w7PB5AMgMFGnid',
    },
  ],
  cardano: [
    {
      id: 'cardano', name: 'Cardano', shortName: 'ADA', color: '#0033ad',
      fee: '~$0.17', feeLabel: 'Low', confirmations: '~5 min',
      address: 'addr1qxy2kgdygjrsqtzq2n0yrf24p83kkfjhx0wlh9z8zxqhptvlk4xnmkhkn7x9f8d3r',
    },
  ],
  dogecoin: [
    {
      id: 'dogecoin', name: 'Dogecoin', shortName: 'DOGE', color: '#c2a633',
      fee: '~$0.01', feeLabel: 'Very Low', confirmations: '~1 min',
      address: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
    },
  ],
  'avalanche-2': [AVAX_C,
    {
      id: 'avax-x', name: 'Avalanche X-Chain', shortName: 'X-Chain', color: '#e84142',
      fee: '~$0.01', feeLabel: 'Very Low', confirmations: '~2 sec',
      address: 'X-avax1qlbq77mxzx3p4uqgkjk8hxrk0qnp4zvn6zz0m',
    },
  ],
  polkadot: [
    {
      id: 'polkadot', name: 'Polkadot', shortName: 'DOT', color: '#e6007a',
      fee: '~$0.10', feeLabel: 'Low', confirmations: '~6 sec',
      address: '14E5nqKAp3oAJcmzgs25ud423X7RuJpy3CCUh3MFmQt1kBW',
    },
  ],
  chainlink: [ETH, POLYGON, ARBITRUM, BSC, BASE],
  'matic-network': [POLYGON, ETH, BSC],
  litecoin: [
    {
      id: 'litecoin', name: 'Litecoin', shortName: 'LTC', color: '#a6a9aa',
      fee: '~$0.01', feeLabel: 'Very Low', confirmations: '~2.5 min',
      address: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    },
  ],
  'shiba-inu': [ETH, POLYGON, BSC],
  tron: [
    {
      id: 'tron-mainnet', name: 'Tron', shortName: 'TRX', color: '#eb0029',
      fee: '~$0.50', feeLabel: 'Low', confirmations: '~1 min',
      address: 'TQn9Y2khDD95bJY2KDXCy8iEFLdGhtzFjp',
    },
  ],
  dai: [ETH, POLYGON, BASE, ARBITRUM, OPTIMISM, BSC],
  cosmos: [
    {
      id: 'cosmos', name: 'Cosmos Hub', shortName: 'ATOM', color: '#6f7390',
      fee: '~$0.01', feeLabel: 'Very Low', confirmations: '~6 sec',
      address: 'cosmos1xyq2kgdygjrsqtzq2n0yrf24p83kkfjhx0wlh',
    },
  ],
  stellar: [
    {
      id: 'stellar', name: 'Stellar', shortName: 'XLM', color: '#7d7d7d',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '~5 sec',
      address: 'GDRFA4DO3AOVQK4HG4LHGLJJ3SVJSPQFYIBI4LPKDPQM6FWHFGGX4ZM',
    },
  ],
  monero: [
    {
      id: 'monero', name: 'Monero', shortName: 'XMR', color: '#ff6600',
      fee: '~$0.04', feeLabel: 'Very Low', confirmations: '~20 min',
      address: '48edfHu7V9Z84YzzMa6fUueoELZ9ZRXq9VetWzYGzKt52XU5xvqgfP13J1xHkDFDaR3q4FEPHv2P9FhFJkDjB8AG',
    },
  ],
  'ethereum-classic': [
    {
      id: 'etc', name: 'Ethereum Classic', shortName: 'ETC', color: '#328332',
      fee: '~$0.05', feeLabel: 'Low', confirmations: '~13 sec',
      address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
    },
  ],
  near: [
    {
      id: 'near', name: 'NEAR Protocol', shortName: 'NEAR', color: '#00c1de',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '~2 sec',
      address: 'shan.near',
    },
  ],
  aptos: [
    {
      id: 'aptos', name: 'Aptos', shortName: 'APT', color: '#00c2a8',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '< 1 sec',
      address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
    },
  ],
  arbitrum: [ARBITRUM],
  optimism: [OPTIMISM],
  uniswap: [ETH, POLYGON, ARBITRUM, OPTIMISM, BASE],
  aave: [ETH, POLYGON, ARBITRUM, OPTIMISM, BASE],
  pepe: [ETH, BSC],
  sui: [
    {
      id: 'sui', name: 'Sui', shortName: 'SUI', color: '#6fbcf0',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '< 1 sec',
      address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
    },
  ],
  'wrapped-bitcoin': [ETH, POLYGON, ARBITRUM, BSC],
  'hedera-hashgraph': [
    {
      id: 'hedera', name: 'Hedera', shortName: 'HBAR', color: '#3a3a3a',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '~3 sec',
      address: '0.0.1234567',
    },
  ],
  'internet-computer': [
    {
      id: 'icp', name: 'Internet Computer', shortName: 'ICP', color: '#29abe2',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '~2 sec',
      address: 'aaaaa-aa',
    },
  ],
  filecoin: [
    {
      id: 'filecoin', name: 'Filecoin', shortName: 'FIL', color: '#0090ff',
      fee: '~$0.01', feeLabel: 'Very Low', confirmations: '~30 sec',
      address: 'f1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za',
    },
  ],
  vechain: [
    {
      id: 'vechain', name: 'VeChain', shortName: 'VET', color: '#15bdff',
      fee: '~$0.01', feeLabel: 'Very Low', confirmations: '~10 sec',
      address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
    },
  ],
  'the-graph': [ETH, POLYGON, ARBITRUM],
  maker: [ETH],
  'lido-dao': [ETH],
  'injective-protocol': [
    {
      id: 'injective', name: 'Injective', shortName: 'INJ', color: '#00b4d8',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '< 1 sec',
      address: 'inj14e5nqkap3oajcmzgs25ud423x7rujpy3zarca',
    },
    ETH, BSC,
  ],
  'render-token': [ETH, SOLANA_NET, POLYGON],
  'axie-infinity': [
    {
      id: 'ronin', name: 'Ronin', shortName: 'RON', color: '#0055d5',
      fee: '< $0.01', feeLabel: 'Very Low', confirmations: '~3 sec',
      address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
    },
    ETH,
  ],
}

export function getNetworks(coinId) {
  return COIN_NETWORKS[coinId] ?? [
    {
      id: 'eth-mainnet', name: 'Ethereum', shortName: 'ERC-20', color: '#627eea',
      fee: '~$3.50', feeLabel: 'Medium', confirmations: '~2 min',
      address: '0x742d35Cc6634C0532925a3b8D4C6b3e2a9c7F1d3',
    },
  ]
}
