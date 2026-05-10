import React, { useState } from 'react';
import Login from './components/Login';
import CustomerEntry from './components/CustomerEntry';
import Recommendations from './components/Recommendations';
import Purchase from './components/Purchase';
import './App.css';

const API = 'http://localhost:3000';

function App() {
  const [screen, setScreen] = useState('login');
  const [token, setToken] = useState('');
  const [shopId] = useState('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
  const [customer, setCustomer] = useState(null);
  const [session, setSession] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <div className="app">
      {screen === 'login' && (
        <Login API={API} onLogin={(t) => { setToken(t); setScreen('customer'); }} />
      )}
      {screen === 'customer' && (
        <CustomerEntry
          API={API}
          token={token}
          shopId={shopId}
          onNext={(cust, sess, recs) => {
            setCustomer(cust);
            setSession(sess);
            setRecommendations(recs);
            setSelectedItems([]);
            setScreen('recommendations');
          }}
        />
      )}
      {screen === 'recommendations' && (
        <Recommendations
          recommendations={recommendations}
          customer={customer}
          initialSelected={selectedItems}
          onPurchase={(selected) => {
            setSelectedItems(selected);
            setScreen('purchase');
          }}
          onBack={() => setScreen('customer')}
        />
      )}
      {screen === 'purchase' && (
        <Purchase
          API={API}
          token={token}
          shopId={shopId}
          customer={customer}
          session={session}
          selectedItems={selectedItems}
          onBack={() => setScreen('recommendations')}
          onDone={() => {
            setSelectedItems([]);
            setScreen('customer');
          }}
        />
      )}
    </div>
  );
}

export default App;