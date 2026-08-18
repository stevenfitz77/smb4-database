import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPlayer, deletePlayer } from '../api/client';
import { PITCHER_POSITIONS, TRAIT_CHEMISTRY, TRAIT_DESCRIPTIONS } from '../constants';
import './PlayerDetailPage.css';
import { getStatColor } from '../utils/statColor';
import ChemistryLabel from '../components/ChemistryLabel';

function PlayerDetailPage() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPlayer(playerId)
      .then(setPlayer)
      .catch(() => setError('Failed to load player.'))
      .finally(() => setLoading(false));
  }, [playerId]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete ${player.first_name} ${player.last_name}? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deletePlayer(playerId);
      navigate('/');
    } catch (err) {
      alert('Failed to delete player.');
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading player...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!player) return <p>Player not found.</p>;

  const isPitcher = PITCHER_POSITIONS.has(player.primary_position);

  const fullHeadshotUrl = player.card_photo_url?.replace('/player-cards', '/player-cards/full').replace('.png', '.webp');

  return (
    <div className="player-detail-page">
      <Link
        to="/"
        state={{ view: isPitcher ? 'pitchers' : 'batters' }}
        className="back-link"
      >
        &larr; {isPitcher ? 'All Pitchers' : 'All Position Players'}
      </Link>

      {import.meta.env.DEV && (
        <Link to={`/admin/players/${player.id}/edit`} className="temp-admin-button">Edit Player (TEMP)</Link>
      )}
      {import.meta.env.DEV && (
        <button onClick={handleDelete} disabled={deleting} className="temp-admin-button temp-admin-delete">
          {deleting ? 'Deleting...' : 'Delete Player (TEMP)'}
        </button>
      )}

      <div className="player-detail-header">
        <div className="player-detail-image">
          {player.card_photo_url ? (
            <img src={fullHeadshotUrl} alt={`${player.first_name} ${player.last_name}`} />
          ) : (
            <div className="player-card-placeholder">No Photo</div>
          )}
        </div>

        <div className="player-detail-info">
          <h1>{player.first_name} {player.last_name}</h1>
          {player.jersey_number && <p className="jersey">#{player.jersey_number}</p>}

          <p>
            <strong>Position:</strong> {player.primary_position}
          </p>

          {!(isPitcher) ? (
            <p>
              <strong>Secondary Position: </strong>
              {player.secondary_positions?.length > 0 ? player.secondary_positions.join(', ') : 'None'}
            </p>
          ) : (<span className="blank-span"></span>)
          }
          <p>
            <strong>League/Group:</strong> {player.player_group}
          </p>

          <p>
            <strong>Team:</strong>{' '}
            {player.team ? (
              <Link to={`/teams/${player.team.id}`} className="player-detail-team-link">{player.team.name}</Link>
            ) : (
              <span className="free-agent">Free Agent</span>
            )}
          </p>

          <p><strong>Chemistry:</strong> <ChemistryLabel chemistry={player.chemistry_type} text={player.chemistry_type} /></p>
         
          <p><strong>Bats:</strong> {player.bat_hand}</p>
          <p><strong>Throws:</strong> {player.throw_hand}</p>

          {isPitcher && (
            <p><strong>Arm Slot:</strong> {player.arm_slot ?? '—'}</p>
          )}
          <p><strong>Rating:</strong> {player.rating}</p>
        </div>
      </div>

      <div className="player-stats">
        <h2>Stats</h2>
        <div className="stat-grid">

          {isPitcher ? (
            <>
              <StatBar label="Velocity" value={player.velocity} />
              <StatBar label="Junk" value={player.junk} />
              <StatBar label="Accuracy" value={player.accuracy} />
              <StatBar label="Speed" value={player.speed} />
              <StatBar label="Fielding" value={player.fielding} />
              <StatBar label="Power" value={player.power} />
              <StatBar label="Contact" value={player.contact} />
            </>
          ) : (
            <>   
              <StatBar label="Power" value={player.power} />
              <StatBar label="Contact" value={player.contact} />
              <StatBar label="Speed" value={player.speed} />
              <StatBar label="Fielding" value={player.fielding} />
              <StatBar label="Arm" value={player.arm} />
            </>
          )}
        </div>

        {isPitcher && player.pitch_arsenal?.length > 0 && (
          <div className="pitch-arsenal">
            <h3>Pitch Arsenal</h3>
            <div className="pitch-tags">
              {player.pitch_arsenal.map((pitch) => (
                <span key={pitch} className="pitch-tag">{pitch}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/*{player.traits?.length > 0 && (
        <div className="player-traits">
          <h2>Traits</h2>
          <div className="trait-list">
            {player.traits.map((trait) => (
              <span key={trait} className="trait-tag">
                <ChemistryLabel chemistry={TRAIT_CHEMISTRY[trait]} text={trait} />
              </span>
            ))}
          </div>
        </div>
      )*/}
      {player.traits?.length > 0 && (
        <div className="player-traits">
          <h2>Traits</h2>
          <div className="trait-list">
            {player.traits.map((trait) => (
              <span key={trait} className="trait-tag">
                <ChemistryLabel chemistry={TRAIT_CHEMISTRY[trait]} text={trait} />
                {TRAIT_DESCRIPTIONS[trait] && (
                  <span className="trait-tooltip">{TRAIT_DESCRIPTIONS[trait]}</span>
                )}
              </span>
            ))}
        </div>
      </div>
    )}
    </div>
  );
}

function StatBar({ label, value }) {
  if (value === null || value === undefined) return null;

  const color = getStatColor(value);

  return (
    <div className="stat-bar">
      <div className="stat-bar-label">
        {label}
      </div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
        <span className="stat-bar-number">{value}</span>
      </div>
    </div>
  );
}

export default PlayerDetailPage;