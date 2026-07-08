import { RATINGS, POSITIONS, POSITION_SORT_ORDER } from '../constants';

export function sortPlayers(players, sortBy, order) {
  if (!sortBy) return players;
  const dir = order === 'desc' ? -1 : 1;

  const getValue = (p) => {
    switch (sortBy) {
      case 'name':
        return `${p.last_name} ${p.first_name}`.toLowerCase();
      case 'team':
        return p.team ? p.team.name.toLowerCase() : '';
      case 'rating':
        return RATINGS.indexOf(p.rating);
      case 'secondary_positions': {
        const secs = p.secondary_positions || [];
        if (secs.length === 2) {
          return `0_${[...secs].sort().join('/')}`;
        }
        const idx = secs.length === 1 ? POSITIONS.indexOf(secs[0]) : 99;
        return `1_${String(idx).padStart(2, '0')}`;
      }
      case 'pitch_arsenal':
        return (p.pitch_arsenal || []).length;
      case 'primary_position':
        return POSITION_SORT_ORDER.indexOf(p.primary_position);
      case 'chemistry_type':
      case 'bat_hand':
      case 'throw_hand':
        return (p[sortBy] || '').toLowerCase();
      case 'trait_1':
        return (p.traits?.[0] || '').toLowerCase();
      case 'trait_2':
        return (p.traits?.[1] || '').toLowerCase();
      default:
        return p[sortBy]; // numeric fields: age, power, contact, speed, fielding, arm, velocity, junk, accuracy, jersey_number
    }
  };

  return [...players].sort((a, b) => {
    const va = getValue(a);
    const vb = getValue(b);
    if (va === null || va === undefined) return 1;
    if (vb === null || vb === undefined) return -1;
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
}