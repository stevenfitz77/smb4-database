import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeams } from '../api/client';
import './TeamsPage.css';

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTeams()
      .then((data) => setTeams(data))
      .catch(() => setError('Failed to load teams.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="teams-page">
      <h1>Teams</h1>
      {import.meta.env.DEV && (
        <Link to="/admin/teams/new" className="temp-admin-button">+ New Team (TEMP)</Link>
      )}
      <div className="team-grid">
        {teams.map((team) => (
          <Link to={`/teams/${team.id}`} key={team.id} className="team-card">
            <div className="team-card-logo">
              {team.logo_url ? (
                <img src={team.logo_url} alt={team.name} />
              ) : (
                <div className="team-card-placeholder">{team.name}</div>
              )}
            </div>
            <div className="team-card-info">
              <h3>{team.city ? `${team.city} ` : ''}{team.name}</h3>
              <p>{team.abbreviation}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TeamsPage;