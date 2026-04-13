import React from 'react';
import { getDisplayName, getLocationLabel, getTypeMeta } from '../data/groups.js';

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
    letterSpacing: '0.2px',
    flexShrink: 0,
  };
}

export default function VenueCard({ venue, selected, onClick }) {
  const type = getTypeMeta(venue.type);
  const displayName = getDisplayName(venue);
  const locationLabel = getLocationLabel(venue);

  // Derive stronger selected-state values from the type border string
  const selectedBorder = type.border.replace('0.28', '0.45');
  const selectedGlow = type.bg.replace('0.14', '0.08');

  return (
    <div
      className="venue-card"
      onClick={onClick}
      style={{
        position: 'relative',
        background: selected ? type.bg.replace('0.14', '0.09') : 'rgba(255,255,255,0.018)',
        border: selected
          ? `0.5px solid ${selectedBorder}`
          : '0.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '11px 12px',
        marginBottom: '6px',
        // inset box-shadow creates the colored left accent bar without changing layout
        boxShadow: selected
          ? `inset 2.5px 0 0 ${type.color}, 0 0 0 1px ${selectedGlow}, 0 2px 16px rgba(0,0,0,0.25)`
          : 'inset 2.5px 0 0 transparent, 0 1px 4px rgba(0,0,0,0.15)',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--border2)';
          e.currentTarget.style.boxShadow = `inset 2.5px 0 0 ${type.color}66, 0 2px 12px rgba(0,0,0,0.2)`;
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'inset 2.5px 0 0 transparent, 0 1px 4px rgba(0,0,0,0.15)';
        }
      }}
    >
      {/* Header row: name + type pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '7px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text)',
            lineHeight: 1.3,
            marginBottom: '2px',
          }}>
            {displayName}
          </div>
          <div style={{
            fontSize: '10px',
            color: 'var(--text-faint)',
            letterSpacing: '0.15px',
          }}>
            {locationLabel}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={pillStyle(type)}>{type.label}</span>
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--cool)',
            letterSpacing: '0.2px',
          }}>
            {venue.scope}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '7px' }}>
        {venue.tags.map((tag, index) => (
          <span
            key={tag}
            style={{
              fontSize: '10px',
              padding: '2px 7px',
              borderRadius: '999px',
              background: index === 0 ? type.bg : 'rgba(255,255,255,0.04)',
              color: index === 0 ? type.color : 'var(--text-muted)',
              border: index === 0
                ? `0.5px solid ${type.border}`
                : '0.5px solid var(--border)',
              letterSpacing: '0.1px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Known-for description */}
      <div style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
        marginBottom: '8px',
      }}>
        {venue.knownFor}
      </div>

      {/* Footer: since year + source */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: 'var(--text-faint)',
        letterSpacing: '0.1px',
      }}>
        <span>Since {venue.firstSeen}</span>
        <span>{venue.sourceLabel}</span>
      </div>
    </div>
  );
}
