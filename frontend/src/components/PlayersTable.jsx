import { Link } from 'react-router-dom';
import './PlayersTable.css';
import { getStatColor } from '../utils/statColor'

function StatCell({ value }) {
  if (value === null || value === undefined) return <td>—</td>;

  const color = getStatColor(value);

  return (
    <td>
      <div className="table-stat-track">
        <div
          className="table-stat-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
        <span className="table-stat-number">{value}</span>
      </div>
    </td>
  );
}


function PlayersTable({ players }) {
  return (
    <table className="players-table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Pos</th>
          <th>Team</th>
          <th>Rating</th>
          <th>Chemistry</th>
          <th>POW</th>
          <th>CON</th>
          <th>SPD</th>
          <th>FLD</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.id}>
            <td className="table-photo-cell">
              {player.card_photo_url ? (
                <img src={player.card_photo_url} alt="" className="table-photo" />
              ) : (
                <div className="table-photo-placeholder" />
              )}
            </td>
            <td>
              <Link to={`/players/${player.id}`} className="table-name-link">
                {player.first_name} {player.last_name}
              </Link>
            </td>
            <td>{player.primary_position}</td>
            <td>
              {player.team
                ? <Link to={`/teams/${player.team.id}`}>{player.team.name}</Link>
                : <span className="free-agent">FA</span>}
            </td>
            <td>{player.rating}</td>
            <td>{player.chemistry_type}</td>
            <StatCell value={player.power} />
            <StatCell value={player.contact} />
            <StatCell value={player.speed} />
            <StatCell value={player.fielding} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PlayersTable;