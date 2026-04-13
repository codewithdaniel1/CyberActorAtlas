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
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    width: '270px',
    maxWidth: '34vw',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text)',
    background: 'var(--bg)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '7px 34px 7px 10px',
    outline: 'none',
  },
  clearButton: {
    position: 'absolute',
    right: '6px',
    background: 'none',
    border: 'none',
    color: 'var(--text-faint)',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1,
    padding: '2px 4px',
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
  downloadLink: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--accent)',
    background: 'var(--bg)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    border: '0.5px solid var(--border)',
    textDecoration: 'none',
  },
};

// Inject keyframes once
const injectKeyframes = () => {
  if (document.getElementById('atlas-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'atlas-keyframes';
  style.textContent = `
    @keyframes pulseBlink {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.35; transform: scale(0.65); }
    }
  `;
  document.head.appendChild(style);
};

export default function NavBar({ loading, totalGroups, searchQuery, onSearchChange }) {
  const [time, setTime] = useState('');
  const baseUrl = import.meta.env.BASE_URL;

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
        <div style={styles.badge}>
          {loading ? '…' : `${totalGroups} total groups`}
        </div>
        <div style={styles.searchWrap}>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search all actors, aliases, tags..."
            aria-label="Search all mapped actors"
            style={styles.searchInput}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              style={styles.clearButton}
            >
              x
            </button>
          ) : null}
        </div>
        <a href={`${baseUrl}data/cyber-actor-atlas.csv`} download style={styles.downloadLink}>
          CSV / Excel
        </a>
        <a href={`${baseUrl}data/cyber-actor-atlas.json`} download style={styles.downloadLink}>
          JSON
        </a>
        <div style={styles.badge}>{time}</div>
        <div style={styles.cityBadge}>Public attribution</div>
      </div>
    </nav>
  );
}
