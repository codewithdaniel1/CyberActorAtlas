import React, { useState, useEffect } from 'react';

export default function NavBar({ loading, totalGroups, searchQuery, onSearchChange }) {
  const [time, setTime] = useState('');
  const baseUrl = import.meta.env.BASE_URL;
  const logoIconSrc = `${baseUrl}branding/cyberactoratlas-icon-v2.png`;

  useEffect(() => {
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
    <nav className="navbar" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '0 20px',
      height: '56px',
      background: 'var(--surface)',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <img
          src={logoIconSrc}
          alt="Cyber Actor Atlas logo"
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            objectFit: 'cover',
            flexShrink: 0,
            boxShadow: '0 0 14px rgba(255, 60, 110, 0.45), 0 0 4px rgba(255, 60, 110, 0.2)',
          }}
        />
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '-0.3px',
            background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent2) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}>
            Cyber Actor Atlas
          </div>
          <div style={{
            fontSize: '10px',
            color: 'var(--text-faint)',
            fontFamily: 'var(--font-mono)',
            marginTop: '2px',
          }}>
            cyber actor origin map
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        width: '1px',
        height: '22px',
        background: 'var(--border2)',
        flexShrink: 0,
      }} />

      {/* Live status dot + actor count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--cool)',
          flexShrink: 0,
          animation: 'pulse-dot 2.5s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          {loading ? 'loading…' : `${totalGroups} actors`}
        </span>
      </div>

      {/* Right controls */}
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg
            width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="rgba(255,255,255,0.22)"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: '10px', pointerEvents: 'none', flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search actors, aliases, tags…"
            aria-label="Search all mapped actors"
            style={{
              width: '262px',
              maxWidth: '30vw',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '0.5px solid var(--border2)',
              borderRadius: 'var(--radius-md)',
              padding: '7px 30px 7px 30px',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '8px',
                background: 'none',
                border: 'none',
                color: 'var(--text-faint)',
                cursor: 'pointer',
                fontSize: '15px',
                lineHeight: 1,
                padding: '2px 4px',
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* CSV download */}
        <a
          href={`${baseUrl}data/cyber-actor-atlas.csv`}
          download
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '0.5px solid var(--border2)',
            textDecoration: 'none',
            letterSpacing: '0.3px',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent)';
            e.currentTarget.style.borderColor = 'rgba(255,60,110,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border2)';
          }}
        >
          ↓ CSV
        </a>

        {/* JSON download */}
        <a
          href={`${baseUrl}data/cyber-actor-atlas.json`}
          download
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '0.5px solid var(--border2)',
            textDecoration: 'none',
            letterSpacing: '0.3px',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent2)';
            e.currentTarget.style.borderColor = 'rgba(124,92,252,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border2)';
          }}
        >
          ↓ JSON
        </a>

        {/* Clock */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-faint)',
          padding: '5px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '0.5px solid var(--border)',
          background: 'rgba(255, 255, 255, 0.02)',
          letterSpacing: '0.5px',
        }}>
          {time}
        </div>

        {/* Public attribution badge */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--cool)',
          padding: '5px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '0.5px solid rgba(60, 240, 160, 0.25)',
          background: 'rgba(60, 240, 160, 0.06)',
          letterSpacing: '0.3px',
        }}>
          Public attribution
        </div>
      </div>
    </nav>
  );
}
