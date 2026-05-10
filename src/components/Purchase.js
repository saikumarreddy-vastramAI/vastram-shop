import React, { useState } from 'react';
import axios from 'axios';

function Purchase({ API, token, shopId, customer, session, selectedItems, onBack, onDone }) {
  const [invoice, setInvoice] = useState('');
  const [upi, setUpi] = useState('');
  const [purchasedItems, setPurchasedItems] = useState(
    selectedItems.map(item => ({ ...item, purchased: false }))
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const togglePurchased = (id) => {
    setPurchasedItems(prev =>
      prev.map(item => item.id === id ? { ...item, purchased: !item.purchased } : item)
    );
  };

  const totalAmount = purchasedItems
    .filter(i => i.purchased)
    .reduce((sum, i) => sum + (i.price || 0), 0);

  const handlePurchase = async () => {
    const bought = purchasedItems.filter(i => i.purchased);
    if (bought.length === 0) {
      setError('Please mark at least one saree as purchased.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/customer/purchase`,
        {
          customer_id: customer.id,
          session_id: session?.id,
          shop_id: shopId,
          invoice_number: invoice || `INV-${Date.now()}`,
          total_amount: totalAmount,
          upi_transaction_id: upi || null,
          items: bought.map(i => ({
            catalogue_item_id: i.id,
            price: i.price,
            quantity: 1
          }))
        },
        { headers }
      );
      setWhatsapp(res.data.whatsapp_preview);
      setDone(true);
    } catch (err) {
      setError('Could not record purchase. Please try again.');
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>🎉</div>
          <h2 style={styles.successTitle}>Purchase Recorded!</h2>
          <p style={styles.successSub}>Thank you message ready to send</p>

          <div style={styles.whatsappBox}>
            <div style={styles.whatsappHeader}>
              <span>📱 WhatsApp Message Preview</span>
            </div>
            <p style={styles.whatsappText}>{whatsapp}</p>
          </div>

          <button style={styles.button} onClick={onDone}>
            ← Next Customer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div>
          <h1 style={styles.headerTitle}>🛍️ Record Purchase</h1>
          <p style={styles.headerSub}>{customer?.name || 'Customer'}</p>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Mark Purchased Sarees</h3>
          <p style={styles.hint}>Tap the sarees the customer actually bought</p>

          {purchasedItems.map(item => (
            <div
              key={item.id}
              style={{
                ...styles.itemRow,
                background: item.purchased ? '#E8FFF4' : '#F8F8F8',
                border: item.purchased ? '2px solid #0F7B5C' : '2px solid #eee',
              }}
              onClick={() => togglePurchased(item.id)}
            >
              <div style={styles.itemInfo}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemPrice}>Rs. {item.price?.toLocaleString('en-IN')}</p>
              </div>
              <div style={{
                ...styles.checkbox,
                background: item.purchased ? '#0F7B5C' : 'white',
                border: item.purchased ? '2px solid #0F7B5C' : '2px solid #ccc',
              }}>
                {item.purchased && <span style={{ color: 'white', fontSize: 16 }}>✓</span>}
              </div>
            </div>
          ))}

          {totalAmount > 0 && (
            <div style={styles.totalBox}>
              <span style={styles.totalLabel}>Total Amount</span>
              <span style={styles.totalAmount}>Rs. {totalAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Payment Details</h3>
          <input
            style={styles.input}
            placeholder="Invoice Number (optional)"
            value={invoice}
            onChange={e => setInvoice(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="UPI Transaction ID (optional)"
            value={upi}
            onChange={e => setUpi(e.target.value)}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handlePurchase} disabled={loading}>
          {loading ? 'Recording...' : '✅ Record Purchase'}
        </button>

        <button style={styles.skipButton} onClick={onDone}>
          No Purchase — Next Customer
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#F5F5F5' },
  header: {
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    padding: '20px 24px', color: 'white',
    display: 'flex', alignItems: 'center', gap: 16
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none',
    color: 'white', fontSize: 20, borderRadius: 8,
    padding: '8px 12px', cursor: 'pointer'
  },
  headerTitle: { margin: 0, fontSize: 22, fontWeight: 'bold' },
  headerSub: { margin: '4px 0 0 0', fontSize: 14, opacity: 0.8 },
  content: { padding: 20, maxWidth: 500, margin: '0 auto' },
  card: {
    background: 'white', borderRadius: 16,
    padding: 20, marginBottom: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 8px 0' },
  hint: { fontSize: 13, color: '#888', marginBottom: 16 },
  itemRow: {
    borderRadius: 10, padding: '12px 16px',
    marginBottom: 10, cursor: 'pointer',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', transition: 'all 0.2s'
  },
  itemInfo: {},
  itemName: { margin: 0, fontSize: 15, fontWeight: 'bold', color: '#1A1A2E' },
  itemPrice: { margin: '4px 0 0 0', fontSize: 14, color: '#E86A1A', fontWeight: 'bold' },
  checkbox: {
    width: 28, height: 28, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  totalBox: {
    background: '#F0F4FF', borderRadius: 10,
    padding: '14px 16px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    marginTop: 10
  },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#0F3460' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#E86A1A' },
  input: {
    width: '100%', padding: '12px 14px', marginBottom: 12,
    borderRadius: 10, border: '2px solid #eee', fontSize: 15,
    outline: 'none', boxSizing: 'border-box'
  },
  button: {
    width: '100%', padding: 16,
    background: 'linear-gradient(135deg, #0F7B5C, #16A085)',
    color: 'white', border: 'none', borderRadius: 10,
    fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginBottom: 10
  },
  skipButton: {
    width: '100%', padding: 12, background: 'none',
    color: '#888', border: '2px solid #eee', borderRadius: 10,
    fontSize: 14, cursor: 'pointer', marginBottom: 20
  },
  error: { color: '#D84040', fontSize: 14, marginBottom: 10 },
  successCard: {
    maxWidth: 500, margin: '40px auto',
    background: 'white', borderRadius: 20,
    padding: 32, textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 8px 0' },
  successSub: { fontSize: 15, color: '#888', marginBottom: 24 },
  whatsappBox: {
    background: '#E8FFF4', borderRadius: 12,
    overflow: 'hidden', marginBottom: 24, textAlign: 'left'
  },
  whatsappHeader: {
    background: '#0F7B5C', color: 'white',
    padding: '10px 16px', fontSize: 14, fontWeight: 'bold'
  },
  whatsappText: {
    padding: '14px 16px', fontSize: 14,
    color: '#1A1A2E', lineHeight: 1.6,
    whiteSpace: 'pre-line', margin: 0
  },
};

export default Purchase;