export function getStatColor(value) {
  if (value < 40) return '#E24B4A';
  if (value < 60) return '#D4537E';
  if (value < 80) return '#0C447C';
  return '#378ADD';
}