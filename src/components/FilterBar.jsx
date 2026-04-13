import React from 'react';
import { GROUP_TYPES, getTypeMeta } from '../data/groups.js';

const FILTERS = ['all', ...GROUP_TYPES];

const LABELS = FILTERS.reduce((acc, key) => {
  acc[key] = key === 'all' ? 'All' : getTypeMeta(key).label;
  return acc;
}, {});

function getChipMeta(key) {
  if (key === 'all') {
    return { color: '#ff3c6e', bg: 'rgba(255,60,110,0.12)', border: 'rgba(255,60,110,0.35)' };
  }
  return getTypeMeta(key);
}

export default function FilterBar({ active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '8px 20px',
      borderBottom: '0.5px solid var(--border)',
      background: 'var(--surface)',
      flexShrink: 0,
      overflowX: 'auto',
    }}>
      {FILTERS.map((f) => {
        const isActive = active === f;
        const meta = getChipMeta(f);
        return (
          <button
            key={f}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: isActive ? 600 : 500,
              fontFamily: 'var(--font-body)',
              border: isActive
                ? `0.5px solid ${meta.border}`
                : '0.5px solid var(--border2)',
              background: isActive ? meta.bg : 'transparent',
              color: isActive ? meta.color : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              outline: 'none',
              boxShadow: isActive ? `0 0 14px ${meta.bg}` : 'none',
              transition: 'all 0.18s ease',
            }}
            onClick={() => onChange(f)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'var(--text)';
                e.currentTarget.style.borderColor = 'var(--border3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border2)';
              }
            }}
          >
            {isActive && (
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: meta.color,
                boxShadow: `0 0 6px ${meta.color}`,
                flexShrink: 0,
              }} />
            )}
            {LABELS[f]}
          </button>
        );
      })}
    </div>
  );
}
