import { useEffect, useRef } from 'react';
import VenueCard from './VenueCard.jsx';

// Inject shimmer keyframes once (global.css also has them, this is a safety net)
if (typeof document !== 'undefined' && !document.getElementById('skeleton-kf')) {
  const s = document.createElement('style');
  s.id = 'skeleton-kf';
  s.textContent = `
    @keyframes skeleton-shimmer {
      0%   { background-position: -800px 0; }
      100% { background-position:  800px 0; }
    }
  `;
  document.head.appendChild(s);
}

const skeletonStyle = {
  borderRadius: '10px',
  marginBottom: '6px',
  background: 'linear-gradient(90deg, var(--surface2) 0%, var(--surface3) 45%, var(--surface4) 50%, var(--surface3) 55%, var(--surface2) 100%)',
  backgroundSize: '800px 100%',
  animation: 'skeleton-shimmer 1.7s ease-in-out infinite',
};

function Skeletons() {
  const heights = [96, 88, 102, 88, 96];
  return heights.map((h, i) => (
    <div key={i} style={{ ...skeletonStyle, height: `${h}px`, opacity: 1 - i * 0.14 }} />
  ));
}

export default function VenueList({ venues, selectedVenue, onSelectVenue, loading, searchQuery }) {
  const selectedRef = useRef(null);
  const hasSearch = searchQuery.trim().length > 0;

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedVenue]);

  return (
    <>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '0.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Small grid icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--text-faint)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontFamily: 'var(--font-mono)',
          }}>
            Mapped Actors
          </span>
        </div>
        <span style={{
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '2px 9px',
          borderRadius: '10px',
          border: '0.5px solid var(--border2)',
        }}>
          {loading ? '…' : venues.length}
        </span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {loading && venues.length === 0 ? (
          <Skeletons />
        ) : venues.length === 0 ? (
          <div style={{
            padding: '44px 16px',
            textAlign: 'center',
            color: 'var(--text-faint)',
            fontSize: '13px',
            lineHeight: 1.6,
          }}>
            <div style={{ fontSize: '22px', marginBottom: '10px', opacity: 0.4 }}>◎</div>
            {hasSearch
              ? `No actors matched "${searchQuery}".`
              : 'No mapped actors in this viewport.'}
          </div>
        ) : (
          venues.map((v) => {
            const isSelected = selectedVenue?.id === v.id;
            return (
              <div key={v.id} ref={isSelected ? selectedRef : null}>
                <VenueCard
                  venue={v}
                  selected={isSelected}
                  onClick={() => onSelectVenue(isSelected ? null : v)}
                />
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
