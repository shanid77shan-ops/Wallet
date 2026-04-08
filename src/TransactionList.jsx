import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function TransactionList() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // 1. Initial fetch of data
    fetchTransactions()

    // 2. Realtime subscription to refresh on any DB change
    const channel = supabase
      .channel('realtime-transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          console.log('Change received!', payload)
          fetchTransactions()
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchTransactions() {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setTransactions(data)
  }

  return (
    <div>
      <h2>History</h2>
      {transactions.map((tx) => (
        <div key={tx.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
          <strong>
            {tx.amount} {tx.symbol}
          </strong>{' '}
          - <span>{tx.status}</span>
        </div>
      ))}
    </div>
  )
}
