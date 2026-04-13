import React from 'react';
import { getDisplayName, getLocationLabel, getTypeMeta } from '../data/groups.js';

const PANEL_HEIGHT = 300;

function StatCard({ label, value, valueStyle }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: 'var(--radius-md)',
      padding: '8px 10px',
      border: '0.5px solid var(--border2)',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        fontSize: '9px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-faint)',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: '4px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--text)',
        lineHeight: 1.35,
        ...valueStyle,
      }}>
        {value}
      </div>
    </div>
  );
}

export default function DetailPanel({ venue, onClose }) {
  const open = !!venue;
  const type = venue ? getTypeMeta(venue.type) : null;
  const displayName = venue ? getDisplayName(venue) : '';
  const locationLabel = venue ? getLocationLabel(venue) : '';

  // Dynamic gradient uses the type's color
  const bgGradient = type
    ? `linear-gradient(180deg, ${type.bg.replace('0.14', '0.28')} 0%, rgba(14,14,23,0.99) 55%)`
    : 'var(--surface2)';

  return (
    <div style={{
      borderTop: '0.5px solid var(--border2)',
      background: bgGradient,
      flexShrink: 0,
      overflow: 'hidden',
      transition: 'height 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      height: open ? `${PANEL_HEIGHT}px` : '0px',
    }}>
      {venue && (
        <div style={{
          padding: '12px 14px',
          height: '100%',
          overflow: 'auto',
        }}>
          {/* Header: name + type badge + close */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '10px',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '3px',
              }}>
                <span style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1.2,
                }}>
                  {displayName}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: type.bg,
                  color: type.color,
                  border: `0.5px solid ${type.border}`,
                  flexShrink: 0,
                  letterSpacing: '0.2px',
                }}>
                  {type.label}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
                {locationLabel}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '0.5px solid var(--border2)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '15px',
                lineHeight: 1,
                padding: '5px 9px',
                marginLeft: '8px',
                flexShrink: 0,
                borderRadius: 'var(--radius-sm)',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
              aria-label="Close detail panel"
            >
              ×
            </button>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '9px' }}>
            <StatCard label="First seen" value={venue.firstSeen} />
            <StatCard label="Scope" value={venue.scope} />
          </div>

          {/* Origin precision block */}
          <div style={{
            background: type.bg.replace('0.14', '0.10'),
            border: `0.5px solid ${type.border}`,
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            fontSize: '11px',
            color: type.color,
            marginBottom: '8px',
            lineHeight: 1.5,
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: `${type.color}99`,
              marginRight: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}>
              Origin
            </span>
            {venue.originPrecision}
          </div>

          {/* Known For */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '9px 10px',
            marginBottom: '8px',
          }}>
            <div style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-faint)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '5px',
            }}>
              Known For
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {venue.knownFor}
            </div>
          </div>

          {/* Public Attribution */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '9px 10px',
            marginBottom: '8px',
          }}>
            <div style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-faint)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '5px',
            }}>
              Public Attribution
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {venue.attribution}
            </div>
          </div>

          {/* Source footer */}
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', lineHeight: 1.4 }}>
            Source: {venue.sourceLabel}
          </div>
        </div>
      )}
    </div>
  );
}
