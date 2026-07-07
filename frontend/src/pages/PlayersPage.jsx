import { useState, useEffect } from 'react';
import { getPlayers } from '../api/client';
import BattersTable from '../components/BattersTable';
import PitchersTable from '../components/PitchersTable';
import { POSITIONS, CHEMISTRY_TYPES, RATINGS } from '../constants';
import { Link } from 'react-router-dom';
import './PlayersPage.css';
import { sortPlayers } from '../utils/sortPlayers';
import { isPitcher, isTwoWay } from '../utils/playerRoles';

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [view, setView] = useState('batters');
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [chemistryType, setChemistryType] = useState('');
  const [rating, setRating] = useState('');
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
      if (position) params.position = position;
      if (chemistryType) params.chemistry_type = chemistryType;
      if (rating) params.rating = rating;

      getPlayers(params)
        .then(setPlayers)
        .catch(() => setError('Failed to load players.'))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, position, chemistryType, rating]);
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const displayedPlayers = sortPlayers(
    players.filter((p) => view === 'pitchers' ? isPitcher(p) : (!isPitcher(p) || isTwoWay(p))),
    sortBy,
    order
  );

  return (
    <div className="players-page">
      <div className="players-page-header">
        <h1>{view === 'pitchers' ? 'Pitchers' : 'Position Players'}</h1>
        {/*<Link to="/admin/players/new" className="temp-admin-button">+ New Player (TEMP)</Link>*/}
      </div>

      <div className="view-toggle">
        <button onClick={() => setView(view === 'batters' ? 'pitchers' : 'batters')}>
          {view === 'batters' ? 'Pitchers' : 'Position Players'}
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="">All Positions</option>
          {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={chemistryType} onChange={(e) => setChemistryType(e.target.value)}>
          <option value="">All Chemistry</option>
          {CHEMISTRY_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">All Ratings</option>
          {RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
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