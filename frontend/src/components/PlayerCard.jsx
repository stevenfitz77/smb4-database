import { Link } from 'react-router-dom';
import './PlayerCard.css';

function PlayerCard({ player }) {
  return (
    <Link to={`/players/${player.id}`} className="player-card">
      <div className="player-card-image">
        {player.card_photo_url ? (
          <img src={player.card_photo_url} alt={`${player.first_name} ${player.last_name}`} />
        ) : (
          <div className="player-card-placeholder">Didn't Show Up To Picture Day</div>
        )}
      </div>
      <div className="player-card-info">
        <h3>{player.first_name} {player.last_name}</h3>
        <p className="player-card-position">{player.primary_position}</p>
        {player.team && <p className="player-card-team">{player.team.name}</p>}
        {!player.team && <p className="player-card-team free-agent">Free Agent</p>}
      </div>
    </Link>
  );
}

export default PlayerCard;