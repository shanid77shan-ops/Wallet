import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Home() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    async function getTransactions() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!error) setTransactions(data)
      }
    }

    getTransactions()
  }, [])

  // ... rest of your UI code using the {transactions} array
}