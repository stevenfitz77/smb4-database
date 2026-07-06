import { Link } from 'react-router-dom';
import SortableTh from './SortableTh';
import { getStatColor } from '../utils/statColor';
import './PlayersTable.css';

function StatCell({ value }) {
  if (value === null || value === undefined) return <td>—</td>;
  const color = getStatColor(value);
  return (
    <td>
      <div className="table-stat-track">
        <div className="table-stat-fill" style={{ width: `${value}%`, backgroundColor: color }} />
        <span className="table-stat-number">{value}</span>
      </div>
    </td>
  );
}

function PitchersTable({ players, sortBy, order, onSort }) {
  return (
    <table className="players-table">
      <thead>
        <tr>
          <th></th>
          <SortableTh label="Name" field="last_name" sortBy={sortBy} order={order} onSort={onSort} />
          <th>Pos</th>
          <th>Team</th>
          <SortableTh label="Age" field="age" sortBy={sortBy} order={order} onSort={onSort} />
          <th>Throws</th>
          <SortableTh label="Rating" field="rating" sortBy={sortBy} order={order} onSort={onSort} />
          <th>Chemistry</th>
          <SortableTh label="VEL" field="velocity" sortBy={sortBy} order={order} onSort={onSort} />
          <SortableTh label="JUNK" field="junk" sortBy={sortBy} order={order} onSort={onSort} />
          <SortableTh label="ACC" field="accuracy" sortBy={sortBy} order={order} onSort={onSort} />
          <th>Pitches</th>
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
            <td>{player.age}</td>
            <td>{player.throw_hand}</td>
            <td>{player.rating}</td>
            <td>{player.chemistry_type}</td>
            <StatCell value={player.velocity} />
            <StatCell value={player.junk} />
            <StatCell value={player.accuracy} />
            <td>{player.pitch_arsenal?.join(', ') ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PitchersTable;