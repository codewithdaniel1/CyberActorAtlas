import { useState, useCallback, useEffect } from 'react';
import NavBar from './components/NavBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import MapView from './components/MapView.jsx';
import VenueList from './components/VenueList.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import { useGroups } from './hooks/useGroups.js';
import { GROUPS } from './data/groups.js';

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    background: 'var(--bg)',
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  sidePanel: {
    width: '360px',
    borderLeft: '0.5px solid var(--border)',
    background: 'var(--surface)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexShrink: 0,
  },
};

export default function App() {
  const [activeFilter, setActiveFilter]   = useState('all');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [mapBounds, setMapBounds]         = useState(null);
  const [searchQuery, setSearchQuery]     = useState('');

  const { groups, loading } = useGroups(activeFilter, mapBounds, searchQuery);

  const handleBoundsChange = useCallback((bounds) => {
    setMapBounds(bounds);
  }, []);

  // Clear selection when the selected group leaves the current result set
  useEffect(() => {
    if (selectedGroup && !groups.find((group) => group.id === selectedGroup.id)) {
      setSelectedGroup(null);
    }
  }, [groups, selectedGroup]);

  return (
    <div style={styles.app}>
      <NavBar
        loading={loading}
        totalGroups={GROUPS.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FilterBar active={activeFilter} onChange={setActiveFilter} />
      <div style={styles.main}>
        <div style={styles.mapWrapper}>
          <MapView
            venues={groups}
            selectedVenue={selectedGroup}
            onSelectVenue={setSelectedGroup}
            onBoundsChange={handleBoundsChange}
            searchActive={searchQuery.trim().length > 0}
            activeFilter={activeFilter}
          />
        </div>
        <div style={styles.sidePanel}>
          <VenueList
            venues={groups}
            selectedVenue={selectedGroup}
            onSelectVenue={setSelectedGroup}
            loading={loading}
            searchQuery={searchQuery}
          />
          <DetailPanel
            venue={selectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        </div>
      </div>
    </div>
  );
}
