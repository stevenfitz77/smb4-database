export function getStatColor(value) {
  if (value < 10) return '#a60012';
  if (value < 20) return '#b80414';
  if (value < 30) return '#a10011';
  if (value < 40) return '#a30011';
  if (value < 50) return '#9c0011';
  if (value < 58) return '#93002f';
  if (value < 70) return '#7c006b';
  if (value < 75) return '#58009e';
  if (value < 80) return '#4f00a6';
  if (value < 90) return '#2d00b0';
  if (value < 95) return '#003fb5';
  return '#378ADD';
}