import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDisplayName, getTypeMeta } from '../data/groups.js';

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

function markerSize(group, selected) {
  const base = group.scope === 'Global' ? 14 : 11;
  return selected ? base + 4 : base;
}

function markerColor(group) {
  return getTypeMeta(group.type).color;
}

function makeIcon(group, selected) {
  const color = markerColor(group);
  const size = markerSize(group, selected);
  const border = selected
    ? '2.5px solid rgba(255,255,255,0.92)'
    : '2px solid rgba(0,0,0,0.3)';
  const shadow = selected
    ? `0 0 0 5px rgba(255,255,255,0.16), 0 0 16px ${color}88`
    : `0 1px 5px rgba(0,0,0,0.28), 0 0 8px ${color}55`;

  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${color};
      border:${border};
      box-shadow:${shadow};
      transition:all 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
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

function popupHTML(group) {
  const type = getTypeMeta(group.type);
  const displayName = escapeHtml(getDisplayName(group));

  return `
    <div style="
      font-family:'DM Sans',sans-serif;
      padding:10px 13px;
      min-width:210px;
      color:#1a1a2e;
    ">
      <div style="font-weight:700;font-size:13px;margin-bottom:3px;">
        ${displayName}
      </div>
      <div style="font-size:10px;color:#6b7280;margin-bottom:8px;">
        ${escapeHtml(group.city)}, ${escapeHtml(group.country)}
      </div>
      <div style="
        display:inline-block;
        font-family:'Space Mono',monospace;
        font-size:10px;font-weight:700;
        padding:2px 8px;border-radius:4px;
        background:${type.bg};color:${type.color};
        border:1px solid ${type.border};
        margin-bottom:6px;
      ">
        ${escapeHtml(type.label)}
      </div>
      <div style="
        font-size:10px;color:#536071;
        background:rgba(114,168,255,0.08);
        border-radius:4px;padding:4px 7px;
        margin-bottom:6px;
      ">
        First seen: ${escapeHtml(String(group.firstSeen))} · Scope: ${escapeHtml(group.scope)}
      </div>
    </div>
  `;
}

export default function MapView({ venues, selectedVenue, onSelectVenue, onBoundsChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({});

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
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentIds = new Set(venues.map((group) => group.id));
    const existingIds = new Set(Object.keys(layersRef.current));

    existingIds.forEach((id) => {
      if (!currentIds.has(id)) {
        const { marker, halo } = layersRef.current[id];
        marker.remove();
        halo.remove();
        delete layersRef.current[id];
      }
    });

    venues.forEach((group) => {
      if (layersRef.current[group.id]) return;

      const color = markerColor(group);
      const radius = group.scope === 'Global' ? 24 : 18;

      const halo = L.circleMarker([group.lat, group.lng], {
        radius,
        color: 'transparent',
        fillColor: color,
        fillOpacity: group.scope === 'Global' ? 0.16 : 0.1,
        interactive: false,
      }).addTo(map);

      const marker = L.marker([group.lat, group.lng], {
        icon: makeIcon(group, false),
        title: getDisplayName(group),
      }).addTo(map);

      marker.on('click', () => {
        onSelectVenue(group);
      });

      marker.bindPopup(popupHTML(group), {
        closeButton: false,
        offset: [0, -8],
        maxWidth: 240,
      });

      marker.on('mouseover', () => marker.openPopup());
      marker.on('mouseout', () => marker.closePopup());

      layersRef.current[group.id] = { marker, halo, group };
    });
  }, [venues, onSelectVenue]);

  useEffect(() => {
    Object.values(layersRef.current).forEach(({ marker, group }) => {
      const isSelected = selectedVenue?.id === group.id;
      marker.setIcon(makeIcon(group, isSelected));
    });
  }, [selectedVenue]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedVenue) return;

    map.flyTo([selectedVenue.lat, selectedVenue.lng], 5, { duration: 1.1 });
  }, [selectedVenue]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
