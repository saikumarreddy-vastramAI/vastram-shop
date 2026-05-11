import React, { useState } from 'react';
import axios from 'axios';

function CustomerEntry({ API, token, shopId, onNext, onDashboard }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [skinTone, setSkinTone] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const findCustomer = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/customer/find-or-create`,
        { phone, name, age: age ? parseInt(age) : null, skin_tone: skinTone, body_type: bodyType },
        { headers }
      );
      setCustomerInfo(res.data);
      if (res.data.customer.skin_tone) setSkinTone(res.data.customer.skin_tone);
      if (res.data.customer.body_type) setBodyType(res.data.customer.body_type);
      if (res.data.customer.age) setAge(res.data.customer.age.toString());
      if (res.data.customer.name) setName(res.data.customer.name);
    } catch (err) {
      setError('Could not find customer. Please try again.');
    }
    setLoading(false);
  };

  const getRecommendations = async () => {
    if (!occasion) { setError('Please select an occasion.'); return; }
    if (!skinTone) { setError('Please select skin tone.'); return; }
    setLoading(true);
    setError('');
    try {
      const sessRes = await axios.post(`${API}/api/customer/session`,
        { customer_id: customerInfo.customer.id, shop_id: shopId, occasion, budget: budget ? parseInt(budget) : null, language },
        { headers }
      );
      const recRes = await axios.post(`${API}/api/shop/recommend`, {
        shop_id: shopId,
        skin_tone: skinTone,
        body_type: bodyType,
        occasion,
        budget: budget ? parseInt(budget) : null,
        language,
        customer_id: customerInfo.customer.id
      });
      onNext(customerInfo.customer, sessRes.data.session, recRes.data.recommendations);
    } catch (err) {
      setError('Could not get recommendations. Please try again.');
    }
    setLoading(false);
  };

  const Label = ({ text, required }) => (
    <p style={styles.label}>{text}{required && <span style={styles.required}> *</span>}</p>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>👗 Vastram AI</h1>
          <p style={styles.headerSub}>Sundari Sarees — Hyderabad</p>
        </div>
        <button style={styles.dashboardBtn} onClick={onDashboard}>📊 Dashboard</button>
      </div>

      <div style={styles.content}>
        {!customerInfo ? (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>New Customer</h2>
            <p style={styles.cardSub}>Enter mobile number to begin</p>

            <Label text="Mobile Number" required />
            <input style={styles.input} type="tel" placeholder="10-digit mobile number"
              value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} />

            <Label text="Customer Name" />
            <input style={styles.input} type="text" placeholder="Optional"
              value={name} onChange={e => setName(e.target.value)} />

            <Label text="Age" />
            <input style={styles.input} type="number" placeholder="Optional"
              value={age} onChange={e => setAge(e.target.value)} />

            {error && <p style={styles.error}>{error}</p>}

            <button style={styles.button} onClick={findCustomer} disabled={loading}>
              {loading ? 'Finding...' : 'Find / Create Customer'}
            </button>
          </div>
        ) : (
          <div style={styles.card}>
            <div style={styles.customerBadge}>
              {customerInfo.status === 'returning'
                ? `👋 Welcome back ${customerInfo.customer.name || 'Customer'}! Visit #${customerInfo.customer.total_visits}`
                : `✨ New Customer — ${customerInfo.customer.name || 'Welcome!'}`}
            </div>

            {customerInfo.purchase_history?.length > 0 && (
              <div style={styles.historyBox}>
                <p style={styles.historyTitle}>🛍️ Previous Purchases: {customerInfo.total_purchases}</p>
              </div>
            )}

            <h3 style={styles.sectionTitle}>Style Details</h3>

            <Label text="Skin Tone" required />
            <select style={styles.select} value={skinTone} onChange={e => setSkinTone(e.target.value)}>
              <option value="">Select Skin Tone</option>
              <option value="fair">Fair / Light</option>
              <option value="wheatish">Wheatish</option>
              <option value="medium">Medium</option>
              <option value="dusky">Dusky / Wheatish Brown</option>
              <option value="dark">Dark / Deep</option>
            </select>

            <Label text="Body Type" />
            <select style={styles.select} value={bodyType} onChange={e => setBodyType(e.target.value)}>
              <option value="">Select Body Type</option>
              <option value="petite">Petite / Short</option>
              <option value="slim">Slim</option>
              <option value="regular">Regular / Average</option>
              <option value="athletic">Athletic</option>
              <option value="plus">Plus Size / Curvy</option>
            </select>

            <Label text="Occasion" required />
            <select style={styles.select} value={occasion} onChange={e => setOccasion(e.target.value)}>
              <option value="">Select Occasion</option>
              <optgroup label="── Weddings ──">
                <option value="wedding">Wedding — Bride</option>
                <option value="wedding reception">Wedding — Reception</option>
                <option value="wedding guest">Wedding — Guest</option>
                <option value="engagement">Engagement Ceremony</option>
                <option value="mehendi">Mehendi / Haldi Function</option>
                <option value="sangeet">Sangeet Night</option>
              </optgroup>
              <optgroup label="── Telugu & South Indian Festivals ──">
                <option value="Ugadi festival">Ugadi (Telugu New Year)</option>
                <option value="Dasara festival">Dasara / Vijayadasami</option>
                <option value="Diwali festival">Diwali / Deepavali</option>
                <option value="Sankranti festival">Makar Sankranti / Pongal</option>
                <option value="Bonalu festival">Bonalu (Hyderabad)</option>
                <option value="Bathukamma festival">Bathukamma (Telangana)</option>
                <option value="Vinayaka Chaturthi festival">Vinayaka Chaturthi / Ganesh</option>
                <option value="Varalakshmi Vratam festival">Varalakshmi Vratam</option>
                <option value="Navratri festival">Navratri / Garba</option>
              </optgroup>
              <optgroup label="── North Indian Festivals ──">
                <option value="Karva Chauth festival">Karva Chauth</option>
                <option value="Teej festival">Teej</option>
                <option value="Holi festival">Holi</option>
                <option value="Eid festival">Eid</option>
              </optgroup>
              <optgroup label="── Religious & Temple ──">
                <option value="temple visit">Temple Visit / Pooja</option>
                <option value="griha pravesham">Griha Pravesham / Housewarming</option>
                <option value="baby shower">Baby Shower / Seemantham</option>
                <option value="naming ceremony">Naming Ceremony</option>
                <option value="upanayanam">Upanayanam / Thread Ceremony</option>
              </optgroup>
              <optgroup label="── Work & Daily ──">
                <option value="office">Office / Work</option>
                <option value="casual daily">Casual / Daily Wear</option>
                <option value="college">College</option>
              </optgroup>
              <optgroup label="── Social Events ──">
                <option value="party">Party / Get-together</option>
                <option value="birthday">Birthday Celebration</option>
                <option value="anniversary">Anniversary</option>
                <option value="farewell">Farewell / Retirement</option>
                <option value="kitty party">Kitty Party / Ladies Meet</option>
              </optgroup>
            </select>

            <Label text="Budget (Rs.)" />
            <input style={styles.input} type="number" placeholder="e.g. 5000 or 15000 (optional)"
              value={budget} onChange={e => setBudget(e.target.value)} />

            <Label text="Preferred Language" />
            <select style={styles.select} value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="english">English</option>
              <option value="telugu">Telugu</option>
              <option value="hindi">Hindi</option>
            </select>

            {error && <p style={styles.error}>{error}</p>}

            <button style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
              onClick={getRecommendations} disabled={loading}>
              {loading ? '✨ Getting AI Recommendations...' : '✨ Get Saree Recommendations'}
            </button>

            <button style={styles.backButton} onClick={() => {
              setCustomerInfo(null); setPhone(''); setName(''); setAge('');
            }}>
              ← New Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#F5F5F5' },
  header: {
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    padding: '20px 24px', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  headerTitle: { margin: 0, fontSize: 24, fontWeight: 'bold' },
  headerSub: { margin: '4px 0 0 0', fontSize: 14, opacity: 0.8 },
  dashboardBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none',
    color: 'white', fontSize: 14, borderRadius: 8,
    padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold'
  },
  content: { padding: 20, maxWidth: 500, margin: '0 auto' },
  card: { background: 'white', borderRadius: 16, padding: 24, marginTop: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 6px 0' },
  cardSub: { fontSize: 14, color: '#888', marginBottom: 20 },
  customerBadge: {
    background: 'linear-gradient(135deg, #0F7B5C, #16A085)',
    color: 'white', borderRadius: 10, padding: '12px 16px',
    fontSize: 15, fontWeight: 'bold', marginBottom: 16, textAlign: 'center'
  },
  historyBox: { background: '#F0F4FF', borderRadius: 8, padding: '10px 14px', marginBottom: 16 },
  historyTitle: { margin: 0, fontSize: 14, color: '#0F3460', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 4, marginTop: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', margin: '0 0 6px 0' },
  required: { color: '#D84040' },
  input: {
    width: '100%', padding: '12px 14px', marginBottom: 16,
    borderRadius: 10, border: '2px solid #eee', fontSize: 15,
    outline: 'none', boxSizing: 'border-box'
  },
  select: {
    width: '100%', padding: '12px 14px', marginBottom: 16,
    borderRadius: 10, border: '2px solid #eee', fontSize: 15,
    outline: 'none', boxSizing: 'border-box', background: 'white'
  },
  button: {
    width: '100%', padding: 16,
    background: 'linear-gradient(135deg, #E86A1A, #C0392B)',
    color: 'white', border: 'none', borderRadius: 10,
    fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginBottom: 10
  },
  backButton: {
    width: '100%', padding: 12, background: 'none',
    color: '#888', border: '2px solid #eee', borderRadius: 10,
    fontSize: 14, cursor: 'pointer'
  },
  error: { color: '#D84040', fontSize: 14, marginBottom: 10 },
};

export default CustomerEntry;