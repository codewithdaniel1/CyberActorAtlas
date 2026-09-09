import { useState, useCallback } from 'react';
import NavBar from './components/NavBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import MapView from './components/MapView.jsx';
import VenueList from './components/VenueList.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import { useGroups } from './hooks/useGroups.js';
import { useDataset } from './hooks/useDataset.js';

export default function App() {
  const [activeFilter, setActiveFilter]   = useState('all');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [mapBounds, setMapBounds]         = useState(null);
  const [searchQuery, setSearchQuery]     = useState('');

  const { groups: allGroups, loading, error } = useDataset();
  const groups = useGroups(allGroups, activeFilter, mapBounds, searchQuery);
  const visibleSelectedGroup = selectedGroup
    && groups.some((group) => group.id === selectedGroup.id)
    ? selectedGroup
    : null;

  const handleBoundsChange = useCallback((bounds) => {
    setMapBounds(bounds);
  }, []);

  return (
    <div className="app-shell">
      <NavBar
        loading={loading}
        totalGroups={allGroups.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FilterBar active={activeFilter} onChange={setActiveFilter} />
      <main className="app-main">
        <section className="map-wrapper" aria-label="Cyber actor origin map">
          <MapView
            venues={groups}
            selectedVenue={visibleSelectedGroup}
            onSelectVenue={setSelectedGroup}
            onBoundsChange={handleBoundsChange}
            searchActive={searchQuery.trim().length > 0}
            activeFilter={activeFilter}
            allVenues={allGroups}
          />
        </section>
        <aside className="side-panel" aria-label="Actor results and details">
          <VenueList
            venues={groups}
            selectedVenue={visibleSelectedGroup}
            onSelectVenue={setSelectedGroup}
            loading={loading}
            searchQuery={searchQuery}
            error={error}
          />
          <DetailPanel
            venue={visibleSelectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        </aside>
      </main>
    </div>
  );
}
