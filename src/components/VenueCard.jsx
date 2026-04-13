import React from 'react';
import { getDisplayName, getTypeMeta } from '../data/groups.js';

function pillStyle(meta) {
  return {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: '4px',
    background: meta.bg,
    color: meta.color,
    border: `0.5px solid ${meta.border}`,
  };
}

export default function VenueCard({ venue, selected, onClick }) {
  const type = getTypeMeta(venue.type);
  const displayName = getDisplayName(venue);

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'rgba(114,168,255,0.08)' : 'var(--bg)',
        border: selected
          ? '0.5px solid rgba(114,168,255,0.55)'
          : '0.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '11px 12px',
        marginBottom: '6px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border2)';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
            {displayName}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '3px' }}>
            {venue.city}, {venue.country}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
          <span style={pillStyle(type)}>{type.label}</span>
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--cool)',
          }}>
            {venue.scope}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
        {venue.tags.map((tag, index) => (
          <span
            key={tag}
            style={{
              fontSize: '10px',
              padding: '2px 7px',
              borderRadius: '999px',
              background: index === 0 ? 'rgba(114,168,255,0.12)' : 'var(--surface2)',
              color: index === 0 ? '#9dc0ff' : 'var(--text-muted)',
              border: index === 0
                ? '0.5px solid rgba(114,168,255,0.24)'
                : '0.5px solid var(--border)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        lineHeight: 1.45,
        marginBottom: '9px',
      }}>
        {venue.knownFor}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-faint)' }}>
        <span>First seen: {venue.firstSeen}</span>
        <span>{venue.sourceLabel}</span>
      </div>
    </div>
  );
}
