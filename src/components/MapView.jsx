import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GROUPS, getDisplayName, getTypeMeta, hasMapLocation } from '../data/groups.js';

// Light tile layer
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

const INITIAL_CENTER = [22, 8];
const INITIAL_ZOOM = 2;

function releaseLeafletContainer(container) {
  if (container?._leaflet_id) {
    delete container._leaflet_id;
  }
}

/** Group an array of venues by their exact lat/lng coordinate string. */
function groupByLocation(venues) {
  const map = new Map();
  venues.filter(hasMapLocation).forEach((group) => {
    const key = `${group.lat},${group.lng}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(group);
  });
  return map;
}

function markerSize(group, selected) {
  const base = group.scope === 'Global' ? 14 : 11;
  return selected ? base + 4 : base;
}

function markerColor(group) {
  return getTypeMeta(group.type).color;
}

/**
 * Build a divIcon for a location.
 * When count > 1 a small white badge shows the number of actors stacked there.
 */
function makeLocationIcon(primaryGroup, selected, count) {
  const color = markerColor(primaryGroup);
  const size = markerSize(primaryGroup, selected);
  const border = selected
    ? '2.5px solid rgba(255,255,255,0.92)'
    : '1.5px solid rgba(255,255,255,0.18)';
  const shadow = selected
    ? `0 0 0 5px rgba(255,255,255,0.13), 0 0 18px ${color}bb`
    : `0 1px 6px rgba(0,0,0,0.5), 0 0 10px ${color}66`;

  // Extra space so the badge doesn't get clipped
  const pad = count > 1 ? 8 : 0;
  const total = size + pad;

  const badge =
    count > 1
      ? `<div style="
          position:absolute;top:-4px;right:-4px;
          width:15px;height:15px;
          border-radius:50%;
          background:#ffffff;
          color:#111111;
          font-size:8px;font-weight:700;
          display:flex;align-items:center;justify-content:center;
          border:1.5px solid rgba(0,0,0,0.18);
          font-family:'DM Sans',sans-serif;
          box-shadow:0 1px 5px rgba(0,0,0,0.3);
          line-height:1;
        ">${count}</div>`
      : '';

  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      <div style="
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:${color};
        border:${border};
        box-shadow:${shadow};
        transition:all 0.2s ease;
      "></div>
      ${badge}
    </div>`,
    iconSize: [total, total],
    iconAnchor: [total / 2, total / 2],
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Popup for a single actor. */
function singlePopupHTML(group) {
  const type = getTypeMeta(group.type);
  const displayName = escapeHtml(getDisplayName(group));
  return `
    <div style="font-family:'DM Sans',sans-serif;padding:11px 14px;min-width:210px;color:#eeeef5;">
      <div style="font-weight:700;font-size:13px;margin-bottom:2px;">${displayName}</div>
      <div style="font-size:10px;color:#626282;margin-bottom:9px;">
        ${escapeHtml(group.city)}, ${escapeHtml(group.country)}
      </div>
      <div style="
        display:inline-block;
        font-family:'Space Mono',monospace;
        font-size:10px;font-weight:700;
        padding:2px 8px;border-radius:4px;
        background:${type.bg};color:${type.color};
        border:0.5px solid ${type.border};
        margin-bottom:8px;letter-spacing:0.2px;
      ">${escapeHtml(type.label)}</div>
      <div style="
        font-size:10px;color:#7b7b9a;
        background:rgba(255,255,255,0.04);
        border:0.5px solid rgba(255,255,255,0.08);
        border-radius:6px;padding:4px 8px;
        font-family:'Space Mono',monospace;letter-spacing:0.2px;
      ">Since ${escapeHtml(String(group.firstSeen))} &nbsp;·&nbsp; ${escapeHtml(group.scope)}</div>
    </div>
  `;
}

/** Popup for multiple actors sharing the same pin. */
function multiPopupHTML(groups) {
  const { city, country } = groups[0];
  const rows = groups
    .map((g) => {
      const type = getTypeMeta(g.type);
      return `
        <div style="
          display:flex;align-items:center;justify-content:space-between;gap:8px;
          padding:5px 0;
          border-bottom:0.5px solid rgba(255,255,255,0.07);
          flex-shrink:0;
        ">
          <span style="font-size:12px;font-weight:600;color:#eeeef5;">
            ${escapeHtml(getDisplayName(g))}
          </span>
          <span style="
            font-family:'Space Mono',monospace;
            font-size:9px;font-weight:700;
            padding:2px 6px;border-radius:3px;
            background:${type.bg};color:${type.color};
            border:0.5px solid ${type.border};
            white-space:nowrap;
          ">${escapeHtml(type.label)}</span>
        </div>
      `;
    })
    .join('');

  return `
    <div style="font-family:'DM Sans',sans-serif;padding:10px 14px;min-width:230px;color:#eeeef5;">
      <div style="font-size:10px;color:#626282;margin-bottom:8px;font-weight:500;">
        ${escapeHtml(city)}, ${escapeHtml(country)}
        &nbsp;·&nbsp;
        <span style="color:#9090b5;">${groups.length} actors</span>
      </div>
      <div style="max-height:180px;overflow-y:auto;scrollbar-width:thin;">
        ${rows}
      </div>
    </div>
  `;
}

function buildPopupHTML(groups) {
  return groups.length === 1 ? singlePopupHTML(groups[0]) : multiPopupHTML(groups);
}

export default function MapView({ venues, selectedVenue, onSelectVenue, onBoundsChange, searchActive, activeFilter }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  // Keyed by "lat,lng" instead of actor id — one entry per unique coordinate
  const layersRef = useRef({});
  const searchKey = venues.map((g) => g.id).sort().join('|');
  // Prevents the filter-zoom effect from firing on the initial mount
  const filterInitRef = useRef(false);

  // ── Initialise map ─────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    releaseLeafletContainer(container);

    const map = L.map(container, {
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      minZoom: 2,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: true,
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapRef.current = map;

    const emitBounds = () => {
      if (!onBoundsChange) return;
      const b = map.getBounds();
      onBoundsChange({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest(), zoom: map.getZoom() });
    };
    emitBounds();
    map.on('moveend', emitBounds);

    return () => {
      map.off('moveend', emitBounds);
      map.remove();
      releaseLeafletContainer(container);
      mapRef.current = null;
      layersRef.current = {};
    };
  }, [onBoundsChange]);

  // ── Add / remove / update location markers when venues change ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const locationGroups = groupByLocation(venues);
    const currentKeys = new Set(locationGroups.keys());
    const existingKeys = new Set(Object.keys(layersRef.current));

    // Remove stale locations
    existingKeys.forEach((key) => {
      if (!currentKeys.has(key)) {
        layersRef.current[key].marker.remove();
        layersRef.current[key].halo.remove();
        delete layersRef.current[key];
      }
    });

    // Add or refresh each location
    locationGroups.forEach((groups, key) => {
      const primary = groups[0];
      const color = markerColor(primary);
      const count = groups.length;

      if (layersRef.current[key]) {
        // Location already has a marker — update popup content and badge count
        const entry = layersRef.current[key];
        entry.groups = groups;
        entry.marker.setPopupContent(buildPopupHTML(groups));
        // Keep selected state; selectedVenue effect will correct it immediately after
        entry.marker.setIcon(makeLocationIcon(primary, false, count));
        return;
      }

      // Create halo
      const radius = primary.scope === 'Global' ? 22 : 16;
      const halo = L.circleMarker([primary.lat, primary.lng], {
        radius,
        color: 'transparent',
        fillColor: color,
        fillOpacity: primary.scope === 'Global' ? 0.14 : 0.09,
        interactive: false,
      }).addTo(map);

      // Create marker
      const marker = L.marker([primary.lat, primary.lng], {
        icon: makeLocationIcon(primary, false, count),
        title: count === 1 ? getDisplayName(primary) : `${count} actors`,
      }).addTo(map);

      // Clicking selects the primary (first) actor at this location
      marker.on('click', () => onSelectVenue(primary));

      marker.bindPopup(buildPopupHTML(groups), {
        closeButton: false,
        offset: [0, -8],
        maxWidth: 280,
        autoPan: false,
      });
      marker.on('mouseover', () => marker.openPopup());
      marker.on('mouseout', () => marker.closePopup());

      layersRef.current[key] = { marker, halo, groups };
    });
  }, [venues, onSelectVenue]);

  // ── Update icon appearance when selection changes ───────────────
  useEffect(() => {
    Object.values(layersRef.current).forEach(({ marker, groups }) => {
      const isSelected = !!selectedVenue && groups.some((g) => g.id === selectedVenue.id);
      marker.setIcon(makeLocationIcon(groups[0], isSelected, groups.length));
    });
  }, [selectedVenue]);

  // ── Fly to selected venue ───────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedVenue || !hasMapLocation(selectedVenue)) return;
    map.flyTo([selectedVenue.lat, selectedVenue.lng], 5, { duration: 1.1 });
  }, [selectedVenue]);

  // ── Fit bounds to search results ────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const mappable = venues.filter(hasMapLocation);
    if (!map || !searchActive || mappable.length === 0) return;
    const bounds = L.latLngBounds(mappable.map((g) => [g.lat, g.lng]));
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: mappable.length === 1 ? 5 : 4 });
  }, [searchActive, searchKey, venues]);

  // ── Zoom to fit category when filter changes ────────────────────
  useEffect(() => {
    // Skip the initial mount — only zoom when the user actively clicks a filter
    if (!filterInitRef.current) {
      filterInitRef.current = true;
      return;
    }

    const map = mapRef.current;
    if (!map) return;

    if (activeFilter === 'all') {
      map.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { duration: 1.0 });
      return;
    }

    const targets = GROUPS.filter((g) => g.type === activeFilter && hasMapLocation(g));
    if (targets.length === 0) return;

    if (targets.length === 1) {
      map.flyTo([targets[0].lat, targets[0].lng], 5, { duration: 1.0 });
    } else {
      const bounds = L.latLngBounds(targets.map((g) => [g.lat, g.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 6, animate: true });
    }
  }, [activeFilter]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
