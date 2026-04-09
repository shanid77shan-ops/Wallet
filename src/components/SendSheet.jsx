// --- Update these two sections inside your existing SendSheet.jsx ---

// 1. Update the On-chain Success Effect
useEffect(() => {
  if (!realTxHash || !selectedCoin || !selectedNetwork || !toAddress || !amount) return

  const recordTx = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('transactions').insert([{
      user_id: user.id,
      amount: amount.toString(),
      symbol: selectedCoin.symbol,
      from_address: address,
      to_address: toAddress,
      transaction_hash: realTxHash,
      network: selectedNetwork.name,
      status: isConfirmed ? 'confirmed' : 'pending'
    }])
  }
  recordTx()
}, [isConfirmed, realTxHash])

// 2. Update the doMockSend function
const doMockSend = async () => {
  const mockHash = `mock_${Math.random().toString(36).substring(7)}`
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    await supabase.from('transactions').insert([{
      user_id: user.id,
      amount: amount,
      symbol: selectedCoin.symbol,
      to_address: toAddress,
      transaction_hash: mockHash,
      network: selectedNetwork.name,
      status: 'confirmed'
    }])
  }
  setMockTxHash(mockHash)
  setSent(true)
}