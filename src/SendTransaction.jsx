import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function SendTransaction({ session }) {
  const [amount, setAmount] = useState('');
  const [symbol, setSymbol] = useState('ETH');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: session.user.id, // Links the tx to the logged-in user
          amount: parseFloat(amount),
          symbol: symbol,
          status: 'pending',
          transaction_hash: `0x${Math.random().toString(16).slice(2)}...`, // Mock hash
        },
      ]);

    if (error) {
      alert(error.message);
    } else {
      alert('Transaction Sent!');
      setAmount('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSend} style={{ padding: '20px', background: '#1e1e1e', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Send Crypto</h3>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <select value={symbol} onChange={(e) => setSymbol(e.target.value)} style={{ padding: '8px' }}>
        <option value="ETH">ETH</option>
        <option value="BTC">BTC</option>
        <option value="SOL">SOL</option>
      </select>
      <button type="submit" disabled={loading} style={{ marginLeft: '10px', padding: '8px 16px', cursor: 'pointer' }}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
