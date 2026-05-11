import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ API, token, shopId, onBack }) {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, customersRes] = await Promise.all([
        axios.get(`${API}/api/dashboard/stats?shop_id=${shopId}`, { headers }),
        axios.get(`${API}/api/dashboard/customers?shop_id=${shopId}`, { headers }),
      ]);
      setStats(statsRes.data);
      setCustomers(customersRes.data.customers);
    } catch (err) {
      setError('Could not load dashboard. Please try again.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingIcon}>📊</div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div>
          <h1 style={styles.headerTitle}>📊 Shop Dashboard</h1>
          <p style={styles.headerSub}>Sundari Sarees — Hyderabad</p>
        </div>
        <button style={styles.refreshBtn} onClick={loadDashboard}>🔄</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.content}>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #1A1A2E, #0F3460)' }}>
            <p style={styles.statNumber}>{stats?.total_customers || 0}</p>
            <p style={styles.statLabel}>Total Customers</p>
          </div>
          <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #0F7B5C, #16A085)' }}>
            <p style={styles.statNumber}>{stats?.total_purchases || 0}</p>
            <p style={styles.statLabel}>Total Purchases</p>
          </div>
          <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #E86A1A, #C0392B)' }}>
            <p style={styles.statNumber}>Rs. {(stats?.total_revenue || 0).toLocaleString('en-IN')}</p>
            <p style={styles.statLabel}>Total Revenue</p>
          </div>
          <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #7B2FBE, #5B2D8E)' }}>
            <p style={styles.statNumber}>{stats?.returning_customers || 0}</p>
            <p style={styles.statLabel}>Returning Customers</p>
          </div>
        </div>

        {/* Popular Occasions */}
        {stats?.popular_occasions?.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎉 Popular Occasions</h3>
            <div style={styles.tagRow}>
              {stats.popular_occasions.map((occ, i) => (
                <div key={i} style={styles.occasionTag}>
                  <span style={styles.occasionName}>{occ.occasion}</span>
                  <span style={styles.occasionCount}>{occ.count} visits</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Customers */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>👥 Recent Customers</h3>
          {customers.length === 0 ? (
            <p style={styles.emptyText}>No customers yet.</p>
          ) : (
            customers.map((customer, i) => (
              <div key={i} style={styles.customerRow}>
                <div style={styles.customerAvatar}>
                  {customer.name ? customer.name[0].toUpperCase() : '?'}
                </div>
                <div style={styles.customerInfo}>
                  <p style={styles.customerName}>{customer.name || 'Unknown'}</p>
                  <p style={styles.customerPhone}>📱 {customer.phone}</p>
                  <p style={styles.customerDetails}>
                    {customer.skin_tone} • {customer.body_type} • {customer.total_visits} visit{customer.total_visits > 1 ? 's' : ''}
                  </p>
                </div>
                <div style={styles.customerRight}>
                  <p style={styles.customerPurchases}>{customer.purchase_count || 0} purchases</p>
                  <p style={styles.customerDate}>{new Date(customer.last_visit).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Top Sarees */}
        {stats?.top_sarees?.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👗 Top Selling Sarees</h3>
            {stats.top_sarees.map((saree, i) => (
              <div key={i} style={styles.sareeRow}>
                <div style={styles.sareeRank}>#{i + 1}</div>
                <div style={styles.sareeInfo}>
                  <p style={styles.sareeName}>{saree.name}</p>
                  <p style={styles.sareeDetails}>{saree.color} • {saree.fabric}</p>
                </div>
                <div style={styles.sareeRight}>
                  <p style={styles.sareeSales}>{saree.sales} sold</p>
                  <p style={styles.sareeRevenue}>Rs. {saree.revenue?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skin Tone Insights */}
        {stats?.skin_tone_insights?.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎨 Customer Skin Tone Insights</h3>
            <p style={styles.insightSub}>Helps you stock the right saree colors</p>
            {stats.skin_tone_insights.map((insight, i) => (
              <div key={i} style={styles.insightRow}>
                <span style={styles.insightLabel}>{insight.skin_tone}</span>
                <div style={styles.insightBar}>
                  <div style={{
                    ...styles.insightFill,
                    width: `${(insight.count / stats.total_customers) * 100}%`,
                    background: i === 0 ? '#E86A1A' : i === 1 ? '#0F3460' : i === 2 ? '#0F7B5C' : '#7B2FBE'
                  }} />
                </div>
                <span style={styles.insightCount}>{insight.count}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#F5F5F5' },
  loadingContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5' },
  loadingIcon: { fontSize: 60, marginBottom: 16 },
  loadingText: { fontSize: 18, color: '#888' },
  header: {
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    padding: '16px 20px', color: 'white',
    display: 'flex', alignItems: 'center', gap: 16
  },
  backBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: 20, borderRadius: 8, padding: '8px 12px', cursor: 'pointer' },
  refreshBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: 20, borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginLeft: 'auto' },
  headerTitle: { margin: 0, fontSize: 20, fontWeight: 'bold' },
  headerSub: { margin: '2px 0 0 0', fontSize: 13, opacity: 0.8 },
  content: { padding: 20, maxWidth: 800, margin: '0 auto' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 },
  statCard: { borderRadius: 16, padding: '20px 16px', color: 'white', textAlign: 'center' },
  statNumber: { margin: 0, fontSize: 28, fontWeight: 'bold' },
  statLabel: { margin: '4px 0 0 0', fontSize: 13, opacity: 0.85 },
  card: { background: 'white', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 16px 0' },
  emptyText: { color: '#aaa', fontSize: 14, textAlign: 'center', padding: 20 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  occasionTag: { background: '#F0F4FF', borderRadius: 20, padding: '8px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  occasionName: { fontSize: 13, fontWeight: 'bold', color: '#0F3460' },
  occasionCount: { fontSize: 11, color: '#888', marginTop: 2 },
  customerRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  customerAvatar: { width: 44, height: 44, borderRadius: 22, background: 'linear-gradient(135deg, #1A1A2E, #0F3460)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 'bold', flexShrink: 0 },
  customerInfo: { flex: 1 },
  customerName: { margin: 0, fontSize: 15, fontWeight: 'bold', color: '#1A1A2E' },
  customerPhone: { margin: '2px 0', fontSize: 13, color: '#888' },
  customerDetails: { margin: 0, fontSize: 12, color: '#aaa' },
  customerRight: { textAlign: 'right' },
  customerPurchases: { margin: 0, fontSize: 14, fontWeight: 'bold', color: '#E86A1A' },
  customerDate: { margin: '2px 0 0 0', fontSize: 12, color: '#aaa' },
  sareeRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  sareeRank: { width: 32, height: 32, borderRadius: 8, background: '#F0F4FF', color: '#0F3460', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14, flexShrink: 0 },
  sareeInfo: { flex: 1 },
  sareeName: { margin: 0, fontSize: 15, fontWeight: 'bold', color: '#1A1A2E' },
  sareeDetails: { margin: '2px 0 0 0', fontSize: 13, color: '#888' },
  sareeRight: { textAlign: 'right' },
  sareeSales: { margin: 0, fontSize: 14, fontWeight: 'bold', color: '#0F7B5C' },
  sareeRevenue: { margin: '2px 0 0 0', fontSize: 13, color: '#E86A1A' },
  insightSub: { fontSize: 13, color: '#888', marginBottom: 12, marginTop: -8 },
  insightRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 },
  insightLabel: { width: 80, fontSize: 14, color: '#1A1A2E', fontWeight: 'bold', textTransform: 'capitalize' },
  insightBar: { flex: 1, height: 12, background: '#F0F0F0', borderRadius: 6, overflow: 'hidden' },
  insightFill: { height: '100%', borderRadius: 6, transition: 'width 0.5s' },
  insightCount: { width: 24, fontSize: 14, color: '#888', textAlign: 'right' },
  error: { color: '#D84040', fontSize: 14, padding: '12px 20px' },
};

export default Dashboard;