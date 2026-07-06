import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTeam, getPlayers, deleteTeam } from '../api/client';
import PlayerCard from '../components/PlayerCard';
import PlayersTable from '../components/PlayersTable';
import './TeamDetailPage.css';

function TeamDetailPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      getTeam(teamId),
      getPlayers({ team_id: teamId })
    ])
      .then(([teamData, playersData]) => {
        setTeam(teamData);
        setPlayers(playersData);
      })
      .catch(() => setError('Failed to load team.'))
      .finally(() => setLoading(false));
  }, [teamId]);

    const handleDelete = async () => {
      const confirmed = window.confirm(
        `Delete ${team.name}? Any players on this team will become free agents. This cannot be undone.`
      );
      if (!confirmed) return;

      setDeleting(true);
      try {
        await deleteTeam(teamId);
        navigate('/teams');
      } catch (err) {
        alert('Failed to delete team.');
        setDeleting(false);
      }
    };

  if (loading) return <p>Loading team...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!team) return <p>Team not found.</p>;

  return (
    <div className="team-detail-page">
      <Link to="/teams" className="back-link">&larr; All Teams</Link>

    <Link to={`/admin/teams/${team.id}/edit`} className="temp-admin-button">Edit Team (TEMP)</Link>

    <button onClick={handleDelete} disabled={deleting} className="temp-admin-button temp-admin-delete">
      {deleting ? 'Deleting...' : 'Delete Team (TEMP)'}
    </button>

      <div className="team-header">
        {team.logo_url ? (
          <img src={team.logo_url} alt={team.name} className="team-header-logo" />
        ) : (
          <div className="team-header-placeholder">{team.name}</div>
        )}
        <div>
          <h1>{team.city ? `${team.city} ` : ''}{team.name}</h1>
          <p className="team-header-abbr">{team.abbreviation}</p>
          <p className="team-header-stadium">{team.stadium_name}</p>
        </div>
      </div>

      <h2>Roster ({players.length})</h2>

      {players.length === 0 ? (
        <p>No players on this team yet.</p>
      ) : (
        
        <PlayersTable players={players} />
        
        /* Player Grid instead of Player Table
        <div className="player-grid">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
        */
      )}
    </div>
  );
}

export default TeamDetailPage;