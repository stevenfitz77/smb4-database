import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTeam, getPlayers, deleteTeam } from '../api/client';
import BattersTable from '../components/BattersTable';
import PitchersTable from '../components/PitchersTable';
import { sortPlayers } from '../utils/sortPlayers';
import { isPitcher, isTwoWay } from '../utils/playerRoles';
import './TeamDetailPage.css';

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase();
}

function TeamDetailPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [view, setView] = useState('batters');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([getTeam(teamId), getPlayers({ team_id: teamId })])
      .then(([teamData, playersData]) => {
        setTeam(teamData);
        setPlayers(playersData);
      })
      .catch(() => setError('Failed to load team.'))
      .finally(() => setLoading(false));
  }, [teamId]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

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

  const displayedPlayers = sortPlayers(
    players.filter((p) => view === 'pitchers' ? isPitcher(p) : (!isPitcher(p) || isTwoWay(p))),
    sortBy,
    order
  );

  return (
    <div className="team-detail-page">
      <Link to="/teams" className="back-link">&larr; All Teams</Link>

      {team.stadium_image_url && (
        <img src={team.stadium_image_url} alt={team.stadium_name} className="stadium-banner" />
      )}

      <div className="team-header">
        {team.logo_url ? (
          <img src={team.logo_url} alt={team.name} className="team-header-logo" />
        ) : (
          <div className="team-header-placeholder">{getInitials(team.name)}</div>
        )}
        <div>
          <h1>{team.city ? `${team.city} ` : ''}{team.name}</h1>
          {team.abbreviation && <p className="team-header-abbr">{team.abbreviation}</p>}
          <p className="team-header-stadium">{team.stadium_name}</p>
        </div>
      </div>

      <Link to={`/admin/teams/${team.id}/edit`} className="temp-admin-button">Edit Team (TEMP)</Link>
      <button onClick={handleDelete} disabled={deleting} className="temp-admin-button temp-admin-delete">
        {deleting ? 'Deleting...' : 'Delete Team (TEMP)'}
      </button>

      <h2>Roster ({players.length})</h2>

      <div className="view-toggle">
        <button className={view === 'batters' ? 'active' : ''} onClick={() => setView('batters')}>
          Batters
        </button>
        <button className={view === 'pitchers' ? 'active' : ''} onClick={() => setView('pitchers')}>
          Pitchers
        </button>
      </div>

      {displayedPlayers.length === 0 ? (
        <p>No {view} on this team yet.</p>
      ) : (
        view === 'pitchers'
          ? <PitchersTable players={displayedPlayers} sortBy={sortBy} order={order} onSort={handleSort} />
          : <BattersTable players={displayedPlayers} sortBy={sortBy} order={order} onSort={handleSort} />
      )}
    </div>
  );
}

export default TeamDetailPage;