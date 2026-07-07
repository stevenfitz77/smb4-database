import { Link } from 'react-router-dom';
import SortableTh from './SortableTh';
import { getStatColor } from '../utils/statColor';
import './PlayersTable.css';
import ChemistryLabel from './ChemistryLabel';
import { TRAIT_CHEMISTRY } from '../constants';

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

function BattersTable({ players, sortBy, order, onSort }) {
  return (
    <div className="table-scroll-wrapper">
      <table className="players-table">
        <thead>
          <tr>
            <th></th>
            <SortableTh label="Name" field="name" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="Pos" field="primary_position" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="Sec. Pos" field="secondary_positions" sortBy={sortBy} order={order} onSort={onSort}/>
            <SortableTh label="Team" field="team" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="Age" field="age" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="Bats" field="bat_hand" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="Throws" field="throw_hand" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="Rating" field="rating" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="Chemistry" field="chemistry_type" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="POW" field="power" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="CON" field="contact" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="SPD" field="speed" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="FLD" field="fielding" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="ARM" field="arm" sortBy={sortBy} order={order} onSort={onSort}/>
            <SortableTh label="Trait 1" field="trait_1" sortBy={sortBy} order={order} onSort={onSort} />
            <SortableTh label="Trait 2" field="trait_2" sortBy={sortBy} order={order} onSort={onSort} />
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
              <td>{player.secondary_positions?.join('/') ?? '—'}</td>
              <td>
                {player.team
                  ? <Link to={`/teams/${player.team.id}`}>{player.team.name}</Link>
                  : <span className="free-agent">FA</span>}
              </td>
              <td>{player.age}</td>
              <td>{player.bat_hand}</td>
              <td>{player.throw_hand}</td>
              <td>{player.rating}</td>
              <td><ChemistryLabel chemistry={player.chemistry_type} text={player.chemistry_type} /></td>
              <StatCell value={player.power} />
              <StatCell value={player.contact} />
              <StatCell value={player.speed} />
              <StatCell value={player.fielding} />
              <StatCell value={player.arm} />
              <td>
                {player.traits?.[0]
                  ? <ChemistryLabel chemistry={TRAIT_CHEMISTRY[player.traits[0]]} text={player.traits[0]} />
                  : '—'}
              </td>
              <td>
                {player.traits?.[1]
                  ? <ChemistryLabel chemistry={TRAIT_CHEMISTRY[player.traits[1]]} text={player.traits[1]} />
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BattersTable;