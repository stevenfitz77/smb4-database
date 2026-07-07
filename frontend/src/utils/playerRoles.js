import { PITCHER_POSITIONS, TWO_WAY_TRAITS } from '../constants';

export function isPitcher(player) {
  return PITCHER_POSITIONS.has(player.primary_position);
}

export function isTwoWay(player) {
  return player.traits?.some((t) => TWO_WAY_TRAITS.has(t)) ?? false;
}