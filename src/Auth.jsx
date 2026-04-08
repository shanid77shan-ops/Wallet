import { useState } from 'react';
import { supabase } from './supabaseClient'; // The file where you put your API key

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else if (isSignUp) {
      alert('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isSignUp ? 'Create Wallet Account' : 'Welcome Back'}</h2>
        <form onSubmit={handleAuth} style={styles.form}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        
        <p onClick={() => setIsSignUp(!isSignUp)} style={styles.toggleText}>
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: 'white' },
  card: { padding: '2rem', backgroundColor: '#1e1e1e', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', width: '350px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white' },
  button: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#0070f3', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  toggleText: { marginTop: '1rem', fontSize: '0.9rem', color: '#aaa', cursor: 'pointer' }
};
