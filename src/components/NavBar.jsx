import React, { useState, useEffect } from 'react';

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px',
    height: '48px',
    borderBottom: '0.5px solid var(--border)',
    background: 'var(--surface)',
    flexShrink: 0,
  },
  logo: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '-0.5px',
    color: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  liveDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--hot)',
    animation: 'pulseBlink 1.4s ease-in-out infinite',
  },
  tagline: {
    fontSize: '11px',
    color: 'var(--text-faint)',
    fontFamily: 'var(--font-mono)',
    marginLeft: '4px',
  },
  right: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    background: 'var(--bg)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    border: '0.5px solid var(--border)',
  },
  cityBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--cool)',
    background: 'var(--bg)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    border: '0.5px solid var(--border)',
  },
};

// Inject keyframes once
const injectKeyframes = () => {
  if (document.getElementById('pulse-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'pulse-keyframes';
  style.textContent = `
    @keyframes pulseBlink {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.35; transform: scale(0.65); }
    }
  `;
  document.head.appendChild(style);
};

export default function NavBar({ loading, visibleCount }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    injectKeyframes();
    const tick = () => {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      setTime(`${h}:${m} ${ampm}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
      <div style={{ ...styles.liveDot, background: loading ? 'var(--warm)' : 'var(--hot)' }} />
        Cyber Actor Atlas
        <span style={styles.tagline}>cyber actor origin map</span>
      </div>
      <div style={styles.right}>
        <div style={styles.badge}>{visibleCount} visible</div>
        <div style={styles.badge}>{time}</div>
        <div style={styles.cityBadge}>Public attribution</div>
      </div>
    </nav>
  );
}
