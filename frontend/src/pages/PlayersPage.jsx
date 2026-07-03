import { useState, useEffect } from 'react';
import { getPlayers } from '../api/client';
import { Link } from 'react-router-dom';
import PlayerCard from '../components/PlayerCard';
import './PlayersPage.css';

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // debounce: wait 300ms after typing stops before calling the API
    const timeoutId = setTimeout(() => {
      getPlayers(search ? { search } : {})
        .then((data) => setPlayers(data))
        .catch((err) => setError('Failed to load players.'))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="players-page">
      <h1>Players</h1>

      <Link to="/admin/players/new" className="temp-admin-button">+ New Player (TEMP)</Link>

      <input
        type="text"
        placeholder="Search by first or last name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading && <p>Loading players...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && players.length === 0 && (
        <p>No players found.</p>
      )}

      <div className="player-grid">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}

export default PlayersPage;