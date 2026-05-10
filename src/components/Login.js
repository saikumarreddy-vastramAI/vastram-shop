import React, { useState } from 'react';
import axios from 'axios';

function Login({ API, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      onLogin(res.data.access_token);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>👗</div>
        <h1 style={styles.title}>Vastram AI</h1>
        <p style={styles.subtitle}>Shop Assistant</p>

        <input
          style={styles.input}
          type="email"
          placeholder="Shop Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleLogin()}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={styles.hint}>Vastram AI — Powered by Claude</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: 'white',
    borderRadius: 20,
    padding: 40,
    width: 380,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  logo: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 5px 0' },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 30 },
  input: {
    width: '100%',
    padding: '14px 16px',
    marginBottom: 16,
    borderRadius: 10,
    border: '2px solid #eee',
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontSize: 18,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: 8,
  },
  error: { color: '#D84040', fontSize: 14, marginBottom: 10 },
  hint: { color: '#aaa', fontSize: 12, marginTop: 20 },
};

export default Login;