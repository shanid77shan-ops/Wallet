// Static metadata only — live price fields are fetched from CoinGecko
export const coins = [
  { id: 'bitcoin',   symbol: 'BTC',  name: 'Bitcoin',    logo: '₿', color: '#f7931a', balance: 0.4821 },
  { id: 'ethereum',  symbol: 'ETH',  name: 'Ethereum',   logo: 'Ξ', color: '#627eea', balance: 2.145  },
  { id: 'solana',    symbol: 'SOL',  name: 'Solana',     logo: '◎', color: '#9945ff', balance: 12.5   },
  { id: 'bnb',       symbol: 'BNB',  name: 'BNB',        logo: 'B', color: '#f3ba2f', balance: 5.23   },
  { id: 'cardano',   symbol: 'ADA',  name: 'Cardano',    logo: '₳', color: '#0033ad', balance: 1500   },
  { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche',  logo: 'A', color: '#e84142', balance: 45     },
  { id: 'polkadot',  symbol: 'DOT',  name: 'Polkadot',   logo: '●', color: '#e6007a', balance: 0      },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink',  logo: '⬡', color: '#2a5ada', balance: 0      },
]

export const transactions = [
  { id: 1, type: 'receive', coin: 'BTC', amount: 0.05,  value: 3392.13, date: '2026-04-06', from: '1A2b3C...4d5E' },
  { id: 2, type: 'send',    coin: 'ETH', amount: 0.5,   value: 1760.90, date: '2026-04-05', to:   '0x7f3a...9b2c' },
  { id: 3, type: 'buy',     coin: 'SOL', amount: 2.5,   value: 460.75,  date: '2026-04-04' },
  { id: 4, type: 'sell',    coin: 'BNB', amount: 1.0,   value: 412.60,  date: '2026-04-03' },
  { id: 5, type: 'receive', coin: 'ADA', amount: 500,   value: 306.0,   date: '2026-04-02', from: 'addr1...xyz' },
]

export const portfolioHistory = [
  { date: 'Mar 8',  value: 42100 },
  { date: 'Mar 15', value: 44800 },
  { date: 'Mar 22', value: 43200 },
  { date: 'Mar 29', value: 47500 },
  { date: 'Apr 1',  value: 46800 },
  { date: 'Apr 4',  value: 49200 },
  { date: 'Apr 7',  value: 51438 },
]
