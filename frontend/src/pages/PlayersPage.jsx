import { useState, useEffect } from 'react';
import { getPlayers } from '../api/client';
import BattersTable from '../components/BattersTable';
import PitchersTable from '../components/PitchersTable';
import { POSITIONS, CHEMISTRY_TYPES, RATINGS, PLAYER_GROUPS } from '../constants';
import { Link } from 'react-router-dom';
import './PlayersPage.css';
import { sortPlayers } from '../utils/sortPlayers';
import { isPitcher, isTwoWay } from '../utils/playerRoles';

function ToggleGroup({ label, options, selected, onChange }) {
  const toggle = (value) => {
    const next = new Set(selected);
    next.has(value) ? next.delete(value) : next.add(value);
    onChange(next);
  };

  return (
    <div className="toggle-group">
      <span className="toggle-group-label">{label}</span>
      <div className="toggle-group-options">
        {options.map((option) => (
          <button
            key={option}
            className={`toggle-button ${selected.has(option) ? 'active' : ''}`}
            onClick={() => toggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [view, setView] = useState('batters');
  const [search, setSearch] = useState('');
  const [selectedPositions, setSelectedPositions] = useState(new Set());
  const [selectedChemistryTypes, setSelectedChemistryTypes] = useState(new Set());
  const [selectedRatings, setSelectedRatings] = useState(new Set());
  const [selectedPlayerGroups, setSelectedPlayerGroups] = useState(new Set(['Standard']));
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      const params = {};
      if (search) params.search = search;

      getPlayers(params)
        .then(setPlayers)
        .catch(() => setError('Failed to load players.'))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const clearFilters = () => {
    setSelectedPositions(new Set());
    setSelectedChemistryTypes(new Set());
    setSelectedRatings(new Set());
    setSelectedPlayerGroups(new Set(['Standard']));
    setSearch('');
  };

  const hasActiveFilters =
    selectedPositions.size > 0 ||
    selectedChemistryTypes.size > 0 ||
    selectedRatings.size > 0 ||
    search.length > 0 ||
    !(selectedPlayerGroups.size === 1 && selectedPlayerGroups.has('Standard'));

  const filteredPlayers = players.filter((player) => {
    const viewMatch = view === 'pitchers' ? isPitcher(player) : (!isPitcher(player) || isTwoWay(player));
    if (!viewMatch) return false;

    if (selectedPositions.size > 0) {
      const playerPositions = [
        player.primary_position,
        ...(player.secondary_positions || []),
      ];
      const positionMatch = playerPositions.some((position) => selectedPositions.has(position));
      if (!positionMatch) return false;
    }

    if (selectedChemistryTypes.size > 0 && !selectedChemistryTypes.has(player.chemistry_type)) {
      return false;
    }

    if (selectedRatings.size > 0 && !selectedRatings.has(player.rating)) {
      return false;
    }

    return true;
  });

  const displayedPlayers = sortPlayers(filteredPlayers, sortBy, order);

  const positionOptions =
    view === 'pitchers'
      ? POSITIONS.filter((pos) => ['SP', 'RP', 'SP/RP', 'CP'].includes(pos))
      : POSITIONS.filter((pos) => !['SP', 'RP', 'SP/RP', 'CP'].includes(pos));

  return (
    <div className="players-page">
      <div className="players-page-header">
        <h1>{view === 'pitchers' ? 'Pitchers' : 'Position Players'}</h1>
        {import.meta.env.DEV && (
          <Link to="/admin/players/new" className="temp-admin-button">+ New Player (TEMP)</Link>
        )}
      </div>

      <div className="view-toggle">
        <button onClick={() => {
          setView(view === 'batters' ? 'pitchers' : 'batters');
          setSelectedPositions(new Set());
        }}>
          {view === 'batters' ? 'Pitchers' : 'Position Players'}
        </button>
      </div>

      <div className="filters-bar">
        <div className="filters-top-row">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {hasActiveFilters && (
            <button className="clear-filters-button" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        <ToggleGroup
          label="Position"
          options={positionOptions}
          selected={selectedPositions}
          onChange={setSelectedPositions}
        />
        <ToggleGroup
          label="Chemistry"
          options={CHEMISTRY_TYPES}
          selected={selectedChemistryTypes}
          onChange={setSelectedChemistryTypes}
        />
        <ToggleGroup
          label="Rating"
          options={RATINGS}
          selected={selectedRatings}
          onChange={setSelectedRatings}
        />
        <ToggleGroup
          label="League/Group"
          options={PLAYER_GROUPS}
          selected={selectedPlayerGroups}
          onChange={setSelectedPlayerGroups}
        />
      </div>

      {loading && <p>Loading players...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && displayedPlayers.length === 0 && <p>No players found.</p>}

      {!loading && !error && displayedPlayers.length > 0 && (
        view === 'pitchers'
          ? <PitchersTable players={displayedPlayers} sortBy={sortBy} order={order} onSort={handleSort} />
          : <BattersTable players={displayedPlayers} sortBy={sortBy} order={order} onSort={handleSort} />
      )}
    </div>
  );
}


export default PlayersPage;