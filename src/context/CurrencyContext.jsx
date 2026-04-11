import { createContext, useContext, useEffect, useState } from 'react'
import { fetchExchangeRates } from '../services/forexApi'

const STORAGE_KEY = 'xdt_currency'
const DEFAULT_RATES = { INR: 83.2, AED: 3.67 }

export const CURRENCIES = [
  { code: 'USD', symbol: '$',   label: 'US Dollar',   flag: '🇺🇸' },
  { code: 'INR', symbol: '₹',   label: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham',   flag: '🇦🇪' },
]

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? 'USD'
  )
  const [rates, setRates] = useState(DEFAULT_RATES)

  useEffect(() => {
    fetchExchangeRates()
      .then(r => setRates(r))
      .catch(() => {})
  }, [])

  function setCurrency(code) {
    localStorage.setItem(STORAGE_KEY, code)
    setCurrencyState(code)
  }

  function fmt(usdAmount) {
    if (!Number.isFinite(usdAmount)) return '—'
    if (currency === 'INR') {
      const v = usdAmount * rates.INR
      return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    if (currency === 'AED') {
      const v = usdAmount * rates.AED
      return 'AED\u00A0' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    return '$' + usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const activeCurrency = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0]

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, fmt, activeCurrency, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
