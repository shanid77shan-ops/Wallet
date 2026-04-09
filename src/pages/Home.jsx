import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export default function Home() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // Memoize the fetch function so it can be reused safely
  const fetchTransactions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) {
      setTransactions(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // 1. Initial Load
    fetchTransactions()

    // 2. Set up Realtime listener
    // This watches for any INSERT, UPDATE, or DELETE on the transactions table
    const channel = supabase
      .channel('realtime-transactions')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions' 
        },
        (payload) => {
          console.log('Change detected:', payload)
          fetchTransactions() // Auto-refresh the list
        }
      )
      .subscribe()

    // 3. Cleanup listener on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchTransactions])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Recent Transactions</h2>
        <div className="live-indicator">
          <span className="pulse-dot"></span> Live
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading your activity...</div>
      ) : (
        <div className="tx-list">
          {transactions.length === 0 ? (
            <p className="no-data">No transactions found yet.</p>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="tx-item">
                <div className="tx-info">
                  <span className="tx-symbol">{tx.symbol}</span>
                  <span className="tx-date">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="tx-amount-section">
                  <span className="tx-amount">{tx.amount}</span>
                  <span className={`status-badge status-${tx.status.toLowerCase()}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}