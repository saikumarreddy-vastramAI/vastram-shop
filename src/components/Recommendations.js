import React, { useState } from 'react';

function Recommendations({ recommendations, customer, initialSelected, onPurchase, onBack }) {
  const [selected, setSelected] = useState(initialSelected || []);

  const toggleSelect = (item) => {
    setSelected(prev =>
      prev.find(s => s.id === item.id)
        ? prev.filter(s => s.id !== item.id)
        : [...prev, item]
    );
  };

  const isSelected = (item) => selected.find(s => s.id === item.id);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div>
          <h1 style={styles.headerTitle}>✨ AI Recommendations</h1>
          <p style={styles.headerSub}>
            {customer?.name || 'Customer'} — Tap sarees to select
          </p>
        </div>
      </div>

      {selected.length > 0 && (
        <div style={styles.selectionBar}>
          <span>{selected.length} saree{selected.length > 1 ? 's' : ''} selected to view physically</span>
          <button style={styles.proceedBtn} onClick={() => onPurchase(selected)}>
            Proceed to Purchase →
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {recommendations.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.card,
              border: isSelected(item) ? '3px solid #E86A1A' : '3px solid transparent',
              transform: isSelected(item) ? 'scale(1.02)' : 'scale(1)',
            }}
            onClick={() => toggleSelect(item)}
          >
            {isSelected(item) && (
              <div style={styles.selectedBadge}>✓ Selected</div>
            )}

            <div style={styles.imageContainer}>
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} style={styles.image} />
              ) : (
                <div style={styles.imagePlaceholder}>
                  <span style={{ fontSize: 48 }}>👗</span>
                  <p style={{ color: '#aaa', fontSize: 12 }}>No photo yet</p>
                </div>
              )}
            </div>

            <div style={styles.cardContent}>
              <h3 style={styles.sareName}>{item.name}</h3>
              <p style={styles.price}>Rs. {item.price?.toLocaleString('en-IN')}</p>

              <div style={styles.tags}>
                <span style={styles.tag}>{item.fabric}</span>
                <span style={styles.tag}>{item.region}</span>
                <span style={{ ...styles.tag, background: '#E8F4FF' }}>{item.color}</span>
              </div>

              <p style={styles.reason}>{item.reason}</p>

              {item.blouse_tip && (
                <div style={styles.blouseTip}>
                  <span style={styles.blouseTipIcon}>👚</span>
                  <span style={styles.blouseTipText}>{item.blouse_tip}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected.length === 0 && (
        <p style={styles.hint}>Tap on sarees the customer wants to see physically</p>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#F5F5F5' },
  header: {
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    padding: '16px 20px', color: 'white',
    display: 'flex', alignItems: 'center', gap: 16
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none',
    color: 'white', fontSize: 20, borderRadius: 8,
    padding: '8px 12px', cursor: 'pointer'
  },
  headerTitle: { margin: 0, fontSize: 20, fontWeight: 'bold' },
  headerSub: { margin: '2px 0 0 0', fontSize: 13, opacity: 0.8 },
  selectionBar: {
    background: '#E86A1A', color: 'white',
    padding: '12px 20px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    fontSize: 14, fontWeight: 'bold'
  },
  proceedBtn: {
    background: 'white', color: '#E86A1A',
    border: 'none', borderRadius: 8,
    padding: '8px 16px', fontWeight: 'bold',
    cursor: 'pointer', fontSize: 14
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 20, padding: 20
  },
  card: {
    background: 'white', borderRadius: 16,
    overflow: 'hidden', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.2s', position: 'relative'
  },
  selectedBadge: {
    position: 'absolute', top: 12, right: 12,
    background: '#E86A1A', color: 'white',
    borderRadius: 20, padding: '4px 12px',
    fontSize: 12, fontWeight: 'bold', zIndex: 1
  },
  imageContainer: {
    height: 220, overflow: 'hidden',
    background: '#F8F8F8'
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imagePlaceholder: {
    height: '100%', display: 'flex',
    flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center'
  },
  cardContent: { padding: 16 },
  sareName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 4px 0' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#E86A1A', margin: '0 0 10px 0' },
  tags: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  tag: {
    background: '#F0F4FF', color: '#0F3460',
    borderRadius: 20, padding: '3px 10px', fontSize: 12
  },
  reason: { fontSize: 13, color: '#555', lineHeight: 1.5, marginBottom: 10 },
  blouseTip: {
    background: '#FFF3E8', borderRadius: 8,
    padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'flex-start'
  },
  blouseTipIcon: { fontSize: 14 },
  blouseTipText: { fontSize: 12, color: '#E86A1A', lineHeight: 1.4 },
  hint: { textAlign: 'center', color: '#aaa', fontSize: 14, padding: 20 },
};

export default Recommendations;